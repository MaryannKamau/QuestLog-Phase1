from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.collection import Collection
from app.models.collection_game import CollectionGame
from app.utils.auth import token_required 

collections_bp = Blueprint('collections', __name__, url_prefix='/api/collections')

@collections_bp.route('', methods=['GET'])
@token_required
def get_user_collections(current_user):
    if not current_user: 
        return jsonify({"error": "Unauthorized session access"}), 401
    
    try:
        user_collections = Collection.query.filter_by(user_id=current_user.id).all()
        output = []
        for col in user_collections:
            games = CollectionGame.query.filter_by(collection_id=col.id).all()
            game_list = [{
                "id": g.id,
                "rawg_game_id": g.rawg_game_id,
                "game_name": g.game_name,
                "game_image": g.game_image
            } for g in games]
            
            output.append({
                "id": col.id,
                "name": col.name,
                "games": game_list
            })
            
        return jsonify(output), 200
        
    except Exception as e:
        return jsonify({"error": f"Internal database error: {str(e)}"}), 500

@collections_bp.route('/add', methods=['POST'])
@token_required
def add_game_to_collection(current_user):
    if not current_user:
        return jsonify({"error": "Unauthorized session access"}), 401

    data = request.get_json()
    if not data or 'collection_name' not in data or 'rawg_game_id' not in data:
        return jsonify({"error": "Missing mandatory collection parameters"}), 400
        
    target_name = data['collection_name']
    
    try:
        user_collection = Collection.query.filter_by(user_id=current_user.id, name=target_name).first()
        
        if not user_collection:
            user_collection = Collection(name=target_name, user_id=current_user.id)
            db.session.add(user_collection)
            db.session.commit()
            
        new_game = CollectionGame(
            collection_id=user_collection.id,
            rawg_game_id=data['rawg_game_id'],
            game_name=data['game_name'],
            game_image=data['game_image']
        )
        
        db.session.add(new_game)
        db.session.commit()
        
        return jsonify({"message": f"Successfully committed {data['game_name']} into your database {target_name} list!"}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to save game to database: {str(e)}"}), 500

@collections_bp.route('/game/<int:game_id>', methods=['DELETE'])
@token_required
def remove_game_from_collection(game_id, current_user):
    if not current_user:
        return jsonify({"error": "Unauthorized session access"}), 401

    try:
        target_game_row = CollectionGame.query.get(game_id)
        if not target_game_row:
            return jsonify({"error": "Target collection asset database identity row not found"}), 404
            
        db.session.delete(target_game_row)
        db.session.commit()
        
        return jsonify({"message": "Successfully erased game collection row tracking entry"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to remove game from database: {str(e)}"}), 500

