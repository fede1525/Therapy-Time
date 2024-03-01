import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link} from "react-router-dom";

export const Reset_password = () => {
    const { actions } = useContext(Context);
    const [username, setUsername] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            setError("");
            const response = await actions.handleChangePassword(username, resetToken, newPassword);
            setShowSuccess(true);
        } catch (error) {
            setError(error.message || 'Error al restablecer la contraseña');
        }
    };

    return (
        <div className="container">
            {!showSuccess ? (
                <div className="token">
                    <h4>Recupero de contraseña</h4>
                    <input
                        type="text"
                        placeholder="Ingrese su nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Ingrese tu código de validación"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                    />
                    <form onSubmit={handleSubmit}>
                        <div className="d-flex">
                            <input
                                type="password"
                                placeholder="Ingrese su nueva contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Repita su nueva contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button type="submit">Cambiar</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </form>
                </div>
            ) : (
                <div>
                    <p>La contraseña se ha cambiado exitosamente</p>
                    <p>
                    <Link to="/login">← Volver al inicio de sesion</Link>
                    </p>
                </div>
            )}
        </div>
    );
};


