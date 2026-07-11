from flask import Blueprint, jsonify

collections_bp = Blueprint(
    "collections",
    __name__,
    url_prefix="/api/collections",
)


@collections_bp.route("/", methods=["GET"])
def get_collections():
    return jsonify({
        "message": "Collections endpoint working."
    }), 200
