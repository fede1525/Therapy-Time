import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { NavbarTherapist } from "../component/navbar";
import { Context } from "../store/appContext";
import { SchedulingTherapistEdit } from "../component/editRservation"

export const AppointmentScheduler = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { store, actions } = useContext(Context);
    const [reservations, setReservations] = useState([]);
    const [activeTab, setActiveTab] = useState("inbox");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalSuccess, setModalSuccess] = useState(false);
    const [reservationIdToDelete, setReservationIdToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);


    const handleDeleteConfirmation = (reservationId) => {
        setReservationIdToDelete(reservationId);
        setShowSuccessModal(true);
    };

    const handleConfirmDelete = async () => {
        const result = await actions.deleteReservation(reservationIdToDelete);
        if (result.error) {
            console.error("Error al intentar cancelar la reserva: ", result.error);
        } else {
            console.log("Reserva cancelada exitosamente");
            setShowSuccessModal(false);
            setModalSuccess(true);
            actions.getAllReservations(); // Actualizar la tabla después de eliminar la reserva
        }
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
    };

    const closeModalSuccess = () => {
        setModalSuccess(false);
        actions.getAllReservations();
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        actions.getAllReservations();
    }, []);

    useEffect(() => {
        const filterReservations = () => {
            const filteredReservations = store.reservations.filter(reservation => {
                const reservationDate = new Date(reservation.fecha);
                return reservationDate.toDateString() === currentDate.toDateString();
            });
            setReservations(filteredReservations);
        };
        filterReservations();
    }, [currentDate, store.reservations]);

    const handlePrevDay = () => {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        setCurrentDate(prevDate);
    };

    const handleNextDay = () => {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        setCurrentDate(nextDate);
    };

    const formatDate = date => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let formattedDate = date.toLocaleDateString('es-ES', options);
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        return formattedDate;
    };

    const generateTimeSlots = () => {
        const timeSlots = [];
        for (let hour = 8; hour < 20; hour++) {
            const timeSlot = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
            timeSlots.push(timeSlot);
        }
        return timeSlots;
    };

    const handleEdit = (idReservation) => {
        const dataReservation = reservations.find(reservation => reservation.id === idReservation);
        setSelectedReservation(dataReservation);
        setShowEditModal(true);
    };

    return (
        <div style={{ backgroundColor: 'white', minHeight: '100vh', paddingBottom: '7vh' }}>
            <NavbarTherapist />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap" />
            <div className="container mt-5 border" style={{ paddingTop: '2vh', fontFamily: 'Nanum Gothic, sans-serif' }}>
                <ul className="nav nav-tabs" >
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === "inbox" ? "active" : "text-muted"}`} onClick={() => handleTabChange("inbox")}>Turnos asignados</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === "deleted" ? "active" : "text-muted"}`} onClick={() => handleTabChange("deleted")}>Nuevo turno</button>
                    </li>
                </ul>
                <div className="container">
                    {activeTab === "inbox" && (
                        <div>
                            <div className="table-responsive mt-3">
                                <table className="table">
                                    <thead className="border" style={{ backgroundColor: '#bdb5b5', color: 'white' }}>
                                        <tr>
                                            <th colSpan="6" className="text-center border" style={{ backgroundColor: '#FAFAFA', color: 'grey' }}>
                                                <div className="d-flex justify-content-between align-items-center" style={{ maxWidth: '40%', margin: 'auto' }}>
                                                    <button className="btn" onClick={handlePrevDay} style={{ color: 'grey' }}>
                                                        <FontAwesomeIcon icon={faChevronLeft} />
                                                    </button>
                                                    <p style={{ lineHeight: 'normal', margin: 0 }}>{formatDate(currentDate)}</p>
                                                    <button className="btn" onClick={handleNextDay} style={{ color: 'grey' }}>
                                                        <FontAwesomeIcon icon={faChevronRight} />
                                                    </button>
                                                </div>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th scope="col" style={{ fontWeight: 'normal' }}>Horario</th>
                                            <th scope="col" style={{ fontWeight: 'normal' }}>Paciente</th>
                                            <th scope="col" style={{ fontWeight: 'normal' }}>Contacto</th>
                                            <th scope="col" style={{ fontWeight: 'normal' }}>Sala virtual</th>
                                            <th scope="col" style={{ fontWeight: 'normal' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {generateTimeSlots().map((timeSlot, index) => (
                                            <tr key={index}>
                                                <td>{timeSlot}</td>
                                                {reservations.some(reservation => new Date(reservation.fecha).getHours().toString() === timeSlot.substring(0, 2)) ?
                                                    reservations.map((reservation, index) => (
                                                        (new Date(reservation.fecha).getHours().toString() === timeSlot.substring(0, 2)) ?
                                                            <React.Fragment key={index}>
                                                                <td>{reservation.nombre_paciente}</td>
                                                                <td>{reservation.telefono}</td>
                                                                <td>
                                                                    {reservation.link_sala_virtual ? (
                                                                        <a href={reservation.link_sala_virtual} target="_blank" rel="noopener noreferrer">Ingresar</a>
                                                                    ) : null}
                                                                </td>
                                                                <td>
                                                                    <FontAwesomeIcon icon={faPencilAlt} style={{ color: 'grey' }} onClick={() => handleEdit(reservation.id)} className="btn mr-2" />
                                                                    <FontAwesomeIcon icon={faTrashAlt} style={{ color: 'grey' }} className="btn" onClick={() => handleDeleteConfirmation(reservation.id)} />
                                                                </td>
                                                            </React.Fragment>
                                                            : null
                                                    ))
                                                    :
                                                    <React.Fragment key={index}>
                                                        <td>-</td>
                                                        <td>-</td>
                                                        <td>-</td>
                                                        <td>-</td>
                                                    </React.Fragment>
                                                }
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className={`modal fade ${showSuccessModal ? 'show d-block' : 'd-none'}`} id="showSuccessModal" tabIndex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content" style={{ textAlign: 'left' }} id="contactModal">
                                        <div className="modal-header justify-content-end">
                                            <button type="button" className="btn_close_contact" onClick={handleCloseModal} aria-label="Close">X</button>
                                        </div>
                                        <div className="modal-body">
                                            <span>¿Seguro desea cancelar su próximo turno?</span>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                                            <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`modal fade ${modalSuccess ? 'show d-block' : 'd-none'}`} id="successModal" tabIndex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content" style={{ textAlign: 'left' }} id='contactModal'>
                                        <div className="modal-header d-flex justify-content-between">
                                            <span>Eliminación exitosa.</span>
                                            <button type="button" className="btn_close_contact" onClick={closeModalSuccess} aria-label="Close">X</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`modal fade ${showEditModal ? 'show d-block' : 'd-none'}`} id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered modal-xl">
                                    <div className="modal-content" style={{ textAlign: 'left' }}>
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="editModalLabel">Editar Reserva</h5>
                                            <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body" style={{ paddingRight: '2vh' }}>
                                            <SchedulingTherapistEdit idReservation={selectedReservation ? selectedReservation.id : null} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="container">
                    {activeTab === "Papelera" && (
                        <div></div>
                    )}
                </div>
            </div>
        </div>
    );
};

            
