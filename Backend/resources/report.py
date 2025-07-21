from flask_restful import Resource, reqparse
from models import db, Report
from sqlalchemy.exc import SQLAlchemyError

class ReportResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('incident', type=str, required=True, help='Incident type is reqired')
    parser.add_argument('Description', type=str, help='Please provide a description')
    parser.add_argument('Latitude',required=True,  type=float, help='Latitude not provided')
    parser.add_argument('Longitude', required=True, type=float, help='Longitude not provided')
    parser.add_argument('Media', type=str, help='Media not attached')


    def post(self):
        data = ReportResource.parser.parse_args()

        try:
            report = Report(**data)
            db.session.add(report)
            db.session.commit()
            return report.to_dict(), 201
        except Exception as e:
            return {'message': str(e)}, 400
        except SQLAlchemyError:
            db.session.rollback()
            return {'message':'Database error'}, 500

    def get(self, report_id=None):
        if report_id:
            report = Report.query.get(report_id)
            if report:
                return report.to_dict()
            
        reports = Report.query.all()
        return [r.to_dict() for r in reports]
    
    def patch(self, report_id):
        report = Report.query.get(report_id)
        if not report:
            return {"message": "Report not found"}, 404
        
        data = ReportResource.parser.parse_args()
        for key, value in data.items():
            setattr(report, key, value)
        
        try:
            db.session.commit()
            return report.to_dict()
        except Exception as e:
            return {"message": str(e)}, 400
        except SQLAlchemyError:
            db.session.rollback()
            return {"message": "Database error"}, 500

    def delete(self, report_id):
        report = Report.query.get(report_id)
        if not report:
            return {"message": "Report not found"}, 404
        
        try:
            db.session.delete(report)
            db.session.commit()
            return {"message": "Report deleted"}
        except SQLAlchemyError:
            db.session.rollback()
            return {"message": "Database error"}, 500