const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: [
				{
					"id": "",
					"role": "",
					"username": "",
					"name": "",
					"lastname": "",
					"birth_date": "",
					"email": "",
					"phone": "",
					"password": "",
					"virtual_link": "",
					"is_active": "",

				},
			],

		},
		actions: {
			apiFetch: async (endpoint, method = 'GET', body = null) => {
				try {
					let params = {
						method,
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
						}
					}
					if (body != null) {
						params.body = JSON.stringify(body)
					}
					let resp = await fetch(process.env.BACKEND_URL + "api" + endpoint, params);
					if (!resp.ok) {
						console.error(resp.statusText)
						return { error: resp.statusText }
					}
					return await resp.json()
				} catch (error) {
					console.error("Error:", error)
				}
			},

			protectedFetch: async (endpoint, method = "GET", body = null) => {
				const token = localStorage.getItem("token")
				if (!token) return jsonify({ "error": "Token not found." })
				try {
					let params = {
						method,
						headers: {
							"Access-Control-Allow-Origin": "*",
							"Authorization": "Bearer " + token
						},
					}
					if (body != null) {
						params.headers = {
							"Content-Type": "application/json"
						}
						params.body = JSON.stringify(body)
					}
					let resp = await fetch(process.env.BACKEND_URL + "api" + endpoint, params)
					if (!resp.ok) {
						console.error(resp.statusText)
						return { error: resp.statusText }
					}
				} catch (error) {
					return error
				}
			},

			logout: async () => {
				await getActions().protectedFetch("/logout", "POST", null)
				localStorage.removeItem("token")
			},

			loginUser: async (username, password) => {
				try {
					const data = await getActions().apiFetch("/login_user", "POST", { username, password })
					localStorage.setItem("token", data.token)
					const updatedUserList = getStore().user.map(u => {
						if (u.username === data.username) {
							return { ...u, is_active: true }
						}
						return u
					});
					setStore({ user: updatedUserList })
					setStore({ is_active: true })
					return data
				} catch (error) {
					console.error("Error al iniciar sesión:", error.message)
					if (error & error.error) {
						throw new Error(error.error)
					} else {
						throw new Error("Credenciales incorrectas.")
					}
				}

			},

			createUser: async (username, email, password) => {
				try {
					const data = await getActions().apiFetch("/signup", "POST", { username, email, password })
					const newUser = {
						id: data.id,
						username: data.username,
						email: data.email,
						password: data.password,
						profile_picture: data.profile_picture,
						is_active: data.is_active
					};
					const updatedUserList = [...getStore().user, newUser]
					setStore({ user: updatedUserList })
					return data
				} catch (error) {
					console.log("Error creating user:", error);
				}
			},

			sendPasswordRecoveryRequest: async (emailInput, setRecoveryMessage, setError) => {
				try {
					const respData = await getActions().apiFetch("/recovery", "POST", { email: emailInput })
					if (respData.message) {
						setRecoveryMessage(respData.message)
					} else {
						throw new Error(respData.error || "Error al enviar la solicitud de recuperación de contraseña.");
					}
				} catch (error) {
					console.error("Error al enviar la solicitud de recuperación de contraseña:", error);
					setError(error.message);
				}
			}
		}
	};
};

export default getState;
