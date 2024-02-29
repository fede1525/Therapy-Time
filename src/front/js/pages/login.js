import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export const Login = () => {
    const { actions } = useContext(Context);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await actions.loginUser(username, password);

            if (result.ok) {
                const userRole = result.role_id
                setUsername('')
                setPassword('')
                if (userRole === 1) {
                    navigate("/homePatient")
                } else if (userRole === 2) {
                    navigate("/homeTherapist")
                }
            }
        } catch (error) {
            console.error("Error en el inicio de sesión:", error.message);
            setErrorMessage("Error al iniciar sesión.");
        }
    };

    const handleInputChange = () => {
        setErrorMessage('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="container login">
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="username">Nombre de usuario </label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        placeholder="Ingrese su nombre de usuario"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); handleInputChange(); }}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Ingrese su contraseña"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); handleInputChange(); }}
                        required
                    />
                    <button id="toggle-password" type="button" onClick={togglePasswordVisibility}>
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            className="eye-icon"
                        />
                    </button>
                </div>
                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}
                <div className="text-center">
                    <button type="submit" className="btn btnLogin btn-border-radius">
                        Ingresar
                    </button>
                </div>
            </form>
            <div className="mt-3 text-center link">
                <Link to="/recovery">Recuperar contraseña</Link>
            </div>
            <div className="mt-3 text-center link">
                <Link to="/">← Volver</Link>
            </div>
        </div>
    );
};