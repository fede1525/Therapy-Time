import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

export const Recovery = () => {
    const { actions } = useContext(Context);
    const [emailInput, setEmailInput] = useState("");
    const [emailError, setEmailError] = useState("");
    const [recoveryMessage, setRecoveryMessage] = useState("");
    const [error, setError] = useState("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailRegex.test(emailInput)) {
            setEmailError("Formato de correo electronico inválido.");
            return;
        } else {
            setEmailError("");
        }

        try {
            await actions.sendPasswordRecoveryRequest(emailInput, setRecoveryMessage);
        } catch (error) {
            setError("Error al enviar la solicitud de recuperación de contraseña.");
        }
    }

    const handleInputChange = () => {
        setEmailError('');
        setRecoveryMessage('');
        setError('');
    };

    return (
        <div className="container">
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="emailInput" className="form-label">Ingresa la dirección de tu correo electrónico, te enviaremos un mail para que recuperes tu contraseña</label>
                        <input type="email"
                            className="form-control"
                            id="emailInput"
                            value={emailInput}
                            onChange={(e) => { setEmailInput(e.target.value); handleInputChange(); }}
                            required
                        />
                    </div>
                    {emailError && (
                        <div className="alert alert-danger" role="alert">
                            {emailError}
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <button type="submit" className="btn">Recuperar contraseña</button>
                </form>
            </div>
        </div>
    );
}

