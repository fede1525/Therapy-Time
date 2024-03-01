import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

export const Recovery = () => {
    const { actions } = useContext(Context);
    const [emailInput, setEmailInput] = useState("");
    const [emailError, setEmailError] = useState("");
    const [recoveryMessage, setRecoveryMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailRegex.test(emailInput)) {
            setEmailError("Formato de correo electrónico inválido.");
            return;
        } else {
            setEmailError("");
        }

        try {
            setLoading(true);
            const response = await actions.handleResetPassword(emailInput);
            setLoading(false);
            if (response && response.message) {
                setRecoveryMessage(response.message);
            }
        } catch (error) {
            setLoading(false);
            setError(error.message || 'Error al enviar la solicitud de recuperación de contraseña.');
        }
        
    }

    const handleEmailChange = (e) => {
        setEmailInput(e.target.value);
    }

    const handleEmailFocus = () => {
        setEmailError(""); 
        setError("");
    }

    return (
        <div className="container">
            <div>
                {!recoveryMessage &&
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="emailInput" className="form-label">Ingresa la dirección de tu correo electrónico, te enviaremos un mail para que recuperes tu contraseña</label>
                            <input type="text" className="form-control" id="emailInput" value={emailInput} onChange={handleEmailChange} onFocus={handleEmailFocus} required />
                            {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="submit" className="btn btn-primary" disabled={loading}>Recuperar contraseña</button>
                    </form>
                }
                {recoveryMessage && <p>{recoveryMessage}</p>}
            </div>
        </div>
    );
}
