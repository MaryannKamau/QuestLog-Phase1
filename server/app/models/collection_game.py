from app.extensions import db


class CollectionGame(db.Model):
    __tablename__ = "collection_games"

    id = db.Column(db.Integer, primary_key=True)

    game_id = db.Column(db.Integer, nullable=False)

    collection_id = db.Column(
        db.Integer,
        db.ForeignKey("collections.id"),
        nullable=False
    )

    collection = db.relationship(
        "Collection",
        back_populates="games"
    )
