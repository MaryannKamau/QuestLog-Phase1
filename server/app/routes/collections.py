from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Collection, CollectionGame
import requests

collections_bp = Blueprint("collections", __name__)

@collections_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user_collections(user_id):
    collections = Collection.query.filter_by(user_id=user_id).all()
    output = []
    RAWG_API_KEY = "6744b8fd7cf2484b87174f26dfd242a3"

    for c in collections:
        games = CollectionGame.query.filter_by(collection_id=c.id).all()
        games_list = []
        for g in games:
            game_entry = {
                "id": g.id,
                "game_id": g.game_id,
                "name": f"Game ID: {g.game_id}",
                "background_image": "https://placeholder.com"
            }
            try:
                # FIXED SUBDOMAIN URL ENDPOINT
                rawg_url = f"https://rawg.io/api/games/{g.game_id}"
                res = requests.get(rawg_url, params={"key": RAWG_API_KEY}, headers={"User-Agent": "Mozilla/5.0"}, timeout=5)
                if res.status_code == 200:
                    game_details = res.json()
                    game_entry["name"] = game_details.get("name", game_entry["name"])
                    game_entry["background_image"] = game_details.get("background_image", game_entry["background_image"])
            except Exception as e:
                print(f"RAWG collection fault: {str(e)}")
            games_list.append(game_entry)
        output.append({"id": c.id, "name": c.name, "games": games_list})
    return jsonify(output), 200

@collections_bp.route("", methods=["POST"])
def create_collection():
    data = request.get_json()
    if not data or 'name' not in data or 'user_id' not in data:
        return jsonify({"error": "Missing name or user_id"}), 400
    new_collection = Collection(name=data['name'], user_id=data['user_id'])
    db.session.add(new_collection)
    db.session.commit()
    return jsonify({"id": new_collection.id, "name": new_collection.name}), 201

@collections_bp.route("/<int:collection_id>/add-game", methods=["POST"])
def add_game_to_collection(collection_id):
    data = request.get_json()
    if not data or 'game_id' not in data:
        return jsonify({"error": "Missing game_id"}), 400
    exists = CollectionGame.query.filter_by(collection_id=collection_id, game_id=data['game_id']).first()
    if exists:
        return jsonify({"message": "Game already in this collection"}), 400
    new_game = CollectionGame(collection_id=collection_id, game_id=data['game_id'])
    db.session.add(new_game)
    db.session.commit()
    return jsonify({"message": "Game added to collection successfully"}), 201

@collections_bp.route("/game/<int:game_entry_id>", methods=["DELETE"])
def remove_game_from_collection(game_entry_id):
    game_entry = CollectionGame.query.get(game_entry_id)
    if not game_entry:
        return jsonify({"error": "Game entry not found"}), 404
    db.session.delete(game_entry)
    db.session.commit()
    return jsonify({"message": "Game removed from collection"}), 200

@collections_bp.route("/<int:collection_id>", methods=["DELETE"])
def delete_collection(collection_id):
    collection = Collection.query.get(collection_id)
    if not collection:
        return jsonify({"error": "Collection not found"}), 404
    db.session.delete(collection)
    db.session.commit()
    return jsonify({"message": "Collection dropped successfully"}), 200
