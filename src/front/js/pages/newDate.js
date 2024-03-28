import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { NavbarPatient, NavbarPatients } from "../component/navbar_patient";
import 'moment/locale/es';
import { SchedulingPatient } from "../component/schedulingPatient"

export const NewDate = () => {
    const { actions } = useContext(Context);

    return (
        <div style={{ backgroundColor: '#EDE9E9', minHeight: '100vh', minWidth: '100vw' }}>
            <NavbarPatient />
            <div className="container border p-4 mt-5" style={{backgroundColor:'white'}}>
              <SchedulingPatient />
            </div>
        </div>
    );
};
