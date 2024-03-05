import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Navbar } from "../component/navbar"


export const HomePatient = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="container">
			<Navbar />
		</div>
	);
};
