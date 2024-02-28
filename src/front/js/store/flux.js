const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			user: [
				{
					"id": "",
					"role":  "",
					"username": "",
					"name": "",
					"lastname": "",
					"dni": "",
					"email": "",
					"phone": "",
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
						params.headers["Content-Type"] = "application/json"
						params.body = JSON.stringify(body)
					}
					let resp = await fetch(process.env.BACKEND_URL + "api" + endpoint, params)
					if (!resp.ok) {
						console.error(resp.statusText)
						return { error: resp.statusText }
					}
					return resp
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
			createUser: async (body) => {
				try {
					const data = await getActions().apiFetch("/signup", "POST", { username, email, password })
					const newUser = {
						id: data.id,
						username: data.username,
						email: data.email,
						password: data.password,
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
			},
			createUser: async (body) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + `api/get_user/${id}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
							'Authorization': 'Bearer ' + localStorage.getItem("token")
						}
					});
					if (resp.ok) {
						const data = await resp.json();
						return data;
					} else {
						throw new Error("Error al obtener el usuario.");
					}
				} catch (error) {
					console.error("Error al obtener usuarios:", error.message);
					throw error;
				}
			},
			editUser: async (id, userData) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + `api/edit_user/${id}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
							'Authorization': 'Bearer ' + localStorage.getItem("token")
						},
						body: JSON.stringify(userData)
					});
					if (resp.ok) {
						const userIndex = getStore().user.findIndex(user => user.id === id);
						if (userIndex !== -1) {
							const updatedUsers = [...getStore().user];
							updatedUsers[userIndex] = {...userData, id};
							setStore({ user: updatedUsers });
							return {...userData, id};
						} else {
							throw new Error('Usuario no encontrado');
						}
					} else {
						throw new Error('Error al editar el usuario');
					}
				} catch (error) {
					console.error("Error al editar el usuario:", error.message);
					throw error; 
				}	
			},
			getUserData: async () => {
				try {
					const resp = await getActions().protectedFetch("/profile", "GET", null)
					if (!resp.ok) {
						console.error("Error al traer datos de usuario: ", resp)
						return { error: "Error al traer datos de usuario" }
					}
					return await resp.json()
				} catch (error) {
					console.error("Error: ", error)
					return { Error: "Error al traer datos de usuario" }
				}
			},
			editProfile: async (changes) => {
				try {
					const resp = await getActions().protectedFetch("/profile_edit", "PUT", changes)

					if (!resp.ok) {
						throw new Error("No se pudo actualizar el perfil")
					}

					return await resp.json()

				} catch (error) {
					console.error("Error al actualizar el perfil: ", error)
					throw error
				}
			},
			getUsers: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "api/users", {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': 'Bearer ' + localStorage.getItem("token")
                        }
                    });
                    if (resp.ok) {
                        const data = await resp.json();
                        setStore({ user: data }); 
                        return data;
                    } else {
                        throw new Error("Error al obtener usuarios.");
                    }
                } catch (error) {
                    console.error("Error al obtener usuarios:", error.message);
                    throw error;
                }
            },
			getUser: async (id) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + `api/get_user/${id}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
							'Authorization': 'Bearer ' + localStorage.getItem("token")
						}
					});
					if (resp.ok) {
						const data = await resp.json();
						return data;
					} else {
						throw new Error("Error al obtener el usuario.");
					}
				} catch (error) {
					console.error("Error al obtener usuarios:", error.message);
					throw error;
				}
			},
			editUser: async (id, userData) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + `api/edit_user/${id}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Access-Control-Allow-Origin': '*',
							'Authorization': 'Bearer ' + localStorage.getItem("token")
						},
						body: JSON.stringify(userData)
					});
					if (resp.ok) {
						const userIndex = getStore().user.findIndex(user => user.id === id);
						if (userIndex !== -1) {
							const updatedUsers = [...getStore().user];
							updatedUsers[userIndex] = {...userData, id};
							setStore({ user: updatedUsers });
							return {...userData, id};
						} else {
							throw new Error('Usuario no encontrado');
						}
					} else {
						throw new Error('Error al editar el usuario');
					}
				} catch (error) {
					console.error("Error al editar el usuario:", error.message);
					throw error; 
				}	
			},
			getUserData: async () => {
				try {
					const resp = await getActions().protectedFetch("/profile", "GET", null)
					if (!resp.ok) {
						console.error("Error al traer datos de usuario: ", resp)
						return { error: "Error al traer datos de usuario" }
					}
					return await resp.json()
				} catch (error) {
					console.error("Error: ", error)
					return { Error: "Error al traer datos de usuario" }
				}
			},
			editProfile: async (changes) => {
				try {
					const resp = await getActions().protectedFetch("/profile_edit", "PUT", changes)

					if (!resp.ok) {
						throw new Error("No se pudo actualizar el perfil")
					}

					return await resp.json()

				} catch (error) {
					console.error("Error al actualizar el perfil: ", error)
					throw error
				}
			}
		}
	};
};

export default getState;
