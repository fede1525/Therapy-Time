import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export const Inbox = () => {
    const { store, actions } = useContext(Context);
    const [nameFilter, setNameFilter] = useState("");
    const [selectedConsultations, setSelectedConsultations] = useState([]);
    const [modalSuccess, setModalSuccess] = useState(false);
    const [showConfirmationModalInbox, setShowConfirmationModalInbox] = useState(false);
    const [showConfirmationModalDeleted, setShowConfirmationModalDeleted] = useState(false);
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

    const closeConfirmationModal = () => { 
        setShowConfirmationModalInbox(false);
    }

    const openConfirmationModalDeleted = () =>{
        setShowConfirmationModalDeleted(true)
    }

    const closeConfirmationModalDeleted = () =>{
        setShowConfirmationModalDeleted(false)
    }
    
    const handleMarkAsUnread = async () => {
        try {
            await Promise.all(selectedConsultations.map(id => actions.changeStatusConsultation(id)));
            await actions.getConsultations();
            setSelectedConsultations([...store.consultations.filter(consultation => !consultation.is_deleted).sort((a, b) => new Date(b.arrival_date) - new Date(a.arrival_date))]);
            setSelectedConsultations([]);
        } catch (error) {
            console.error("Error al marcar las consultas como no leídas:", error.message);
        }
    };
    
    const handleDeleteSelectedConsultations = async () => {
        try {
            setShowConfirmationModalInbox(true);
        } catch (error) {
            console.error("Error al eliminar las consultas seleccionadas:", error.message);
        }
    };
    
    const confirmDeletion = async () => {
        try {
            setShowConfirmationModalInbox(false);
            await Promise.all(selectedConsultations.map(id => actions.logicalDeletionMessage(id)));
            setSelectedConsultations([]);
            openModalSuccess();
            await actions.getConsultations();
    
        } catch (error) {
            console.error("Error al eliminar las consultas seleccionadas:", error.message);
        }
    };
    
    const confirmPhysicalDeletion = async (ids) => {
        try {
            await Promise.all(ids.map(id => actions.physicalDeletionMessage(id)));
            await actions.getConsultations();
            closeConfirmationModalDeleted(); 
            openModalSuccess(); 
            setSelectedConsultations([]); // Limpiar las consultas seleccionadas
        } catch (error) {
            console.error("Error al eliminar permanentemente las consultas seleccionadas:", error.message);
        }
    }

    const handlePhysicalDeletion = async (id) => {
        try {
            setSelectedConsultations([id]); // Marcar el registro actual como seleccionado
            openConfirmationModalDeleted();
        } catch (error) {
            console.error("Error al eliminar el mensaje:", error.message);
        }
    };

    const handlePermanentDeletion = async () => {
        openConfirmationModalDeleted();
    };

    const handleMarkAsUnreadSingle = async (consultationId) => {
        try {
            await actions.changeStatusConsultation(consultationId);
            await actions.getConsultations();
        } catch (error) {
            console.error("Error al marcar la consulta como no leída:", error.message);
        }
    };
    
    const filteredConsultations = store.consultations
    .filter(consultation => {
        if (activeTab === "inbox") {
            return !consultation.is_deleted;
        } else if (activeTab === "deleted") {
            return consultation.is_deleted;
        }
    })
    .filter(consultation =>
        consultation.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
        consultation.lastname.toLowerCase().includes(nameFilter.toLowerCase())
    )
    .sort((a, b) => new Date(b.arrival_date) - new Date(a.arrival_date));

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
                            <button onClick={handleMarkAsUnread} ><FontAwesomeIcon icon={faEnvelope}title="Marcar como no leido"/></button>
                            <button onClick={handleDeleteSelectedConsultations} ><FontAwesomeIcon icon={faTrash} title="Eliminar" /></button>
                        </>
                    )}
                    {activeTab === "deleted" && (
                        <a href="#" onClick={handlePermanentDeletion}>Eliminar permanentemente</a>
                    )}
                </div>
                <table className="table table-hover">
                    <tbody>
                        {filteredConsultations.map((consultation, index) => (
                            <tr key={index} className={consultation.is_read ? 'bg-light' : 'bg-white'}>
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
                                    <td>
                                        <button><FontAwesomeIcon icon={faTrash} onClick={handleDeleteSelectedConsultations} /></button>
                                        <button><FontAwesomeIcon icon={faEnvelope} onClick={() => handleMarkAsUnreadSingle(consultation.id)} /></button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={`modal fade ${showConfirmationModalInbox ? 'show d-block' : 'd-none'}`} id="confirmationModalInbox" tabIndex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
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
                            <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmationModalInbox(false)}>Cancelar</button>
                            <button type="button" className="btn btn-danger" onClick={confirmDeletion}>Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal fade ${showConfirmationModalDeleted ? 'show d-block' : 'd-none'}`} id="confirmationModalDeleted" tabIndex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
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
                            <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmationModalDeleted(false)}>Cancelar</button>
                            <button type="button" className="btn btn-danger" onClick={() => confirmPhysicalDeletion(selectedConsultations)}>Eliminar</button>
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

