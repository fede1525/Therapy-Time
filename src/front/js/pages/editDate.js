import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/home.css";
import { NavbarPatient, NavbarPatients } from "../component/navbar_patient";
import moment from 'moment';
import 'moment/locale/es';
import { SchedulingPatientEdit } from "../component/editDate"

export const EditDate = () => {
    const { actions } = useContext(Context);
    
    return (
        <div style={{ backgroundColor: '#EDE9E9', minHeight: '100vh', minWidth: '100vw' }}>
            <div className="container border p-4 mt-5" style={{backgroundColor:'white'}}>
              <SchedulingPatientEdit />
            </div>
        </div>
    );
};