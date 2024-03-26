import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Context } from "./store/appContext";
import injectContext from "./store/appContext";
import { Landing } from "./pages/landing";
import { Login } from "./pages/login"
import { Recovery } from "./pages/recovery";
import { HomePatient } from "./pages/homePatient";
import { HomeTherapist } from "./pages/homeTherapist";
import { Scheduling } from "./pages/scheduling.js";
import { AppointmentScheduler } from "./pages/appointmentScheduler";
import { IncomeControl } from "./pages/incomeControl";
import { Inbox } from "./pages/inbox";
import { Patients } from "./pages/patients";
import { Payments } from "./pages/payments";
import { PatientSchedule } from "./pages/patientSchedule";
import { Reset_password } from "./pages/resetPassword";
import { EditProfile } from "./pages/editProfile";
import { isAuthenticated } from "./authentication";
import { NewDate } from "./pages/newDate.js";
import { EditDate } from "./pages/editDate.js";


const Layout = () => {
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    const { store } = useContext(Context);
   
    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Routes>
                        <Route element={<Landing />} path="/" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Recovery />} path="/recovery" />
                        <Route element={<Reset_password />} path="/reset_password" />
                        {!isAuthenticated() ? <Route element={<Navigate to="/login" />} path="*" /> : <>
                            <Route element={store.user.role === 1 ? <HomePatient /> : <HomeTherapist />} path="/home" />
                            <Route element={<EditProfile />} path="/editProfile" />
                            <Route element={<Payments />} path="/payments" />
                            <Route element={<PatientSchedule />} path="/patient_schedule" />
                            <Route element={<Scheduling />} path="/scheduling" />
                            <Route element={<AppointmentScheduler />} path="/appointment_scheduling" />
                            <Route element={<IncomeControl />} path="/income_control" />
                            <Route element={<Inbox />} path="/inbox" />
                            <Route element={<Patients />} path="/patients" />
                            <Route element={<NewDate />} path="/new_date" />
                            <Route element={<EditDate />} path="/edit_date"  />
                        </>}
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
