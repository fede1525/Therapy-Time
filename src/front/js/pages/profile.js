import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar"

export const Profile = () => {
    const { actions } = useContext(Context)
    const [userData, setUserData] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate()

    // Traer datos de usuario al cargar la pagina
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await actions.getUserData();

                if (resp.error) {
                    setError("No se pudo cargar datos de usuario");
                }

                setUserData(resp);

            } catch (error) {
                setError("No se pudo cargar datos de usuario");
            }
        };
        fetchData();
    }, [actions]);


    const navigateProfile = () => {
        navigate("/editProfile")
    }

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="row">
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <div className="col">
                        <h4>Nombre de usuario</h4>
                        <p>{userData.username}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h4>Nombre</h4>
                        <p>{userData.name}</p>
                    </div>
                    <div className="col">
                        <h4>Apellido</h4>
                        <p>{userData.lastname}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h4>Dni</h4>
                        <p>{userData.dni}</p>
                    </div>
                    <div className="col">
                        <h4>Email</h4>
                        <p>{userData.email}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col d-flex justify-content-center p-4">
                        <button className="btn btn-primary" onClick={navigateProfile}>Editar perfil</button>
                    </div>
                </div>
            </div>
        </div>
    );
}