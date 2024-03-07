import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons"

export const Footer = () => (
	<footer className="footer mt-auto py-3 text-center">
		<p>
			Source code: {" "}
			<a href="https://github.com/4GeeksAcademy/finalProject-LATAM-pt25">
				<FontAwesomeIcon icon={faGithub} size="2xl" />
			</a>
		</p>
	</footer>
);
