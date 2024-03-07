import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Reset_password = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate(); // Hook useNavigate
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
    const handleGoToLogin = () =>{
        navigate('/login');
    }

    return (
        <div className="container d-flex justify-content-center m-5">
            {!showSuccess ? (
                <form onSubmit={handleSubmit} className="text-center">
                    <div className="token">
                        <div className="form-group mb-3">
                            <input
                                type="text"
                                placeholder="Ingrese su nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="text"
                                placeholder="Ingrese tu código de validación"
                                value={resetToken}
                                onChange={(e) => setResetToken(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group mb-3">
                        <input
                            type="password"
                            placeholder="Ingrese su nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <input
                            type="password"
                            placeholder="Repita su nueva contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Guardar cambios</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            ) : (
                <div>
                    <p>La contraseña se ha cambiado exitosamente</p>
                    <p onClick={handleGoToLogin} style={{ cursor: 'pointer' }}>Volver al inicio de sesión</p>
                </div>
            )}
        </div>
    );
};
