from app import create_app
from app.extensions import db

from app.models.user import User
from app.models.collection import Collection
from app.models.collection_game import CollectionGame
from app.models.favourite import Favourite
from app.models.review import Review

app = create_app()

with app.app_context():

    print("Clearing database...")

    CollectionGame.query.delete()
    Favourite.query.delete()
    Review.query.delete()
    Collection.query.delete()
    User.query.delete()

    db.session.commit()

    print("Creating users...")

    charles = User(
        username="charles",
        email="charles@example.com"
    )
    charles.set_password("password123")

    maryann = User(
        username="maryann",
        email="maryann@example.com"
    )
    maryann.set_password("password123")

    fatuma = User(
        username="fatuma",
        email="fatuma@example.com"
    )
    fatuma.set_password("password123")

    stephen = User(
        username="stephen",
        email="stephen@example.com"
    )
    stephen.set_password("password123")

    db.session.add_all([
        charles,
        maryann,
        fatuma,
        stephen
    ])

    db.session.commit()

    print("Creating collections...")

    collection1 = Collection(
        name="Favourite RPGs",
        description="Best RPG games",
        user_id=charles.id
    )

    collection2 = Collection(
        name="Action Games",
        description="Fast-paced action games",
        user_id=maryann.id
    )

    db.session.add_all([
        collection1,
        collection2
    ])

    db.session.commit()

    print("Adding games to collections...")

    db.session.add_all([
        CollectionGame(
            game_id=3498,
            collection_id=collection1.id
        ),
        CollectionGame(
            game_id=4200,
            collection_id=collection1.id
        ),
        CollectionGame(
            game_id=3328,
            collection_id=collection2.id
        )
    ])

    print("Creating favourites...")

    db.session.add_all([
        Favourite(
            game_id=3498,
            user_id=charles.id
        ),
        Favourite(
            game_id=3328,
            user_id=maryann.id
        ),
        Favourite(
            game_id=4200,
            user_id=fatuma.id
        )
    ])

    print("Creating reviews...")

    db.session.add_all([
        Review(
            game_id=3498,
            rating=5,
            comment="Amazing game!",
            user_id=charles.id
        ),
        Review(
            game_id=3328,
            rating=4,
            comment="Really enjoyable.",
            user_id=maryann.id
        ),
        Review(
            game_id=4200,
            rating=5,
            comment="One of my favourites.",
            user_id=stephen.id
        )
    ])

    db.session.commit()

    print("Database seeded successfully!")
