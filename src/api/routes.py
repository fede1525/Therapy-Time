from flask import Flask, request, jsonify, Blueprint, json
from api.models import db, User, BlockedTokenList, Role, seed, Consultation, AvailabilityDates, GlobalSchedulingEnabled
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_bcrypt import Bcrypt
from itsdangerous import URLSafeTimedSerializer
from werkzeug.security import check_password_hash, generate_password_hash
import os
import datetime, json, string, random 
from sqlalchemy.exc import IntegrityError
import requests
from datetime import datetime, time

app = Flask(__name__)
bcrypt = Bcrypt(app)
api = Blueprint('api', __name__)

CORS(api)

#Variables para el envio de correo electronico
EMAILJS_SERVICE_ID = 'service_yrznk4m'
EMAILJS_TEMPLATE_ID = 'template_ebpnklz'
EMAILJS_USER_ID = 'sm1cI8ucvO4Tvl_jb'
ACCES_TOKEN = '8TAMf4kzLuvMU3avQkTcm'
    
# Alta a nuevo usuario
@api.route('/signup', methods=['POST'])
@jwt_required()
def create_user():
    payload = get_jwt()
    if payload["role"] != 2:
        return "Usuario no autorizado", 403
        
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

    user_to_delete = User.query.get(user_id)

    if not user_to_delete:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user_to_delete)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200

#Listar todos los usuarios (terapeuta)
@api.route('/users', methods=['GET'])
@jwt_required()
def list_users():
    try:
        payload = get_jwt()
        if payload["role"] != 2:
            return "Usuario no autorizado", 403
        users = User.query.filter(User.role_id != 2).all()
        serialized_users = [user.serialize() for user in users]
        return jsonify(serialized_users), 200
    except Exception as e:
        return jsonify({"error": "Error al obtener usuarios"}), 500

#Buscar un solo usuario (terapeuta)
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

#Editar usuario (terapeuta)
@api.route('/edit_user/<int:id>', methods=['PUT'])
@jwt_required()
def edit_user(id):
    payload = get_jwt()
    if payload["role"]!= 2:
        return "Usuario no autorizado", 403
    user = User.query.get(id)
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
            "user": user.username,
            "token": token,
            "isAuthenticated": True,
            "role": user.role_id
        }), 200
    else:
        return jsonify({
            "error": "Error en la autenticacion",
            "isAuthenticated": False
        }), 500

# Cierre de sesión
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

# Conseguir el perfil de usuario (paciente)
@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    
    user = User.query.get(current_user_id)

    if user is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200

# Editar el perfil (paciente)
@api.route('/profile_edit', methods=['PUT'])
@jwt_required()
def edit_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user is None:
        return jsonify({"error": "Usuario no encontrado"}), 404

    if user_id != user.id:
        return "Usuario no autorizado", 403
        
    data = request.get_json()
    print("Data received:", data)

    updated_user_data = {**user.__dict__, **data}

    if 'password' in data:
        new_password_hash = bcrypt.generate_password_hash(data['password']).decode("utf-8")
        user.password = new_password_hash

    for key, value in updated_user_data.items():
        if key != "password":
            setattr(user, key, value)
            
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

# Solicitud de restablecimiento de contraseña
@api.route('/reset_password', methods=['POST'])
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

    return jsonify({"message": "El correo electrónico de recuperación ha sido enviado con exito."}), 200

# Configuracion de nueva contraseña
@api.route('/change_password', methods=['POST'])
def change_password():
    data = request.get_json()
    username = data.get('username')
    token = data.get('token')
    new_password = data.get('new_password')

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "El usuario ingresado es inválido"}), 404 
    if bcrypt.check_password_hash(user.reset_token, token):
        new_password = bcrypt.generate_password_hash(new_password, 10).decode("utf-8")
        user.password = new_password 
        db.session.commit()
        return jsonify({"error": "Contraseña cambiada exitosamente"}), 200
    else:
        return jsonify({"error": "El token ingresado es inválido o ha expirado"}), 401

# Enviar mensaje de primera consulta
@api.route('/message', methods=['POST'])
def create_message():
    data = request.get_json()
    dataName = data['name']
    dataLastname = data['lastname']
    dataAge = data['age']    
    dataPhone = data['phone']
    dataConsultation = data['consultation']
    dataArrival_date = data['arrival_date']  

    if not all([dataName, dataLastname, dataAge, dataPhone, dataConsultation]):
        return jsonify({"error": "Todos los campos son obligatorios."}), 400
    try:
        new_message = Consultation(
            name=dataName,
            lastname=dataLastname,
            age=dataAge,
            phone=dataPhone,
            consultation=dataConsultation,
            arrival_date=dataArrival_date 
        )
        db.session.add(new_message)
        db.session.commit()

        return jsonify({"message": "Mensaje creado exitosamente"}), 201
    except Exception as e:
        return jsonify({"error": "Error al procesar la solicitud.", "details": str(e)}), 500
   
#Listar todas las consultas
@api.route('/consultations', methods=['GET'])
@jwt_required()
def get_consultations():
    payload = get_jwt()
    if payload["role"]!= 2:
        return "Usuario no autorizado", 403
    try:
        consultations = Consultation.query.all()
        serialized_consultations = [consultation.serialize() for consultation in consultations]
        return jsonify(serialized_consultations), 200
    except Exception as e:
        return jsonify({"error": "Error al obtener usuarios"}), 500

# Traer una sola consulta por su ID
@api.route('/consultation/<int:id>', methods=['GET'])
@jwt_required()
def get_one_consultation(id):
    payload = get_jwt()
    if payload['role'] != 2:
        return "Usuario no autorizado", 403
    try:
        consultation = Consultation.query.get(id)
        if consultation:
            return jsonify(consultation.serialize()), 200
        else:
            return jsonify({"message": "Consulta no encontrada"}), 404
    except Exception as e:
        return jsonify({"error": "Error al obtener la consulta"}), 500

#Marcar las consultas como no leidas
@api.route('/consultations/<int:id>/mark_as_unread', methods=['PUT'])
@jwt_required()
def mark_consultation_as_unread(id):
    payload = get_jwt()
    if payload["role"]!= 2:
        return "Usuario no autorizado", 403
    try:
        consultation = Consultation.query.get(id)
        if consultation:
            consultation.is_read = False
            db.session.commit()
            return jsonify({"message": "Consultation marked as unread"}), 200
        else:
            return jsonify({"error": "Consultation not found"}), 404
    except Exception as e:
        return jsonify({"error": "Error marking consultation as unread"}), 500

#Marcar las consultas como leidas
@api.route('/consultations/<int:id>/mark_as_read', methods=['PUT'])
@jwt_required()
def mark_consultation_as_read(id):
    payload = get_jwt()
    if payload["role"]!= 2:
        return "Usuario no autorizado", 403
    try:
        consultation = Consultation.query.get(id)
        if consultation:
            consultation.is_read = True  # Cambiar a True para marcar como leída
            db.session.commit()
            return jsonify({"message": "Consultation marked as read"}), 200
        else:
            return jsonify({"error": "Consultation not found"}), 404
    except Exception as e:
        return jsonify({"error": "Error marking consultation as read"}), 500

#blocking de horarios/fechas (terapeuta)
@api.route('/block_multiple_hours', methods=['POST'])
def block_multiple_hours():
    if request.method == 'POST':
        try:
            data = request.get_json()

            if 'dates' not in data or not isinstance(data['dates'], list):
                return jsonify({'error': 'El campo "dates" es obligatorio y debe ser una lista de fechas con horas'}), 400

            for date_data in data['dates']:
                if 'date' not in date_data or 'times' not in date_data:
                    return jsonify({'error': 'Cada objeto de fecha debe contener tanto "date" como "times"'}), 400

                date = date_data['date']

                if not isinstance(date_data['times'], list):
                    return jsonify({'error': 'El campo "times" debe ser una lista de horas para la fecha especificada'}), 400

                for time in date_data['times']:
                    nueva_disponibilidad = AvailabilityDates(
                        date=date,
                        time=time
                    )
                    db.session.add(nueva_disponibilidad)

            db.session.commit()
            return jsonify({'success': True, 'message': 'Horas bloqueadas exitosamente'}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500

#Obtener fechas NO dispponibles
@api.route('/get_blocked_dates', methods=['GET'])
def unaviable_dates():
    if request.method == 'GET':
        try:
            fechas_no_disponibles = AvailabilityDates.query.all()
            return jsonify([fecha.serialize() for fecha in fechas_no_disponibles]), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

#blocking de fechas y horarios globales
# 1) Definición de opciones para los días y horas
POSSIBLE_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
POSSIBLE_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']

# Marcado de dias y franjas horarias disponibles (terapeuta) 
# 1) Definición de opciones para los días y horas
POSSIBLE_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
POSSIBLE_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']
# 2) Ruta para el endpoint POST
@api.route('/global_enabled', methods=['POST'])
def add_global_enabled():
    data = request.get_json()

    if not isinstance(data, list):
        return jsonify({'error': 'Se esperaba una lista de objetos'}), 400

    for blocking in data:
        if not all(key in blocking for key in ['day', 'start_hour', 'end_hour']):
            return jsonify({'error': 'Falta algún campo en uno de los objetos'}), 400
        
        if blocking['day'] not in POSSIBLE_DAYS:
            return jsonify({'error': 'Valor no válido para day'}), 400

        if blocking['start_hour'] not in POSSIBLE_HOURS or blocking['end_hour'] not in POSSIBLE_HOURS:
            return jsonify({'error': 'Valor no válido para start_hour o end_hour'}), 400

        start_time = time.fromisoformat(blocking['start_hour'])
        end_time = time.fromisoformat(blocking['end_hour'])

        if start_time >= end_time:
            return jsonify({'error': 'La hora de inicio debe ser menor que la hora fin'}), 400

    # Validar solapamiento de horarios solo para el mismo día
    for i, blocking1 in enumerate(data):
        day = blocking1['day']
        start_time_1 = time.fromisoformat(blocking1['start_hour'])
        end_time_1 = time.fromisoformat(blocking1['end_hour'])

        for blocking2 in data[i+1:]:
            if blocking2['day'] == day:
                start_time_2 = time.fromisoformat(blocking2['start_hour'])
                end_time_2 = time.fromisoformat(blocking2['end_hour'])

                if (start_time_1 >= start_time_2 and start_time_1 < end_time_2) or \
                   (end_time_1 > start_time_2 and end_time_1 <= end_time_2) or \
                   (start_time_1 <= start_time_2 and end_time_1 >= end_time_2):
                    return jsonify({'error': 'Los horarios se solapan en el mismo día'}), 400

    # Validar solapamiento con los bloqueos existentes en la base de datos
    for blocking in data:
        start_time = time.fromisoformat(blocking['start_hour'])
        end_time = time.fromisoformat(blocking['end_hour'])

        existing_blockades = GlobalSchedulingEnabled.query.filter_by(day=blocking['day']).all()

        for existing_blockade in existing_blockades:
            existing_start_time = existing_blockade.start_hour
            existing_end_time = existing_blockade.end_hour

            if (start_time >= existing_start_time and start_time < existing_end_time) or \
               (end_time > existing_start_time and end_time <= existing_end_time) or \
               (start_time <= existing_start_time and end_time >= existing_end_time):
                return jsonify({'error': 'La franja horaria se solapa con un bloqueo existente'}), 400

    # Si todas las validaciones pasaron, se agregan los bloqueos
    for blocking in data:
        start_time = time.fromisoformat(blocking['start_hour'])
        end_time = time.fromisoformat(blocking['end_hour'])

        new_blocking = GlobalSchedulingEnabled(day=blocking['day'], start_hour=start_time, end_hour=end_time)
        db.session.add(new_blocking)

    db.session.commit()
    return jsonify({'message': 'Bloqueos agregados correctamente'}), 201

#Traer todos los dias y sus horarios habilitados de forma global
@api.route('/get_global_enabled', methods=['GET'])
def get_global_enabled():
        try:
            global_enabled = GlobalSchedulingEnabled.query.all()
            return jsonify([blocking.serialize() for blocking in global_enabled]), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
#Traer todos los horarios habilitados para un mismo dia
@api.route('/get_global_enabled_by_day/<string:day>', methods=['GET'])
def get_global_enabled_by_day(day):
    try:
        global_enabled = GlobalSchedulingEnabled.query.filter_by(day=day).all()
        return jsonify([blocking.serialize() for blocking in global_enabled]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
