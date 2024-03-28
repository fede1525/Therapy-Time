import React, { useContext, useState, useEffect } from "react"
import { Context } from "../store/appContext";

export const PaymentTable = () => {
    const { actions, store } = useContext(Context)
    const [payments, setPayments] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await actions.getPayments();
                setPayments(data.payments);
            } catch (error) {
                console.error("Error fetching payments:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <table className="table pt-4">
            <thead>
                <tr>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Detalle</th>
                    <th scope="col">Fecha</th>
                </tr>
            </thead>
            <tbody>
                {payments.map((payment, index) => (
                    <tr key={payment.id}>
                        <td>{payment.amount}</td>
                        <td>{payment.description}</td>
                        <td>{new Date(payment.date).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};