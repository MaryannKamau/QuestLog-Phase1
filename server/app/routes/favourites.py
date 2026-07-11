from flask import Blueprint, jsonify

favourites_bp = Blueprint(
    "favourites",
    __name__,
    url_prefix="/api/favourites",
)


@favourites_bp.route("/", methods=["GET"])
def get_favourites():
    return jsonify({
        "message": "Favourites endpoint working."
    }), 200
