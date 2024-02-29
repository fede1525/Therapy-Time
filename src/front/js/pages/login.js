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
            if (result.success) {
                navigate("/home");
                setUsername('');
                setPassword('');
            } else {
                setErrorMessage(result.error);
            }
        } catch (error) {
            console.error("Error en el inicio de sesión:", error.message);
            setErrorMessage("Error de red"); 
        }  
    };

    const handleInputChange = () => {
        setErrorMessage('');
    };

    return (
        <div className="container login">
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => {setUsername(e.target.value); handleInputChange(); }}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value); handleInputChange(); }}
                        required
                    />
                </div>
                {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                )}
                <div className="text-center">
                    <button type="submit" className="btn btnLogin">
                        Login
                    </button>
                </div>
            </form>
            <div className="mt-3 text-center link">
                <p>
                     Forgot your password? <Link to="/recovery">Recover it here</Link>
                </p>
                <p>
                    <Link to="/">← Go Back</Link>
                </p>
            </div>
        </div>
    );
};
