import React, { useContext, useState } from "react"
import { Product } from "../component/product/Product.jsx"
import { Context } from "../store/appContext.js"

export const Payment = () => {
    const { actions, store } = useContext(Context)

    return (
        <div>
            <Product />
        </div>
    )
}