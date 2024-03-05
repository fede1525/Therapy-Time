from flask_sqlalchemy import SQLAlchemy
from sqlalchemyseeder import ResolvingSeeder
import datetime

db = SQLAlchemy()

import datetime

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)
    role = db.relationship("Role")
    username = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(25), nullable=False)
    lastname = db.Column(db.String(25), nullable=False)
    dni = db.Column(db.String(8), nullable=False, unique=True)
    email = db.Column(db.String(250), unique=True, nullable=False)
    phone = db.Column(db.String(10), nullable=False)
    password = db.Column(db.String(8), nullable=False) 
    virtual_link = db.Column(db.String(250), nullable=True)
    is_active = db.Column(db.Boolean, default=True)

    def __init__(self, *args, **kwargs):
        super(User, self).__init__(*args, **kwargs)
        if not self.password:
            self.password = self.dni
    def __repr__(self):
        return f'<User {self.name} {self.lastname}>'
    def serialize(self):
        return {
            "id": self.id,
            "role_id": self.role.id, 
            "username": self.username,
            "name": self.name,
            "lastname": self.lastname,
            "dni": self.dni,  
            "email": self.email,
            "phone": self.phone,
            "password": self.password,
            "virtual_link": self.virtual_link,
            "is_active": self.is_active
        }

class Role(db.Model):
    __tablename__='role'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f'<Role {self.name}>'
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }
    
def seed():
    seeder = ResolvingSeeder(db.session)
    seeder.register(Role)
    seeder.register(User)
    seeder.load_entities_from_json_file('seedData.json')
    db.session.commit()

class Reservation(db.Model):
    __tablename__='reservation'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship("User")


    def __repr__(self):
        return f'<Reservation {self.id}>'
    def serialize(self):
        return{
            "id": self.id,
            "date": self.date,
            "user_id": self.user_id,
            "time_id": self.time_id,
        }

class AvailabilityDates(db.Model):
    __tablename__='availability_dates'
    id= db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Integer, nullable=False)
    availability = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f'<Availability_dates {self.id}>'
    def serialize(self):
        return{
            "id": self.id,
            "date": self.date,
            "time": self.time,
            "availability": self.availability
        }

class BlockedTokenList(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    jti = db.Column(db.String(100), unique = True)
    date_time = db.Column(db.DateTime, nullable = True)
    expires = db.Column(db.DateTime, nullable = True)





