import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import box_N1 from "../../img/box_N1.png";
import box_N2 from "../../img/box_N2.png";
import box_N3 from "../../img/box_N3.png";
import box_N4 from "../../img/box_N4.png";

export const HomeTherapist = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="text-center homepsico conteiner-fluid">
            <div className="grid-container" style={{background:'#EDE9E9'}}>
                <div className="grid-item" style={{ backgroundImage: `url(${box_N1})`, backgroundSize: 'cover' } }>
                    <Link to="/patients" className="textLink">Gestion de pacientes</Link>
                </div>
                <div className="grid-item" style={{ backgroundImage: `url(${box_N2})`, backgroundSize: 'cover' } }>
                    <Link to="/scheduling" className="textLink">Manejo de agenda</Link>
                </div>
                <div className="grid-item" style={{ backgroundImage: `url(${box_N3})`, backgroundSize: 'cover' } } >
                    <Link to="/appointment_scheduling" className="textLink">Asignacion de turnos</Link>
                </div>
                <div className="grid-item" style={{ backgroundImage: `url(${box_N4})`, backgroundSize: 'cover' } } >
                    <Link to="/income_control" className="textLink">Control de ingresos</Link>
                </div>
                <div className="grid-item" style={{ backgroundImage: `url(${box_N2})`, backgroundSize: 'cover' } }>
                    <Link to="/inbox" className="textLink">Bandeja de entrada</Link>
                </div>
                <div className="logo-container">
                </div>
            </div>
        </div>
    );
};
