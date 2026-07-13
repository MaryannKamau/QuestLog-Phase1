from app import create_app
from app.extensions import db
import os

app = create_app()

with app.app_context():
    # 1. Build the empty tables if they don't exist
    db.create_all()
    
    # 2. Automatically trigger your seed data if your User table is empty
    from app.models import User
    if not User.query.filter_by(id=2).first():
        print("Live Cloud Database empty! Running automated seed file routine...")
        # Import your existing seed function directly from your seed.py file
        try:
            from app.seed import seed_data
            seed_data()
        except ImportError:
            # Fallback if your seed file uses a standard script execution block
            os.system("python seed.py")

if __name__ == "__main__":
    app.run()


