import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Link} from "react-router-dom";


export const HomePatient = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5 homepsico">
			<p>
                <Link to="/patients">Gestion de pacientes</Link>
            </p>
		</div>
		
	);
};
