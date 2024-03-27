
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const SearchComponent = () => {
    const [users, setUsers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const { actions, store } = useContext(Context);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await actions.getUsers();
                setUsers(data);
            } catch (error) {
                console.error("Error al obtener usuarios:", error.message);
            }
        };
        fetchUsers();
    }, []);

    const handleSearchChange = (event, newValue) => {
        setSearchValue(newValue);
    };

    return (
        <div>
            <div className="form-group">
                <label htmlFor="nameFilter">Nombre del paciente:</label>
                <Autocomplete
                    options={users.map(user => `${user.firstName} ${user.lastName}`)}
                    value={searchValue}
                    onChange={handleSearchChange}
                    renderInput={(params) => <input {...params} type="text" className="form-control" id="nameFilter" />}
                />
            </div>
            <div className="form-group">
                <label htmlFor="dniFilter">DNI del paciente:</label>
                <Autocomplete
                    options={users.map(user => user.dni)}
                    value={searchValue}
                    onChange={handleSearchChange}
                    renderInput={(params) => <input {...params} type="text" className="form-control" id="dniFilter" />}
                />
            </div>
        </div>
    );
};



