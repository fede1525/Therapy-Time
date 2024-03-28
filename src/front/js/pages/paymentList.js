import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { NavbarPatient } from "../component/navbar_patient"
import { PaymentTable } from "../component/paymentTable"

export const PaymentList = () => {
    return (
        <div className="container">
            <NavbarPatient />
            <PaymentTable />
        </div>
    )
}