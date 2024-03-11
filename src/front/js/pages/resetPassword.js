import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

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
        <div className="d-flex justify-content-center vh-100">
            <div className="col-6 d-flex flex-column align-items-center justify-content-center formLogin" style={{ backgroundColor: '#EDE9E9' }}>
                {!showSuccess ? (
                    <form onSubmit={handleSubmit} className="text-center">
                        <div className="token">
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ingrese su nombre de usuario"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{width:'50vh'}}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ingrese tu código de validación"
                                    value={resetToken}
                                    onChange={(e) => setResetToken(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Ingrese su nueva contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Repita su nueva contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit"className="btn" style={{ backgroundColor: '#8A97A6', color: 'whitesmoke', width:'50vh' }}>Guardar cambios</button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </form>
                ) : (
                    <div>
                        <p style={{color:'#8A97A6'}}>La contraseña se ha cambiado exitosamente</p>
                        <p onClick={handleGoToLogin} style={{ cursor: 'pointer', color:'#8A97A6'}}>← Volver al inicio de sesión</p>
                    </div>
                )}
            </div>
            <div className="col-6 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#FAFAFA' }}>
                <img className="animate__backInRight" style={{ width: '75vh', maxWidth: '90%', height: 'auto' }} src="https://github.com/4GeeksAcademy/finalProject-LATAM-pt25/blob/prototype/src/front/img/logo_login.png?raw=true" />
            </div>
        </div>
    );
};
