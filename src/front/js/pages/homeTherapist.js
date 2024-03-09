import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import { Navbar } from "../component/navbar"

export const HomeTherapist = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="text-center homepsico">
            <Navbar />
            <div className="body-layout">
                <p>
                    <Link to="/patients">Gestion de pacientes</Link>
                </p>

                <p>
                    <Link to="/scheduling">Manejo de agenda</Link>
                </p>

                <p>
                    <Link to="/appointment_scheduling">Asignacion de turnos</Link>
                </p>


                <p>
                    <Link to="/income_control">Control de ingresos</Link>
                </p>

                <p>
                    <Link to="/inbox">Bandeja de entrada</Link>
                </p>
            </div>
        </div>
    );
};
