# adminResource.py

from flask_restful import Resource, reqparse
from flask import current_app, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.baseModel import db
from models.userModel import User
from models.recordModel import Record
from datetime import datetime, timezone
from utils import send_email_notification
# from utils import send_sms_notification  # Uncomment if implemented


def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == "admin"


class AdminResource(Resource):
    @jwt_required()
    def get(self, record_id=None):
        current_user = get_jwt_identity()

        if not is_admin(current_user):
            return {"message": "Admin access required"}, 403

        if record_id:
            record = Record.query.get(record_id)
            if not record:
                return {"message": "Record not found"}, 404
            return self.serialize_record(record), 200

        page = request.args.get("page", default=1, type=int)
        per_page = min(request.args.get("per_page", default=10, type=int), 100)

        records = Record.query.paginate(
            page=page, per_page=per_page, error_out=False
        ).items
        return {"records": [self.serialize_record(r) for r in records]}, 200

    @jwt_required()
    def patch(self, record_id):
        current_user = get_jwt_identity()

        if not is_admin(current_user):
            return {"message": "Admin access required"}, 403

        record = Record.query.get(record_id)
        if not record:
            return {"message": "Record not found"}, 404

        parser = reqparse.RequestParser()
        parser.add_argument("status", required=True, help="Status is required")
        args = parser.parse_args()

        valid_statuses = ["pending", "under investigation", "rejected", "resolved"]
        if args["status"] not in valid_statuses:
            return {"message": "Invalid status"}, 400

        old_status = record.status
        new_status = args["status"]

        try:
            record.status = new_status
            record.updated_at = datetime.now(timezone.utc)
            db.session.commit()

            self.notify_user(record, old_status, new_status)

            current_app.logger.info(
                f"Admin {current_user} updated record #{record.id} from {old_status} to {new_status}"
            )

            return {
                "message": f"Status updated from {old_status} to {new_status}",
                "record": {
                    "id": record.id,
                    "title": record.title,
                    "status": record.status,
                    "user_id": record.user_id,
                },
            }, 200

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(
                f"Admin {current_user} failed to update record #{record.id}: {str(e)}"
            )
            return {"message": f"Error updating status: {str(e)}"}, 500

    @jwt_required()
    def delete(self, record_id):
        current_user = get_jwt_identity()

        if not is_admin(current_user):
            return {"message": "Admin access required"}, 403

        record = Record.query.get(record_id)
        if not record:
            return {"message": "Record not found"}, 404

        try:
            db.session.delete(record)
            db.session.commit()

            current_app.logger.info(f"Admin {current_user} deleted record #{record.id}")

            return {"message": f"Record #{record_id} deleted successfully"}, 200

        except Exception as e:
            db.session.rollback()
            current_app.logger.error(
                f"Admin {current_user} failed to delete record #{record.id}: {str(e)}"
            )
            return {"message": f"Error deleting record: {str(e)}"}, 500

    def serialize_record(self, record):
        return {
            "id": record.id,
            "type": record.type,
            "title": record.title,
            "description": record.description,
            "latitude": record.latitude,
            "longitude": record.longitude,
            "images": record.images or [],
            "status": record.status,
            "created_at": record.created_at.isoformat() if record.created_at else None,
            "updated_at": record.updated_at.isoformat() if record.updated_at else None,
            "user_id": record.user_id,
        }

    def notify_user(self, record, old_status, new_status):
        if old_status == new_status:
            return

        user = User.query.get(record.user_id)
        if not user or not user.email:
            return

        subject = f"Update on Your Emergency Report #{record.id}"
        body = f"""
        Hi {user.username},

        Your report titled "{record.title}" has a status change.

        Old Status: {old_status}
        New Status: {new_status}

        Please check your dashboard for more details.
        """

        try:
            send_email_notification(user.email, subject, body)

            
        except Exception as e:
            current_app.logger.error(f"Failed to notify user #{user.id}: {str(e)}")
