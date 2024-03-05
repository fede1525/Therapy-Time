import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const { actions } = useContext(Context)
	const [userData, setUserData] = useState("")

	useEffect(() => {
		const fetchData = async () => {
			try {
				const resp = await actions.getUserData();

				if (resp.error) {
					console.error("No se pudo cargar datos de usuario");
				}

				setUserData(resp);

			} catch (error) {
				console.error("No se pudo cargar datos de usuario");
			}
		};
		fetchData();
	}, [actions]);

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<div id="home-link">
					<Link to="/home">
						<span className="navbar-brand mb-0 h1">Inicio</span>
					</Link>
				</div>
				<div id="center-nav">
					<Link to="/patient_schedule">
						<p id="turns-button">Turnero</p>
					</Link>
					<Link to="/payments">
						<p>Mis Pagos</p>
					</Link>
				</div>
				<div id="profile-button">
					<div className="dropdown">
						<button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
							{userData.name + " " + userData.lastname}
						</button>
						<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
							<li><Link className="dropdown-item" to="/profile">Mi perfil</Link></li>
							<li><Link className="dropdown-item" to="/login">Cerrar sesión</Link></li>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};
