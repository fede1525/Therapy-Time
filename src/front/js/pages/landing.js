import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Landing = () => {
    const { actions, store } = useContext(Context);
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        age: "",
        phone: "",
        consultation: ""
    });

    //Apertura y cierre de modales
    const openModal = () => {
        setShowModal(true);
    }
    const openSuccessModal = () => {
        setShowSuccessModal(true);
    }
    const closeModal = () => {
        setShowModal(false);
    };
    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };

    //Envio del formulario
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    const handleSubmit = async () => {
        const validationMessages = validateForm(formData);
        setErrorMessages(validationMessages);
        const hasErrors = Object.values(validationMessages).some(msg => msg !== "");
        if (hasErrors) {
            return; 
        }
        try {
            const arrival_date = getCurrentDateTime();
            const response = await actions.sendMessage(
                formData.name, 
                formData.lastname, 
                formData.age, 
                formData.phone, 
                formData.consultation, 
                arrival_date 
            );
            console.log(response); 
            closeModal();
            openSuccessModal();
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
        }
    };

    //Validaciones
    const [errorMessages, setErrorMessages] = useState({
        name: "",
        lastname: "",
        age: "",
        phone: "",
        consultation: ""
    });
    const handleInputFocus = (fieldName) => {
        setErrorMessages(prevErrors => ({
            ...prevErrors,
            [fieldName]: ""
        }));
    };
    const validateForm = (data) => {
        const errors = {};
        if (!data.name || data.name.trim() === "") {
            errors.name = "*El campo es obligatorio";
        } else {
            errors.name = "";
        }      
        if (!data.lastname || data.lastname.trim() === "") {
            errors.lastname = "*El campo es obligatorio";
        } else {
            errors.lastname = "";
        }
        if (!data.age || data.age.trim() === "") {
            errors.age = "*El campo es obligatorio";
        } else if (!/^\d+$/.test(data.age)) {
            errors.age = "La edad debe ser un valor numérico.";
        } else {
            errors.age = "";
        }        
        if (!data.phone || data.phone.trim() === "") {
            errors.phone = "*El campo es obligatorio";
        } else if (!/^\d{10}$/.test(data.phone)) {
            errors.phone = "El teléfono debe contener 10 dígitos numéricos.";
        } else {
            errors.phone = "";
        }
        if (!data.consultation || data.consultation.trim() === "") {
            errors.consultation = "*El campo es obligatorio";
        } else {
            errors.consultation = "";
        }
        return errors;
    };
    
    return (
        <div className="container">
            <h1>Kever</h1>
            <h3>Matches, Mates, Movies</h3>
            <Link to="/login">
                <button>Soy paciente</button>
            </Link>
            <button onClick={openModal}>Primer contacto</button>
            <div className={`modal fade ${showModal ? 'show d-block' : 'd-none'}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Formulario de contacto</h1>
                            <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label htmlFor="name" className="col-form-label">Nombre:</label>
                                        <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} onFocus={() => handleInputFocus("name")} />
                                        <span className="error-message">{errorMessages.name}</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label htmlFor="lastname" className="col-form-label">Apellido:</label>
                                        <input type="text" className="form-control" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} onFocus={() => handleInputFocus("lastname")} />
                                        <span className="error-message">{errorMessages.lastname}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label htmlFor="age" className="col-form-label">Edad:</label>
                                        <input type="text" className="form-control" id="age" name="age" value={formData.age} onChange={handleChange} onFocus={() => handleInputFocus("age")} />
                                        <span className="error-message">{errorMessages.age}</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="col-form-label">Telefono:</label>
                                        <input type="text" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChange} onFocus={() => handleInputFocus("phone")} />
                                        <span className="error-message">{errorMessages.phone}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="mb-3">
                                    <label htmlFor="consultation" className="col-form-label">Motivo de la consulta:</label>
                                    <textarea className="form-control" id="consultation" name="consultation" rows="4" value={formData.consultation} onChange={handleChange} onFocus={() => handleInputFocus("consultation")}></textarea>
                                    <span className="error-message">{errorMessages.consultation}</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal fade ${showSuccessModal ? 'show d-block' : 'd-none'}`} id="successModal" tabIndex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="btn-close" onClick={closeSuccessModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <span>¡Su consulta se ha enviado con exito!</span>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeSuccessModal}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
