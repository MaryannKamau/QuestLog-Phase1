from marshmallow import Schema, fields


class FavouriteSchema(Schema):
    id = fields.Int(dump_only=True)
    game_id = fields.Int(required=True)
    created_at = fields.DateTime(dump_only=True)
    user_id = fields.Int(required=True)


favourite_schema = FavouriteSchema()
favourites_schema = FavouriteSchema(many=True)
