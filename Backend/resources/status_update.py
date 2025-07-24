from flask import request
from flask_restful import Resource
from models import db, StatusUpdate
#from models.status_update import StatusUpdate
from datetime import datetime
# from flask_jwt_extended import jwt_required



class  StatusUpdateResource(Resource):

    def get(self, id=None):
        if id :
            status_updates = StatusUpdate.query.get(id)
            if not status_updates:
                return {"error": "Status update not found"}, 404
            return status_updates.to_dict(), 200
        else:
            status_updates = StatusUpdate.query.all()
            return [s.to_dict() for s in status_updates], 200

    def post(self):
        data = request.get_json()

        try:
            new_status_update = StatusUpdate(
                report_id=data["report_id"],
                updated_by=data["updated_by"],
                status=data["status"],
                timestamp=datetime.utcnow()
            )
            db.session.add(new_status_update)
            db.session.commit()
            return new_status_update.to_dict(), 201
        except Exception as e:
            return {"error": str(e)}, 400

    def patch(self, id):
        status_update = StatusUpdate.query.get(id)
        if not status_update:
            return {"error": "Status update not found"}, 404

        data = request.get_json()
        if "status" in data:
            status_update.status = data["status"]
        if "timestamp" in data:
            status_update.timestamp = datetime.utcnow()

        db.session.commit()
        return status_update.to_dict(), 200

    def delete(self, id):
        status_update = StatusUpdate.query.get(id)
        if not status_update:
            return {"error": "Status update not found"}, 404

        db.session.delete(status_update)
        db.session.commit()
        return {}, 204
