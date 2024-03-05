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
					"dni" :"",
					"email": "",
					"phone": "",
					"password": "",
					"virtual_link": "",
					"is_active": "",
					"isAuthenticated": false,
					"reset_token": ""
				},
			],
			consultations:[
				{
					"id": "",
					"name": "",
					"lastname": "",
					"age": "",
					"phone": "",
					"consultation": "",
					"is_read": false,
					"is_deleted": false,
					"arrival_date ":""
				}
			]
		},
		actions: {
			apiFetch: async (endpoint, method = 'GET', body = null) => {
				try {
					let params = {
						method,
						headers: {
						}
					};
			
					if (body !== null) {
						params.body = JSON.stringify(body);
						params.headers["Content-Type"] = "application/json";
					}
			
					let resp = await fetch(process.env.BACKEND_URL + "api" + endpoint, params);
			
					if (!resp.ok) {
						console.error(resp.statusText);
						return { error: resp.statusText }; 
					}
					
					return resp;
				} catch (error) {
					return error;
				}
			},			
			protectedFetch: async (endpoint, method = "GET", body = null) => {
				const token = localStorage.getItem("token")
				if (!token) {
					throw new Error("Token not found.");
				}
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
			createUser: async (body) => {
				try {
					if (!body.username || !body.name || !body.lastname || !body.dni || !body.phone || !body.email) {
						throw new Error("Por favor, complete todos los campos requeridos.");
					}
					const resp = await getActions().protectedFetch("/signup", "POST", body);
			
					if (resp.ok) {
						const data = await resp.json();
						const newUser = {
							id: data.role_id,
							username: data.username,
							name: data.name,
							lastname: data.lastname,
							dni: data.dni,
							phone: data.phone,
							email: data.email,
							virtual_link: data.virtual_link
						};
						const updatedUserList = [...getStore().user, newUser];
						setStore({ user: updatedUserList });
						return data;
					} else {
						const errorMessage = await resp.text(); 
						throw new Error(errorMessage || "Error al crear el usuario.");
					}
				} catch (error) {
					console.error("Error creating user:", error);
					throw error;
				}
			},	
			getUsers: async () => {
				try {
					const resp = await getActions().protectedFetch("/users", "GET");
			
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
					const resp = await getActions().protectedFetch(`/get_user/${id}`);
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
					const resp = await getActions().protectedFetch(`/edit_user/${id}`, 'PUT', userData);
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
			loginUser: async (username, password) => {
				try {
					const response = await getActions().apiFetch('/login', 'POST', {
						username: username,
						password: password
					});
					
					if (!response.ok) {
						throw new Error('Failed to log in');
					}
					
					const responseData = await response.json();
					const token = responseData.token || "";
					const userRole = responseData.role || "";
					
					localStorage.setItem('token', token);
					console.log("Token almacenado en localStorage:", token);
					
					setStore({ isAuthenticated: true, role: userRole });
					
					return { success: true, message: responseData.message };
				} catch (error) {
					console.error("Error al realizar la solicitud:", error);
					setStore({ isAuthenticated: false, userRole: "" });
					return { success: false, error: 'Error de red' };
				}
			},			
			handleResetPassword: async (email) => {
				try {
					const response = await getActions().apiFetch('/reset_password', 'POST', { email });
					if (!response.ok) {
						throw new Error( 'El correo electronico no se encuentra registrado');
					}
					return response;
				} catch (error) {
					throw new Error(error.message || 'Error al enviar la solicitud');
				}
			},			
			handleChangePassword: async (username, token, newPassword) => {
				try {
					const response = await getActions().apiFetch('/change_password', 'POST', {
						username: username,
						token: token,
						new_password: newPassword
					});
					if (!response.ok) {
						const data = await response.json();
						throw new Error(data.error || 'Error al enviar la solicitud');
					}
					return response.json();
				} catch (error) {
					throw new Error(error.message || 'Error al enviar la solicitud');
				}
			},
			sendMessage: async (name, lastname, age, phone, consultation) => {
				try {
					const response = await getActions().apiFetch('/message', 'POST', {
						name: name,
						lastname: lastname,
						age: age,
						phone: phone,
						consultation: consultation
					});
			
					if (!response.ok) {
						throw new Error('Failed to send message');
					}
					const responseData = await response.json();
					return responseData;
				} catch (error) {
					console.error("Error al realizar la solicitud:", error);
					throw new Error('Error de red');
				}
			},
			getConsultations: async () => {
				try {
					const response = await getActions().protectedFetch('/consultations', 'GET');
					if (response.ok) {
						const data = await response.json();
						setStore({ consultations: data }); 
						return data;
					} else {
						throw new Error("Error al obtener las consultas.");
					}
				} catch (error) {
					console.error("Error al obtener las consultas:", error.message);
					throw error;
				}
			},			
			changeStatusConsultation: async (id) => {
				try {
					const response = await getActions().protectedFetch(`/consultations/${id}/mark_as_unread`, 'PUT');
					if (response.ok) {
						return response.json();
					} else {
						throw new Error('Error al marcar la consulta como no leída');
					}
				} catch (error) {
					console.error("Error al marcar la consulta como no leída:", error.message);
					throw error;
				}
			},
			logicalDeletionMessage: async (id) =>{
				try {
					const response = await getActions().protectedFetch(`/deleted_consultations/${id}`, 'PUT');
					if (response.ok) {
						return response.json();
					} else {
						throw new Error('Error al eliminar el mensaje');
					}
				} catch (error) {
					console.error("Error al eliminar el mensaje:", error.message);
					throw error;
				}
			},
			physicalDeletionMessage: async (id) =>{
				try {
					const response = await getActions().protectedFetch(`/deleted_consultations/${id}`, 'DELETE'); 
					if (response.ok) {
						return response.json();
					} else {
						throw new Error('Error al eliminar el mensaje de forma permanente'); 
					}
				} catch (error) {
					console.error("Error al eliminar el mensaje:", error.message);
					throw error;
				}
			}
		}
	};
};

export default getState;