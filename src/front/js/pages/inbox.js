import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export const Inbox = () => {
    const { store, actions } = useContext(Context);
    const [nameFilter, setNameFilter] = useState("");
    const [selectedConsultations, setSelectedConsultations] = useState([]);
    const [modalSuccess, setModalSuccess] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [activeTab, setActiveTab] = useState("inbox");

    useEffect(() => {
        actions.getConsultations();
    }, []);

    const handleNameFilterChange = (event) => {
        setNameFilter(event.target.value);
    };

    const handleCheckboxChange = (consultationId) => {
        setSelectedConsultations(prevState => {
            if (prevState.includes(consultationId)) {
                return prevState.filter(id => id !== consultationId);
            } else {
                return [...prevState, consultationId];
            }
        });
    };

    const openModalSuccess = () => {
        setModalSuccess(true);
    }

    const closeModalSuccess = () => {
        setModalSuccess(false);
    }

    const openConfirmationModal = () => { 
        setShowConfirmationModal(true);
    }

    const closeConfirmationModal = () => { 
        setShowConfirmationModal(false);
    }
    
    const handleMarkAsUnread = async () => {
        try {
            await Promise.all(selectedConsultations.map(id => actions.changeStatusConsultation(id)));
            setSelectedConsultations([]);
            await actions.getConsultations();
        } catch (error) {
            console.error("Error al marcar las consultas como no leídas:", error.message);
        }
    };

    const handleDeleteSelectedConsultations = async () => {
        try {
            await Promise.all(selectedConsultations.map(id => actions.logicalDeletionMessage(id)));
            setSelectedConsultations([]);
            await actions.getConsultations();
            openModalSuccess();
        } catch (error) {
            console.error("Error al eliminar las consultas seleccionadas:", error.message);
        }
    };

    const handlePhysicalDeletion = async (id) => {
        try {
            await actions.physicalDeletionMessage(id);
            await actions.getConsultations();
            openConfirmationModal();
        } catch (error) {
            console.error("Error al eliminar el mensaje:", error.message);
        }
    };

    const confirmPhysicalDeletion = async () => {
        try {
            await actions.getConsultations(); 
            closeConfirmationModal(); 
            openModalSuccess(); 
        } catch (error) {
            console.error("Error al confirmar la eliminación:", error.message);
        }
    };

    const filteredConsultations = store.consultations.filter(consultation => {
        if (activeTab === "inbox") {
            return !consultation.is_deleted;
        } else if (activeTab === "deleted") {
            return consultation.is_deleted;
        }
    }).filter(consultation =>
        consultation.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
        consultation.lastname.toLowerCase().includes(nameFilter.toLowerCase())
    );

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="container mt-5">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "inbox" ? "active" : ""}`} onClick={() => handleTabChange("inbox")}>Bandeja de entrada</button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "deleted" ? "active" : ""}`} onClick={() => handleTabChange("deleted")}>Papelera</button>
                </li>
            </ul>
            <div>
                <div className="mb-3 d-flex align-items-center">
                    <input type="text" className="form-control mr-2" placeholder="Buscar por nombre o apellido" value={nameFilter} onChange={handleNameFilterChange} />
                    {activeTab === "inbox" && (
                        <>
                            <button onClick={handleMarkAsUnread} disabled={selectedConsultations.length === 0}><FontAwesomeIcon icon={faEnvelope} /></button>
                            <button onClick={handleDeleteSelectedConsultations} disabled={selectedConsultations.length === 0}><FontAwesomeIcon icon={faTrash} /></button>
                        </>
                    )}
                    {activeTab === "deleted" && (
                        <a href="#" onClick={confirmPhysicalDeletion}>Eliminar permanentemente</a>
                    )}
                </div>
                <table className="table table-hover">
                    <tbody>
                        {filteredConsultations.map((consultation, index) => (
                            <tr key={index} className={consultation.is_read ? 'bg-light' : ''}>
                                <td>
                                    <input type="checkbox" checked={selectedConsultations.includes(consultation.id)} onChange={() => handleCheckboxChange(consultation.id)} />
                                </td>
                                <td>{consultation.arrival_date}</td>
                                <td>{consultation.name} {consultation.lastname}</td>
                                <td>{consultation.consultation.substring(0, 50)}...</td>
                                {activeTab === "deleted" && (
                                    <td>
                                        <button onClick={() => handlePhysicalDeletion(consultation.id)}>
                                            <FontAwesomeIcon icon={faTrash}/>
                                        </button>
                                    </td>
                                )}
                                {activeTab === "inbox" && (
                                    <td> <FontAwesomeIcon icon={faTrash} /><FontAwesomeIcon icon={faEnvelope} /></td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={`modal fade ${showConfirmationModal ? 'show d-block' : 'd-none'}`} id="confirmationModal" tabIndex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="confirmationModalLabel">Confirmación</h5>
                            <button type="button" className="btn-close" onClick={closeConfirmationModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            ¿Estás seguro de que deseas eliminar este mensaje de forma permanente?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeConfirmationModal}>Cancelar</button>
                            <button type="button" className="btn btn-danger" onClick={confirmPhysicalDeletion}>Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal fade ${modalSuccess ? 'show d-block' : 'd-none'}`} id="successModal" tabIndex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="btn-close" onClick={closeModalSuccess} aria-label="Close"></button>
                        </div>
                        <div className="modal-body d-flex justify-content-center">
                            <span>Eliminación exitosa.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

