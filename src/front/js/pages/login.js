import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../../styles/login.css";

export const Login = () => {
    const { actions, store } = useContext(Context);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState({ password: '', networkError: '' });
    const [errorMessages, setErrorMessages] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        setErrorMessages(errors);

        if (Object.values(errors).every(error => error === "")) {
            try {
                const result = await actions.loginUser(username, password);
                if (result.success) {
                    navigate("/home");
                } else {
                    setErrorMessage(prevState => ({ ...prevState, password: "La contraseña es invalida" }));
                }
            } catch (error) {
                console.error("Error en el inicio de sesión:", error.message);
                setErrorMessage(prevState => ({ ...prevState, networkError: "Error de red" }));
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "username") {
            setUsername(value);
        } else if (name === "password") {
            setPassword(value);
        }
        setErrorMessage(prevState => ({ ...prevState, password: '' }));
    };

    const handleInputFocus = (fieldName) => {
        setErrorMessages(prevErrors => ({
            ...prevErrors,
            [fieldName]: ""
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (username.trim() === "") {
            errors.username = "*El campo es obligatorio";
        } else {
            const existingUser = store.user.filter(user => user.username === username);
            if (!existingUser) {
                errors.username = "El usuario no está registrado";
            } else {
                errors.username = "";
                if (password.trim() === "") {
                    errors.password = "*El campo es obligatorio";
                }
                else {
                    errors.password = ""
                }
            }
        }
        return errors;
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="d-flex justify-content-center vh-100">
            <div className="col-6 d-flex flex-column align-items-center justify-content-center formLogin" style={{ backgroundColor: '#EDE9E9' }}>
                <form onSubmit={handleLogin}>
                    <div className="form-group mb-4">
                        <label htmlFor="username" className="labelLogin">Nombre de usuario :</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            placeholder="Ingrese su nombre de usuario"
                            value={username}
                            onChange={handleInputChange}
                            onFocus={() => handleInputFocus("username")}
                        />
                        {errorMessages.username && <p className="text-danger">{errorMessages.username}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="labelLogin">Contraseña :</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                id="password"
                                name="password"
                                value={password}
                                placeholder="Ingrese su contraseña"
                                onChange={handleInputChange}
                                onFocus={() => handleInputFocus("password")}
                                style={{ paddingRight: '40px' }} 
                            />
                            <div className="input-group-append" style={{ position: 'absolute', right: 0, top: 0 }}>
                                <button className="btn" type="button" id="button-addon-password" onClick={toggleShowPassword}>
                                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="eye-icon" style={{color:'#B2A79F'}}/>
                                </button>
                            </div>
                        </div>
                        {errorMessages.password && <p className="text-danger">{errorMessages.password}</p>}
                    </div>
                    {errorMessage.password && (
                        <span className="text-danger">{errorMessage.password}</span>
                    )}
                    {errorMessage.networkError && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage.networkError}
                        </div>
                    )}
                    <div className="text-start link mb-4">
                        <Link to="/recovery" style={{color:'#a76f6d', fontSize: '14px'}}>Recuperar contraseña</Link>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Link to='/' style={{color:'#8A97A6'}}>&#x27F5; Volver</Link>
                        </div>
                        <div className="text-end">
                            <button type="submit" className="btn" style={{ backgroundColor: '#8A97A6', color: 'whitesmoke' }}>
                                Ingresar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="col-6 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#FAFAFA' }}>
                <img className="animate__backInRight" style={{width: '75vh', maxWidth: '90%', height: 'auto'}} src="https://github.com/4GeeksAcademy/finalProject-LATAM-pt25/blob/prototype/src/front/img/logo_login.png?raw=true" />
            </div>
        </div>  
    );
};