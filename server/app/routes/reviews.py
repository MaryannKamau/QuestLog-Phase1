from flask import Blueprint, jsonify

reviews_bp = Blueprint(
    "reviews",
    __name__,
    url_prefix="/api/reviews",
)


@reviews_bp.route("/", methods=["GET"])
def get_reviews():
    return jsonify({
        "message": "Reviews endpoint working."
    }), 200
