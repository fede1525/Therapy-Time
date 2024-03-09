import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import logo_login from "../../img/logo_login.png"

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
            <div className="col-6 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#E6DADA' }}>
                <form onSubmit={handleLogin}>
                    <div className="form-group p-3">
                        <label htmlFor="username">Nombre de usuario :</label>
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
                    <div className="form-group p-3">
                        <label htmlFor="password">Contraseña :</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                id="password"
                                name="password"
                                placeholder="Ingrese su contraseña"
                                value={password}
                                onChange={handleInputChange}
                                onFocus={() => handleInputFocus("password")}
                            />
                            <button className="btn" type="button" id="button-addon-password"
                                onClick={toggleShowPassword}>
                                <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    className="eye-icon"
                                /></button>
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
                    <div className="text-center">
                        <button type="submit" className="btn rounded-pill" style={{ backgroundColor: '#8A97A6' }}>
                            Ingresar
                        </button>
                    </div>
                </form>
                <div className="mt-3 text-center link">
                    <Link to="/recovery">Recuperar contraseña</Link>
                </div>
            </div>
            <div className="col-6 d-flex flex-column align-items-center justify-content-center">
                <img className="animate__backInRight" src={logo_login} />
            </div>
        </div>
    );
};