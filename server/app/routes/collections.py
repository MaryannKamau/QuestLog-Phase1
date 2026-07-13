from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.collection import Collection
from app.models.collection_game import CollectionGame

# Adopts their unified URL prefixing structure
collections_bp = Blueprint("collections", __name__, url_prefix="/api/collections")


def current_user_id():
    # Helper to pull the dynamic ID out of the JWT token string securely
    identity = get_jwt_identity()
    return int(identity) if identity else None


def find_owned_collection(collection_id):
    collection = db.session.get(Collection, collection_id)
    if not collection:
        return None, (jsonify({"error": "Collection not found."}), 404)
    return collection, None



@collections_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user_collections(user_id):
    collections = Collection.query.filter_by(user_id=user_id).order_by(Collection.created_at.desc()).all()
    return jsonify([collection.to_dict() for collection in collections]), 200


@collections_bp.route("/", methods=["GET"])
@jwt_required()
def get_collections():
    uid = current_user_id()
    collections = Collection.query.filter_by(user_id=uid).order_by(Collection.created_at.desc()).all()
    return jsonify([collection.to_dict() for collection in collections]), 200


@collections_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_collection(id):
    collection, error = find_owned_collection(id)
    if error:
        return error
    return jsonify(collection.to_dict()), 200


@collections_bp.route("", methods=["POST"])
@collections_bp.route("/", methods=["POST"])
def create_collection():
    data = request.get_json(silent=True) or {}
    name = data.get("name", "").strip()
    user_id = data.get("user_id") or current_user_id()

    if not name:
        return jsonify({"error": "Collection name is required."}), 400
    if not user_id:
        return jsonify({"error": "User identity is required."}), 400

    collection = Collection(
        name=name,
        description=data.get("description"),
        user_id=int(user_id),
    )

    db.session.add(collection)
    db.session.commit()
    return jsonify(collection.to_dict()), 201



@collections_bp.route("/<int:collection_id>/add-game", methods=["POST"])
def legacy_add_game(collection_id):
    data = request.get_json(silent=True) or {}
    try:
        game_id = int(data.get("game_id"))
    except (TypeError, ValueError):
        return jsonify({"error": "A valid game_id is required."}), 400

    existing_game = CollectionGame.query.filter_by(collection_id=collection_id, game_id=game_id).first()
    if existing_game:
        return jsonify({"message": "Game already in this collection"}), 200

    collection_game = CollectionGame(collection_id=collection_id, game_id=game_id)
    db.session.add(collection_game)
    db.session.commit()
    return jsonify(collection_game.to_dict()), 201



@collections_bp.route("/game/<int:game_entry_id>", methods=["DELETE"])
def legacy_remove_game(game_entry_id):
    game_entry = db.session.get(CollectionGame, game_entry_id)
    if not game_entry:
        return jsonify({"error": "Game entry not found"}), 404
    db.session.delete(game_entry)
    db.session.commit()
    return jsonify({"message": "Game removed from collection"}), 200


@collections_bp.route("/<int:id>", methods=["DELETE"])
def delete_collection(id):
    collection = db.session.get(Collection, id)
    if not collection:
        return jsonify({"error": "Collection not found"}), 404
    db.session.delete(collection)
    db.session.commit()
    return jsonify({"message": "Collection dropped successfully"}), 200
