from flask import Blueprint, request, jsonify

from app.extensions import db
from app.models.review import Review
from app.schemas.review_schema import (
    review_schema,
    reviews_schema,
)

reviews_bp = Blueprint("reviews", __name__)


@reviews_bp.route("/", methods=["GET"])
def get_reviews():
    reviews = Review.query.all()
    return reviews_schema.dump(reviews), 200


@reviews_bp.route("/<int:id>", methods=["GET"])
def get_review(id):
    review = Review.query.get_or_404(id)
    return review_schema.dump(review), 200


@reviews_bp.route("/", methods=["POST"])
def create_review():
    data = request.get_json()

    review = Review(
        game_id=data["game_id"],
        rating=data["rating"],
        comment=data.get("comment"),
        user_id=data["user_id"],
    )

    db.session.add(review)
    db.session.commit()

    return review_schema.dump(review), 201


@reviews_bp.route("/<int:id>", methods=["PATCH"])
def update_review(id):
    review = Review.query.get_or_404(id)

    data = request.get_json()

    review.rating = data.get("rating", review.rating)
    review.comment = data.get("comment", review.comment)

    db.session.commit()

    return review_schema.dump(review), 200


@reviews_bp.route("/<int:id>", methods=["DELETE"])
def delete_review(id):
    review = Review.query.get_or_404(id)

    db.session.delete(review)
    db.session.commit()

    return jsonify({
        "message": "Review deleted successfully."
    }), 200
