import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { NavbarTherapist } from "../component/navbar"
import "../../styles/profile.css";


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
            <NavbarTherapist/>
            <div style={{backgroundColor:'white', height: '85vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div className="container p-3" style={{borderTopRightRadius: '5vh', borderLeft: '#EDE9E9 solid 0.5vh', borderBottom:'#EDE9E9 solid 0.5vh', margin:'50vh'}} >
                    <div className="p-5 " style={{backgroundColor:'#F8F5F5'}}>       
                            <div className="row">
                                <div className="col">
                                    <div className="mb-5 profileData">
                                        <h4 className="titleProfile">Nombre de usuario</h4>
                                        <p className="textProfile">{userData.username}</p>
                                    </div>
                                    <div className="mb-5 profileData"> 
                                        <h4 className="titleProfile">Nombre</h4>
                                        <p className="textProfile">{userData.name}</p>
                                    </div>
                                    <div className="profileData">
                                        <h4 className="titleProfile">Apellido</h4>
                                        <p className="textProfile">{userData.lastname}</p>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-5 profileData">
                                        <h4 className="titleProfile">Dni</h4>
                                        <p className="textProfile">{userData.dni}</p>
                                    </div>
                                    <div className="mb-5 profileData">  
                                        <h4 className="titleProfile">Email</h4>
                                        <p className="textProfile">{userData.email}</p>
                                    </div>
                                    <div>
                                        <button className="btn_editar" style={{width: '40vh'}} onClick={navigateProfile}>Editar perfil</button>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
}