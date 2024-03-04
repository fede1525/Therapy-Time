import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const { actions } = useContext(Context)
	const [userData, setUserData] = useState(null)
	const [name, setName] = useState('')

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await actions.getUserData();

				if (!response.ok) {
					console.error("Error fetching user data:", response.statusText);
					throw new Error("Error fetching user data");
				}

				const data = await response.json();
				setUserData(data);
			} catch (error) {
				console.error("Error:", error);
				setUserData(null);
			}
		};

		fetchUserData();
	}, [actions]);


	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<div id="home-link">
					<Link to="/home">
						<span className="navbar-brand mb-0 h1">HOME</span>
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
							{name ? name : 'Usuario'}
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
