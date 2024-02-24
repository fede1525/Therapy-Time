import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


export const Signup = () => {
  const { actions } = useContext(Context);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setConfirmError("Las contraseñas no coinciden");
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Debe ingresar un email valido")
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial");
      return;
    }

    try {
      const data = await actions.createUser(username, email, password);
      console.log('Usuario creado con éxito:', data);
      navigate("/login");
    } catch (error) {
      console.error('Error creating user:', error.message);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleInputChange = () => {
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="container signup">
      <div className="row">
        <div className="col-md-5">
          <h1 className="titleSignup">Crear paciente</h1>
        </div>
        <div className="col-md-7">
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Nombre de usuario</label>
              <input
                type="username"
                className="form-control"
                placeholder="Ingrese su nombre de usuario"
                value={username}
                onChange={(e) => { setUsername(e.target.value); handleInputChange(); }}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Ingrese su email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); handleInputChange(); }}
                required
              />
              {emailError && (
                <div className="alert alert-danger" role="alert">
                  {emailError}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Ingresa su contraseña"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); handleInputChange(); }}
                  required
                />
                <button className="btn btn-outline-secondary" type="button" id="button-addon-password"
                  onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="eye-icon"
                  /></button>
              </div>
            </div>
            {passwordError && (
              <div className="alert alert-danger" role="alert">
                {passwordError}
              </div>
            )}
            <div className="form-group">
              <label>Repetir contraseña</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Vuelva a escribir su contraseña"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); handleInputChange(); }}
                  required
                />
                <button className="btn btn-outline-secondary" type="button" id="button-addon-confirm"
                  onClick={toggleConfirmPasswordVisibility}>
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                    className="eye-icon"
                  /></button>
              </div>
            </div>
            {confirmError && (
              <div className="alert alert-danger" role="alert">
                {confirmError}
              </div>
            )}
            <button type="submit" className="btn btnSignup">
              Crear
            </button>
          </form>
        </div>
      </div>
      <div className="row aling-items-center">
        <div className="col-md-5">
          <Link to="/login" className="linkSignup">
            ← Volver
          </Link>
        </div>
        <div className="col-md-7">
          <hr className="mt-4" />
        </div>
      </div>
    </div>
  );
};

