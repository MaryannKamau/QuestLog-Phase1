import requests
from flask import Blueprint, jsonify, request, current_app

games_bp = Blueprint("games", __name__, url_prefix="/api/games")

# Secure, correct subdomain API endpoint mapping layout
BASE_URL = "https://api.rawg.io/api/games"


@games_bp.route("", methods=["GET"])
@games_bp.route("/", methods=["GET"])
def get_games():
    search_query = request.args.get("search", "")
    page_num = request.args.get("page", 1)
    page_size_num = request.args.get("page_size", 20)
    platform_filter = request.args.get("platforms", "")
    genre_filter = request.args.get("genre", "")
    sort_by_filter = request.args.get("sort_by", "")

    # Adopts their clean, dynamic configuration environment key variables
    params = {
        "key": current_app.config["RAWG_API_KEY"],
        "page": page_num,
        "page_size": page_size_num,
    }

    if search_query.strip():
        params["search"] = search_query

    if platform_filter.strip():
        params["platforms"] = platform_filter

    if genre_filter.strip():
        params["genres"] = genre_filter

    if sort_by_filter.strip():
        params["ordering"] = sort_by_filter

    headers = {
        "User-Agent": "QuestLog Game Tracker Engine/1.0",
        "Accept": "application/json"
    }

    try:
        response = requests.get(BASE_URL, params=params, headers=headers, timeout=15)
        
        if response.status_code == 200:
            rawg_data = response.json()
            
            # UNIFIED SCHEMA FIX: Returns BOTH structural layouts so no frontend files crash!
            return jsonify({
                "results": rawg_data.get("results", []),
                "games": rawg_data.get("results", []),
                "count": rawg_data.get("count", 0)
            }), 200
            
        return jsonify({
            "results": [], 
            "games": [], 
            "count": 0, 
            "error": f"RAWG catalog proxy failure: {response.status_code}"
        }), response.status_code
        
    except Exception as e:
        return jsonify({
            "results": [], 
            "games": [], 
            "count": 0, 
            "error": f"Network proxy transmission error: {str(e)}"
        }), 502


# Phase 3 Integrated Helper Endpoint: Direct individual video game detail lookups
@games_bp.route("/<int:game_id>/", methods=["GET"])
def get_game_details(game_id):
    params = {"key": current_app.config["RAWG_API_KEY"]}
    try:
        res = requests.get(f"https://api.rawg.io/api/{game_id}", params=params, timeout=10)
        if res.status_code == 200:
            return jsonify(res.json()), 200
        return jsonify({"error": "Failed to look up game particulars"}), res.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Phase 3 Integrated Helper Endpoint: Direct video game screenshot gallery lookups
@games_bp.route("/<int:game_id>/screenshots/", methods=["GET"])
def get_game_screenshots_lookup(game_id):
    params = {"key": current_app.config["RAWG_API_KEY"]}
    try:
        res = requests.get(f"https://api.rawg.io/api/{game_id}/screenshots", params=params, timeout=10)
        if res.status_code == 200:
            return jsonify(res.json()), 200
        return jsonify({"error": "Failed to load screenshots data"}), res.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
@games_bp.route("/<int:game_id>/reviews", methods=["GET"])
def get_game_reviews(game_id):
    
    
    return jsonify([]), 200

