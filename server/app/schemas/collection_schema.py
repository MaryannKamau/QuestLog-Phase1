from marshmallow import Schema, fields


class CollectionSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    user_id = fields.Int(required=True)


collection_schema = CollectionSchema()
collections_schema = CollectionSchema(many=True)
