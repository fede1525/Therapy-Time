import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Navbar } from "../component/navbar"

export const EditProfile = () => {
    const { actions } = useContext(Context)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showConfirm, setShowConfirm] = useState(false)
    const [confirmError, setConfirmError] = useState('')
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [dni, setDni] = useState('')
    const [dniError, setDniError] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()


        const changes = {

        };

        try {

            if (username !== '') {
                changes.username = username
            }

            if (name !== '') {
                changes.name = name
            }

            if (lastname !== '') {
                changes.lastname = lastname
            }

            if (dni !== '') {
                if(!isNumber(dni)){
                    setDniError("Solo se permiten números")
                    return
                } 
                changes.dni = dni
            }

            if (password !== '') {
                if (password !== confirmPassword) {
                    setConfirmError("Las contraseñas no coinciden");
                    return;
                }
                const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

                if (!passwordRegex.test(password)) {
                    setPasswordError("La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.");
                    return;
                }

                changes.password = password

            }

            if (email !== '') {
                const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (!emailRegex.test(email) ) {
                    setEmailError("Debe ingresar una casilla de mail valida")
                    return;
                }

                changes.email = email
            }

            const result = await actions.editProfile(changes);
            console.log("Profile updated successfully:", result);

            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setName('');
            setLastname('');
            setDni('');
            setEmail('');
            setPasswordError('');
            setConfirmError('');
            setEmailError('');
            setDniError('')

            navigate("/profile")
        } catch (error) {
            console.error("Error actualizando el perfil:", error);
        }

    }

    const handleInputChange = () => {
        setPasswordError('');
        setConfirmError('');
        setEmailError('')
        setDniError('')
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirm(!showConfirm)
    }

    const isNumber = (input) => {
        return !isNan(input)
    }

    const navigateProfile = () => {
        navigate("/profile")
    }
 
    return (
        <div className="container">
            <Navbar />
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="username">Nombre de usuario</label>
                            <input type="text"
                                className="form-control"
                                id="username"
                                name="username-input"
                                value={username}
                                maxLength={50}
                                onChange={(e) => { setUsername(e.target.value); handleInputChange() }}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="name">Nombre</label>
                            <input type="text"
                                className="form-control"
                                id="name"
                                name="name-input"
                                value={name}
                                maxLength={25}
                                onChange={(e) => { setName(e.target.value); handleInputChange() }}
                            />
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="lastname">Apellido</label>
                            <input type="text"
                                className="form-control"
                                id="lastname"
                                name="lastname-input"
                                value={lastname}
                                maxLength={25}
                                onChange={(e) => { setLastname(e.target.value); handleInputChange() }}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <div className="input-group">
                                <input type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    id="password"
                                    name="password-input"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); handleInputChange() }}
                                />
                                <button className="btn btn-outline-secondary" type="button" id="button-addon-password"
                                    onClick={togglePasswordVisibility}>
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                        className="eye-icon"
                                    /></button>
                            </div>
                            {passwordError && (
                                <div className="alert alert-danger" role="alert">
                                    {passwordError}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="confirm">Confirmar contraseña</label>
                            <div className="input-group">
                                <input type={showConfirm ? "text" : "password"}
                                    className="form-control"
                                    id="confirm"
                                    name="confirm-input"
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); handleInputChange() }}
                                />
                                <button className="btn btn-outline-secondary" type="button" id="button-addon-confirm"
                                    onClick={toggleConfirmPasswordVisibility}>
                                    <FontAwesomeIcon
                                        icon={showConfirm ? faEyeSlash : faEye}
                                        className="eye-icon"
                                    /></button>
                            </div>
                            {confirmError && (
                                <div className="alert alert-danger" role="alert">
                                    {confirmError}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="dni">DNI</label>
                            <input type="number"
                                className="form-control"
                                id="dni"
                                name="dni-input"
                                value={dni}
                                maxLength={8}
                                onChange={(e) => { setDni(e.target.value); handleInputChange() }}
                            />
                        </div>
                        {dniError && (
                            <div className="alert alert-danger" role="alert">
                                {dniError}
                            </div>
                        )}
                    </div>
                    <div className="col">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email"
                                className="form-control"
                                id="email"
                                name="email-input"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); handleInputChange() }}
                            />
                            {emailError && (
                                <div className="alert alert-danger" role="alert">
                                    {emailError}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="form-group justify-content-center d-flex p-3">
                            <button className="btn btn-primary" type="submit">Guardar</button>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group justify-content-center d-flex p-3">
                            <button className="btn btn-secondary" onClick={navigateProfile}>Volver</button>
                        </div>
                    </div>
                </div>
            </form >
        </div>
    );
}