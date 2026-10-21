"""Optional SQLAlchemy seeder for the supplied User and Land models.

Call seed_mock_data(db, password_hasher=your_existing_hash_function).
It refuses to run if users or lands already exist; it never deletes data.
Plants are frontend-only until a Plant model/table is added.
"""
from typing import Callable, Optional
from sqlalchemy.orm import Session

try:  # Supports imports as src.data.seed_data from the project root.
    from ..backend.user_model import User, Land
except ImportError:  # Also supports imports as data.seed_data with src/ on PYTHONPATH.
    from backend.user_model import User, Land

from .mock_users import MOCK_USERS, DEMO_PASSWORD
from .mock_lands import MOCK_LANDS


def seed_mock_data(
    db: Session,
    password_hasher: Optional[Callable[[str], str]] = None,
) -> None:
    """Insert 59 users and 10 lands into an empty development database.

    Pass the same password-hashing function used by your login/signup system if
    these demo users must be able to log in with DEMO_PASSWORD.
    """
    if db.query(User).first() is not None or db.query(Land).first() is not None:
        raise RuntimeError(
            "Mock seeding stopped: users or lands already exist. "
            "Use an empty development database to avoid mixing/deleting data."
        )

    # The User/Land models have circular FK references. Insert users first with
    # assigned_land_id=None, then lands, then restore each user's assignment.
    assigned_land_by_user = {u["id"]: u.get("assigned_land_id") for u in MOCK_USERS}
    for item in MOCK_USERS:
        values = dict(item)
        values["assigned_land_id"] = None
        values["hashed_password"] = (
            password_hasher(DEMO_PASSWORD)
            if password_hasher is not None
            else values["hashed_password"]
        )
        db.add(User(**values))
    db.flush()

    for item in MOCK_LANDS:
        db.add(Land(**item))
    db.flush()

    for user_id, land_id in assigned_land_by_user.items():
        if land_id is not None:
            db.query(User).filter(User.id == user_id).update(
                {User.assigned_land_id: land_id}, synchronize_session=False
            )
    db.commit()
