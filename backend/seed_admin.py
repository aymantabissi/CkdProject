from db.mongo import users_collection
import bcrypt

def create_admins():
    admins = [
        {
            "name": "Mohammed",
            "email": "mohammed@nephroai.com",
            "password": "admin123",
        },
        {
            "name": "Ayman",
            "email": "ayman@nephroai.com",
            "password": "admin123",
        },
        {
            "name": "Mehdi",
            "email": "mehdi@nephroai.com",
            "password": "admin123",
        },
    ]

    for admin in admins:
        if users_collection.find_one({"email": admin["email"]}):
            print(f"{admin['email']} already exists")
            continue

        hashed_pw = bcrypt.hashpw(
            admin["password"].encode(),
            bcrypt.gensalt()
        )

        users_collection.insert_one({
            "name": admin["name"],
            "email": admin["email"],
            "password": hashed_pw,
            "role": "admin"
        })

        print(f"Admin created: {admin['email']}")

create_admins()