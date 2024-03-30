import React, { useState, useContext, useEffect } from 'react'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { Context } from "../../store/appContext.js"
import "./Product.module.css"
import big_logo from "../../../img/big_logo.png";

export const Product = () => {
    const { store, actions } = useContext(Context)
    const [preferenceIdLocal, setPreferenceIdLocal] = useState(null)
    const price = process.env.SERVICE_PRICE
    const description = process.env.SERVICE_DESCRIPTION

    initMercadoPago(process.env.MERCADOPAGO_PUBLICKEY, {
        locale: 'es-AR',
    });

    useEffect(() => {
        const fetchData = async () => {
            const id = await actions.createPreference()
            if (id) {
                setPreferenceIdLocal(store.preferenceId)
            }
        }
        fetchData();
    }, []);

    return (
        <div className="container d-grid align-items-center" style={{ marginTop: '150px' }}>
            <div className='card-product' >
                <div className="card d-flex align-items-center justify-content-center" style={{ backgroundColor: '#EDE9E9' }}>
                    <img className="w-50 pb-4" src={big_logo} alt='product stuff' />
                    <h3 style={{ fontSize: "'Nanum Gothic', sans-serif", color: '#8A97A6' }}>Consulta psicologica</h3>
                    <p style={{ fontSize: "'Nanum Gothic', sans-serif", color: '#8A97A6' }}> {description}</p>
                    <p style={{ fontSize: "'Nanum Gothic', sans-serif", color: '#8A97A6' }}>Total: ${price}</p>
                    <div className="wallet-container">
                        {
                            preferenceIdLocal && <Wallet initialization={{ preferenceId: preferenceIdLocal.id }} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
