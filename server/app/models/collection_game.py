from app.extensions import db

class CollectionGame(db.Model):
    __tablename__ = 'collection_games'

    id = db.Column(db.Integer, primary_key=True)
    collection_id = db.Column(db.Integer, db.ForeignKey('collections.id', ondelete='CASCADE'), nullable=False)
    rawg_game_id = db.Column(db.Integer, nullable=False)
    game_name = db.Column(db.String(255), nullable=False)
    game_image = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "collection_id": self.collection_id,
            "rawg_game_id": self.rawg_game_id,
            "game_name": self.game_name,
            "game_image": self.game_image
        }