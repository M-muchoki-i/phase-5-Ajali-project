from flask_restful import Resource
from models import db, Report
from flask import request
#from flask_jwt_extended import jwt_required
from sqlalchemy.exc import SQLAlchemyError

class ReportResource(Resource):
    parser = reqparse.RequestParser()
    # parser.add_argument('Incident', type=str, required=True, help='Incident type is required')
    parser.add_argument('message', type=str, help='Please provide a message')
    parser.add_argument('Location',required=True,  type=float, help='Location not provided')

    # parser.add_argument('Media', type=str, help='Media not attached')

    def get(self, id=None):
        if id:
            report = Report.query.get(id=id)

            if report:
                return report.to_dict()
            
        reports = Report.query.all()
        return [r.to_dict() for r in reports]

    def post(self):

        data = request.get_json()


        try:
            report = Report(
              message =  data["message"],    
            )
            db.session.add(report)
            db.session.commit()
            return report.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 400
        # except SQLAlchemyError:
        #     db.session.rollback()
        #     return {'message':'Database error'}, 500

    
    def patch(self, id=None):
        report = Report.query.get(id=id)
        if not report:
            return {"message": "Report not found"}, 404
        
        data = request.get_json()
        if 'message' in data:
            self.message = data['message']        
        try:
            db.session.commit()
            return report.to_dict()
        except Exception as e:
            return {"message": str(e)}, 400
        except SQLAlchemyError:
            db.session.rollback()
            return {"message": "Database error"}, 500

    def delete(self, id=None):
        report = Report.query.get(id=id)
        if not report:
            return {"message": "Report not found"}, 404
        
        try:
            db.session.delete(report)
            db.session.commit()
            return {"message": "Report deleted"}
        except SQLAlchemyError:
            db.session.rollback()
            return {"message": "Database error"}, 500


        
class MediaResource(Resource):
    def get(self, id=None):
        report = Report.query.get(id=id)
        if report:
            media = report.media_attachment
            return [m.to_dict() for m in media], 200
        else:
            return {'message':'Media not found'}, 403
        
    def delete(self, id = None):
        report = Report.query.get(id=id)
        if report:
            media = [m.to_dict() for m in report.media_attachment]
            try:
                db.session.delete(media)
                db.session.commit()
                return {'message':'Media deleted successfully'}, 200
            except SQLAlchemyError:
                db.session.rollback()
                return {'message':'Database error: Media not deleted'}, 500



