import requests
from flask import Blueprint, jsonify, request,current_app

games_bp = Blueprint("games", __name__)

BASE_URL = "https://api.rawg.io/api/games"


@games_bp.route("", methods=["GET"])
def get_games():
    search_query = request.args.get("search", "")
    page_num = request.args.get("page", 1)
    page_size_num = request.args.get("page_size", 20)
    platform_filter = request.args.get("platforms", "")

    params = {
        "key": current_app.config["RAWG_API_KEY"],
        "page": page_num,
        "page_size": page_size_num,
    }

    if search_query.strip():
        params["search"] = search_query

    if platform_filter.strip():
        params["platforms"] = platform_filter

    try:
        response = requests.get(
            BASE_URL,
            params=params,
            timeout=15,
        )

        if response.status_code == 200:
            rawg_data = response.json()

            return jsonify({
                "games": rawg_data.get("results", []),
                "count": rawg_data.get("count", 0)
            }), 200

        return jsonify({
            "games": [],
            "count": 0,
            "error": "Failed to fetch games"
        }), response.status_code

    except Exception as e:
        return jsonify({
            "games": [],
            "count": 0,
            "error": str(e)
        }), 500
