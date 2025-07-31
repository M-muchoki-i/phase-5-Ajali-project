from flask_restful import Resource, reqparse
from models import db, Report
from flask import request
from flask_jwt_extended import jwt_required, get_jwt
from sqlalchemy.exc import SQLAlchemyError


class ReportResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument(
        "incident", type=str, required=True, help="incident type is required"
    )
    parser.add_argument("details", type=str, help="Please provide a detailed message")

    @jwt_required()
    def get(self, id=None):
        claims = get_jwt()
        role = claims.get("role")
        if role != "admin":
            return {"message": "Admin access required"}, 403

        if id:
            report = Report.query.get(id)
            if report:
                return report.to_dict(), 200
            return {"message": "Report not found"}, 404

        reports = Report.query.all()
        return [r.to_dict() for r in reports], 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        args = self.parser.parse_args()

        try:
            report = Report(
                user_id=data["user_id"],
                incident=args["incident"],
                details=args.get("details"),
                latitude=data["latitude"],
                longitude=data["longitude"],
            )
            db.session.add(report)
            db.session.commit()
            return report.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {"message": str(e)}, 400

    @jwt_required()
    def patch(self, id=None):
        report = Report.query.get(id)
        if not report:
            return {"message": "Report not found"}, 404

        data = request.get_json()
        for field in ["user_id", "details", "incident", "latitude", "longitude"]:
            if field in data:
                setattr(report, field, data[field])

        try:
            db.session.commit()
            return report.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {"message": str(e)}, 400

    @jwt_required()
    def delete(self, id=None):
        report = Report.query.get(id)
        if not report:
            return {"message": "Report not found"}, 404

        try:
            db.session.delete(report)
            db.session.commit()
            return {"message": "Report deleted"}, 200
        except SQLAlchemyError:
            db.session.rollback()
            return {"message": "Database error"}, 500


class MediaResource(Resource):
    def get(self, id=None):
        report = Report.query.get(id)
        if report:
            media = report.media_attachment
            return [m.to_dict() for m in media], 200
        return {"message": "Media not found"}, 404

    def delete(self, id=None):
        report = Report.query.get(id)
        if not report:
            return {"message": "Report not found"}, 404

        try:
            for media in report.media_attachment:
                db.session.delete(media)
            db.session.commit()
            return {"message": "Media deleted successfully"}, 200
        except SQLAlchemyError:
            db.session.rollback()
            return {"message": "Database error: Media not deleted"}, 500
