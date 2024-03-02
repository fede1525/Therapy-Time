from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, BlockedTokenList, Role, seed
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
from werkzeug.security import check_password_hash, generate_password_hash
import os
import datetime, json, string, random
import requests


app = Flask(__name__)
bcrypt = Bcrypt(app)
api = Blueprint('api', __name__)

CORS(api)

EMAILJS_SERVICE_ID = 'service_yrznk4m'
EMAILJS_TEMPLATE_ID = 'template_ebpnklz'
EMAILJS_USER_ID = 'sm1cI8ucvO4Tvl_jb'
ACCES_TOKEN = '8TAMf4kzLuvMU3avQkTcm'

# Serializador para generar y verificar tokens
serializer = URLSafeTimedSerializer(os.environ['SECRET_KEY'])

# Crear el token
def generate_password_reset_token(user_id, role_id):
    data = {'user_id': user_id, 'role_id': role_id}
    return serializer.dumps(data, salt='password-reset-salt')

# Expira en 1 hora (3600 segundos)
def verify_password_reset_token(token, max_age=3600):
    # Deserializar el token para ver el id del usuario
    try:
        user_id = serializer.loads(token, salt='password-reset', max_age=max_age)
        return user_id
    except Exception as e:
        return None
    
# Alta a nuevo usuario
@api.route('/signup', methods=['POST'])
def create_user():
    data = request.get_json()
    role_id = data.get("role_id", 1)
    username = data.get("username")
    name = data.get("name")
    lastname = data.get("lastname")
    dni = data.get("dni")  
    phone = data.get("phone")
    email = data.get("email")
    virtual_link = data.get("virtual_link")

    existing_email_user = User.query.filter_by(email=email).first()
    if existing_email_user:
        return jsonify({"error": "Este correo ya está registrado."}), 400

    existing_dni_user = User.query.filter_by(dni=dni).first()
    if existing_dni_user:
        return jsonify({"error": "Este DNI ya está registrado."}), 400

    default_password = bcrypt.generate_password_hash(dni, 10).decode("utf-8")

    new_user = User(
        role_id=role_id,
        username=username,
        name=name,
        lastname=lastname,
        dni=dni, 
        email=email,
        phone=phone,
        password=default_password, 
        virtual_link=virtual_link
    )

    db.session.add(new_user)
    db.session.commit()

    token = create_access_token(new_user.id, new_user.role_id) 

    return jsonify({"message": "Usuario creado exitosamente", "token": token}), 201

# Seeder
@api.route('/seed', methods=['POST', 'GET'])
def handle_hello():
    seed()
    response_body ={
        "message": "Data cargada"
    }
    return jsonify(response_body, 200)

# Eliminar un usuario
@api.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
   
    current_user_id = get_jwt_identity()

    current_user = User.query.get(current_user_id)
    payload = get_jwt()
    if payload["role"] != 2:
        return "Usuario no autorizado", 403

    if current_user.email != 'marinasmargara@gmail.com':
        return jsonify({"error": "You are not authorized to delete users"}), 403

    user_to_delete = User.query.get(user_id)

    if not user_to_delete:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user_to_delete)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200

#Listar todos los usuarios
@api.route('/users', methods=['GET'])
@jwt_required()
def list_users():
    payload = get_jwt()
    if payload["role"] != 2:
        return "Usuario no autorizado", 403
    users = User.query.all()
    serialized_users = [user.serialize() for user in users]
    return jsonify(serialized_users), 200

#Buscar un solo usuario
@api.route('/get_user/<int:id>', methods=['GET'])
@jwt_required()  
def get_user(id):
    payload = get_jwt()
    if payload["role"]!=2:
        return "Usuario no autorizado", 403
    user = User.query.get(id) 
    if user:
        return jsonify(user.serialize()), 200  
    else:
        return jsonify({"message": "Usuario no encontrado"}), 404  

#Editar usuario
@api.route('/edit_user/<int:id>', methods=['PUT'])
@jwt_required()
def edit_user(id):
    payload = get_jwt()
    user = User.query.get(id)
    if payload["id"]!= user.id:
        return "Usuario no autorizado", 403
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404
    
    data = request.get_json()
    user.username = data['username']
    user.name = data['name']
    user.lastname = data['lastname']
    user.dni = data['dni']
    user.phone = data['phone']
    user.virtual_link = data['virtual_link']
    user.email = data['email']
    user.is_active = data['is_active']

    db.session.commit()

    return jsonify({"message": "Usuario actualizado exitosamente"}), 200

# Login de usuario
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if user is None:
        return jsonify({"error": "Usuario incorrecto"}), 404
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Contraseña incorrecta"}), 401  



    if bcrypt.check_password_hash(user.password, password):
        payload = {"role": user.role_id}
        token = create_access_token(identity=user.id, additional_claims=payload)
        return jsonify({
            "message": "Inicio de sesión exitoso",
            "token": token,
            "isAuthenticated": True,
            "role": user.role_id
        }), 200
    else:
        return jsonify({
            "error": "Error en la autenticacion",
            "isAuthenticated": False
        }), 500

# Para cerrar sesión
@api.route('/logout', methods=['POST'])
@jwt_required()
def logout_user():
    payload = get_jwt()
    jti = payload['jti']
    exp = datetime.datetime.fromtimestamp(payload['exp'])
    blocked_token = BlockedTokenList(jti = jti, expires = exp)

    db.session.add(blocked_token)
    db.session.commit()

    return jsonify({"msg": "Sesión cerrada exitosamente."}), 200

# Para conseguir el perfil de usuario
@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    payload = get_jwt()
    user = User.query.get(id)

    if payload["id"] != user.id:
        return "Usuario no autorizado", 403

    if user is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200

# Para editar el perfil
@api.route('/profile_edit', methods=['PUT'])
@jwt_required()
def edit_profile():
    user_id = get_jwt_identity()
    user = User.query.get(id)

    if user_id != user.id:
        return "Usuario no autorizado", 403
        
    if user is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    data = request.get_json()

    for key in data:
        if key == "password":
            continue
        user[key] = data[key]
       
    """ if 'username' in data:
        user.username = data['username']

    if 'name' in data:
        user.name = data['name']
    
    if 'lastname' in data:
        user.lastname = data['lastname']

    if 'birth_date' in data:
        user.birth_date = data['birth_data']

    if 'phone' in data:
        user.phone = data['phone'] """

    if 'password' in data:
        user.password = bcrypt.generate_password_hash(data['password']).decode("utf-8")

    db.session.commit()

    return jsonify({"message": "Perfil actualizado"}), 200

# Funcion para el envio de correo electronico
def enviar_correo_recuperacion(email, token):
    datos_correo = {
        'service_id': EMAILJS_SERVICE_ID, 
        'template_id': EMAILJS_TEMPLATE_ID,  
        'user_id': EMAILJS_USER_ID ,  
        'accessToken': ACCES_TOKEN,
        'template_params': {
            'email': email,
            'token': token
        }
    }

    print("Datos del correo a enviar:")
    print(json.dumps(datos_correo, indent=4))  

    headers = {'Content-Type': 'application/json'}

    response = requests.post('https://api.emailjs.com/api/v1.0/email/send', json=datos_correo, headers=headers)

    if response.status_code == 200:
        print("Correo electrónico de recuperación enviado con éxito!")
    else:
        print("Error al enviar el correo electrónico de recuperación:", response.text)

# Endpoint restablecimiento de contraseña
@api.route('/reset_password', methods=['POST'])
@jwt_required()
def reset_password():
    data = request.get_json()
    email = data.get('email')

    

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "No se encontró ningún usuario con ese correo electrónico"}), 404

    token = ''.join(random.choices(string.digits, k=8))

    hashed_temp_code = bcrypt.generate_password_hash(token).decode("utf-8")

    token_expiry = datetime.datetime.now() + datetime.timedelta(minutes=30)
    user.token_expiry = token_expiry

    user.reset_token = hashed_temp_code
    db.session.commit()

    enviar_correo_recuperacion(email, token)

    return jsonify({"message": "Correo electrónico de recuperación enviado"}), 200

# Endpoint para cambiar la contraseña
@api.route('/change_password', methods=['POST'])
def change_password():
    data = request.get_json()
    username = data.get('username')
    token = data.get('token')
    new_password = data.get('new_password')

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"mensaje": "El usuario ingresado es inválido"}), 404 
    if bcrypt.check_password_hash(user.reset_token, token):
        new_password = bcrypt.generate_password_hash(new_password, 10).decode("utf-8")
        user.password = new_password 
        db.session.commit()
        return jsonify({"mensaje": "Contraseña cambiada exitosamente"}), 200
    else:
        return jsonify({"mensaje": "El token ingresado es inválido o ha expirado"}), 401
