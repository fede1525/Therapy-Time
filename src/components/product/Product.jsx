import React, { useState, useContext } from 'react'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { Context } from "../../front/js/store/appContext.js"
import "./Product.module.css"

export const Product = () => {
    const { store, actions } = useContext(Context)
    const [preferenceIdLocal, setPreferenceIdLocal] = useState(null)
    const price = process.env.SERVICE_PRICE
    const description = process.env.SERVICE_DESCRIPTION

    initMercadoPago(process.env.MERCADOPAGO_PUBLICKEY, {
        locale: 'es-AR',
    });

    const handleBuy = async () => {
        const id = await actions.createPreference()
        if (id) {
            setPreferenceIdLocal(store.preferenceId)
        }
    }

    return (
        <div className="card-product-container">
            <div className='card-product'>
                <div className="card">
                    <img src='src/front/img/logoHome.png' alt='product stuff' />
                    <h3>Consulta</h3>
                    <p>{description}</p>
                    <p>${price}</p>
                    <button onClick={handleBuy}>Abonar</button>
                    <div className="wallet-container">
                        {
                            preferenceIdLocal && <Wallet initialization={{ preferenceId: store.preferenceId.id }} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
