import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Landing = () => {
    const { actions, store } = useContext(Context);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        age: "",
        phone: "",
        consultation: ""
    });

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const response = await actions.sendMessage(formData.name, formData.lastname, formData.age, formData.phone, formData.consultation);
            console.log(response); 
            closeModal();
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
        }
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
                                        <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label htmlFor="lastname" className="col-form-label">Apellido:</label>
                                        <input type="text" className="form-control" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label htmlFor="age" className="col-form-label">Edad:</label>
                                        <input type="text" className="form-control" id="age" name="age" value={formData.age} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="col-form-label">Telefono:</label>
                                        <input type="text" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="mb-3">
                                    <label htmlFor="consultation" className="col-form-label">Motivo de la consulta:</label>
                                    <textarea className="form-control" id="consultation" name="consultation" rows="4" value={formData.consultation} onChange={handleChange}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
