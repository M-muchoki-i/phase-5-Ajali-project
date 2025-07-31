# adminResource.py

from flask_restful import Resource, reqparse
from flask import current_app, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.baseModel import db
from models.userModel import User
from models.recordModel import Record
from datetime import datetime, timezone
from utils import send_email_notification


def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.role == "admin"


class AdminResource(Resource):
    @jwt_required()
    def get(self, record_id=None):
        user_id = get_jwt_identity()

        if not is_admin(user_id):
            return {"message": "Admin access required"}, 403

        if record_id is not None:
            record = Record.query.get(record_id)
            if not record:
                return {"message": "Record not found"}, 404
            return self.format_record(record), 200

        page = request.args.get("page", 1, type=int)
        per_page = min(request.args.get("per_page", 10, type=int), 100)
        records = Record.query.paginate(
            page=page, per_page=per_page, error_out=False
        ).items

        return {"records": [self.format_record(r) for r in records]}, 200

    @jwt_required()
    def patch(self, record_id):
        user_id = get_jwt_identity()

        if not is_admin(user_id):
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

        try:
            old_status = record.status
            record.status = args["status"]

            record.updated_at = datetime.now(timezone.utc)
            db.session.commit()

            self.send_notification(record, old_status, args["status"])

            return {
                "message": f"Status updated from {old_status} to {args['status']}",
                "record": {
                    "id": record.id,
                    "title": record.title,
                    "status": record.status,
                    "user_id": record.user_id,
                },
            }, 200

        except Exception as e:
            db.session.rollback()
            return {"message": f"Error updating status: {str(e)}"}, 500

    def format_record(self, record):
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

    def send_notification(self, record, old_status, new_status):
        if old_status == new_status:
            return

        user = User.query.get(record.user_id)
        if not user or not user.email:
            return

        subject = f"Status Update for Record #{record.id}"
        body = f"""
        Hello {user.username},

        The status of your record "{record.title}" has been updated:
         - Old Status: {old_status}
         - New Status: {new_status}
        """

        try:
            send_email_notification(user.email, subject, body)

        except Exception as e:
            current_app.logger.error(f"Failed to send notification: {str(e)}")
