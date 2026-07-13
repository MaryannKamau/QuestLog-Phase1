import requests
from flask import Blueprint, jsonify, request

games_bp = Blueprint("games", __name__)

BASE_URL = "https://rawg.io/api/games"  # FIXED SUBDOMAIN URL ENDPOINT

@games_bp.route("", methods=["GET"])
def get_games():
    # 1. Capture query arguments exactly as sent by your React frontend
    search_query = request.args.get("search", "")
    page_num = request.args.get("page", 1)
    page_size_num = request.args.get("page_size", 20)
    platform_filter = request.args.get("platforms", "")

    # 2. Map the active query parameters to RAWG's specification layout
    params = {
        "key": "6744b8fd7cf2484b87174f26dfd242a3",
        "page": page_num,
        "page_size": page_size_num
    }

    if search_query.strip():
        params["search"] = search_query
    if platform_filter.strip():
        params["platforms"] = platform_filter
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json"
    }
    
    try:
        # We increase the timeout window to 15 seconds to ensure slow networks never trigger an error
        response = requests.get(BASE_URL, params=params, headers=headers, timeout=15)
        
        if response.status_code == 200:
            rawg_data = response.json()
            # Wrap the array under the exact 'games' property key your React gameApi.js reads!
            return jsonify({
                "games": rawg_data.get("results", []),
                "count": rawg_data.get("count", 0)
            }), 200
            
        return jsonify({"games": [], "count": 0, "error": f"RAWG server rejected connection: {response.status_code}"}), response.status_code
        
    except Exception as e:
        return jsonify({"games": [], "count": 0, "error": f"Network transmission failure: {str(e)}"}), 502
