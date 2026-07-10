from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Favourite
import requests

favourites_bp = Blueprint("favourites", __name__)

@favourites_bp.route("/user/<int:user_id>", methods=["GET"])
def get_user_favourites(user_id):
    favs = Favourite.query.filter_by(user_id=user_id).all()
    output = []
    RAWG_API_KEY = "6744b8fd7cf2484b87174f26dfd242a3"
    
    for f in favs:
        fav_entry = {
            "id": f.id,
            "game_id": f.game_id,
            "name": f"Game ID: {f.game_id}",
            "background_image": "https://placeholder.com"
        }
        try:
            # FIXED SUBDOMAIN URL ENDPOINT
            rawg_url = f"https://rawg.io/api/games/{f.game_id}"
            res = requests.get(rawg_url, params={"key": RAWG_API_KEY}, headers={"User-Agent": "Mozilla/5.0"}, timeout=5)
            if res.status_code == 200:
                game_details = res.json()
                fav_entry["name"] = game_details.get("name", fav_entry["name"])
                fav_entry["background_image"] = game_details.get("background_image", fav_entry["background_image"])
        except Exception as e:
            print(f"RAWG favorites fault: {str(e)}")
        output.append(fav_entry)
    return jsonify(output), 200

@favourites_bp.route("/toggle", methods=["POST"])
def toggle_favourite():
    data = request.get_json()
    user_id = data.get("user_id")
    game_id = data.get("game_id")
    if not user_id or not game_id:
        return jsonify({"error": "Missing user_id or game_id"}), 400
    existing_fav = Favourite.query.filter_by(user_id=user_id, game_id=game_id).first()
    if existing_fav:
        db.session.delete(existing_fav)
        db.session.commit()
        return jsonify({"status": "unfavorited"}), 200
    else:
        new_fav = Favourite(user_id=user_id, game_id=game_id)
        db.session.add(new_fav)
        db.session.commit()
        return jsonify({"status": "favorited"}), 201
