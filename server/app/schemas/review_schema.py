from marshmallow import Schema, fields


class ReviewSchema(Schema):
    id = fields.Int(dump_only=True)
    game_id = fields.Int(required=True)
    rating = fields.Int(required=True)
    comment = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    user_id = fields.Int(required=True)


review_schema = ReviewSchema()
reviews_schema = ReviewSchema(many=True)
