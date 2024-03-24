import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { NavbarPatient, NavbarPatients } from "../component/navbar_patient";
import { Calendar, momentLocalizer } from 'react-big-calendar'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'; 
import 'moment/locale/es'; 

const localizer = momentLocalizer(moment);

export const HomePatient = () => {
    const { store, actions } = useContext(Context);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const CustomToolbar = ({ label, onNavigate }) => (
        <div className="toolbar-container d-flex justify-content-between align-items-center mb-3">
            <button className="prev-button" onClick={() => onNavigate('PREV')}>{'<'}</button>
			<div className="current-month">{label}</div>
            <button className="next-button" onClick={() => onNavigate('NEXT')}>{'>'}</button>
        </div>
    );

    return (
        <div className="text-center homepatient conteiner-fluid" style={{ backgroundColor: '#EDE9E9', height: '100%' }}>
            <NavbarPatient />
            <div className="d-flex justify-content-center align-items-center" style={{ height: '88vh' }}>
                <div className="mb-5 d-flex justify-content-center align-items-center" style={{ height: '65vh', width: '80vh', margin: '5vh', backgroundColor: 'white' }}>
                    <div style={{ height: 'calc(100% - 10vh)', width: 'calc(100% - 10vh)', position: 'relative' }}>
						<Calendar
							localizer={localizer} 
							startAccessor="start"
							endAccessor="end"
							components={{
								toolbar: CustomToolbar 
							}}
						/>
					</div>
                </div>
                <div className="mb-5" style={{ height: '65vh', width: '80vh', margin: '5vh', backgroundColor: 'white' }}>
                   
                </div>
            </div>
        </div>
    );
};
