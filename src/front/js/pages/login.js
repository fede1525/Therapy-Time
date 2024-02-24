import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Login = () => {
    const { actions } = useContext(Context);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await actions.loginUser(username, password);
            navigate("/home");
            setUsername('');
            setPassword('');
        } catch (error) {
            console.error("Error en el inicio de sesión:", error.message);
            setErrorMessage(error.message);
        }
    };

    const handleInputChange = () => {
        setErrorMessage('');
    };

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
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Ingrese su contraseña"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); handleInputChange(); }}
                        required
                    />
                    <button id="toggle-password" type="button" class="d-none"
                        aria-label="Show password as plain text. Warning: this will display your password on the screen.">
                    </button>

                </div>
                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}
                <div className="text-center">
                    <button type="submit" className="btn btnLogin">
                        Iniciar sesión
                    </button>
                </div>
            </form>
            <div className="mt-3 text-center link">
                <p>
                    ¿No tienes una cuenta? <Link to="/signup">Crear cuenta</Link>
                </p>
                <p>
                    ¿Olvidaste tu contraseña? <Link to="/recovery"> Recuperar contraseña</Link>
                </p>
                <p>
                    <Link to="/">← Volver</Link>
                </p>
            </div>
        </div>
    );
};