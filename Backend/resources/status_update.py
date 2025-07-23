from flask import request
from flask_restful import Resource
from models import db, StatusUpdate
#from models.status_update import StatusUpdate
from datetime import datetime


class StatusUpdateResource(Resource):
    def get(self, id=None):
        if id:
            update = StatusUpdate.query.get(id)
            if not update:
                return {"error": "Status update not found"}, 404
            return update.to_dict(), 200
        else:
            updates = StatusUpdate.query.all()
            return [u.to_dict() for u in updates], 200

    def post(self):
        data = request.get_json()

        try:
            new_update = StatusUpdate(
                report_id=data["report_id"],
                updated_by=data["updated_by"],
                status=data["status"],
                timestamp=datetime.utcnow()
            )
            db.session.add(new_update)
            db.session.commit()
            return new_update.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400

    def patch(self, id):
        update = StatusUpdate.query.get(id)
        if not update:
            return {"error": "Status update not found"}, 404

        data = request.get_json()
        if "status" in data:
            update.status = data["status"]
        if "timestamp" in data:
            update.timestamp = datetime.utcnow()

        db.session.commit()
        return update.to_dict(), 200

    def delete(self, id):
        update = StatusUpdate.query.get(id)
        if not update:
            return {"error": "Status update not found"}, 404

        db.session.delete(update)
        db.session.commit()
        return {}, 204
