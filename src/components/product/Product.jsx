import React, { useState, useContext } from 'react'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { Context } from "../js/store/appContext.js"

const Product = () => {
    const { store, actions } = useContext(Context)
    const [preferenceIdLocal, setPreferenceIdLocal] = useState(null)

    initMercadoPago('TEST-bceca7d7-bc1c-4085-bcfd-9b7555de2e39');

    const handleBuy = async () => {
        const id = await actions.createPreference()
        if (id) {
            setPreferenceIdLocal(store.preferenceId)
        }
    }

    return (
        <div>
            <div>
                <div>
                    <img src='' alt='product stuff' />
                    <h3>Sesión</h3>
                    <p>$100</p>
                    <button onClick={handleBuy} >Abonar</button>
                    {
                        preferenceIdLocal && <Wallet initialization={{ preferenceId: store.preferenceId.id }} />
                    }
                </div>
            </div>
        </div>
    )
}

export default Product;