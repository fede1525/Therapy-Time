import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../store/appContext";
import "../../styles/calendar.css";

export const Scheduling = () => {
    const { actions, store } = useContext(Context);
    const [calendar, setCalendar] = useState([]);
    const [month, setMonth] = useState(1); // empieza en enero
    const [selectedDates, setSelectedDates] = useState(new Set());
    const [showHours, setShowHours] = useState(false);
    const [selectedHours, setSelectedHours] = useState([]);
    const [extractedInfo, setExtractedInfo] = useState([]);
    const [showSuccessModal, setShowSuccessModal]= useState(false);
    const meses = {
        1: 'Enero',
        2: 'Febrero',
        3: 'Marzo',
        4: 'Abril',
        5: 'Mayo',
        6: 'Junio',
        7: 'Julio',
        8: 'Agosto',
        9: 'Septiembre',
        10: 'Octubre',
        11: 'Noviembre',
        12: 'Diciembre'
    };

    const handleDayClickDay = (day) => {
        const updatedSelectedDates = new Set(selectedDates);

        if (updatedSelectedDates.has(day)) {
            updatedSelectedDates.delete(day);
        } else {
            updatedSelectedDates.add(day);
        }

        setSelectedDates(updatedSelectedDates);
    };

    const handleHourCheckboxChange = (hour) => {
        setSelectedHours((prevSelectedHours) => {
            if (prevSelectedHours.includes(hour)) {
                return prevSelectedHours.filter((selectedHour) => selectedHour !== hour);
            } else {
                return [...prevSelectedHours, hour];
            }
        });
    };

    const handleToggleHours = () => {
        setShowHours(!showHours);
    };

    const closeSuccessModal = () =>{
      setShowSuccessModal(false)
      setSelectedDates(new Set());
      setSelectedHours([]);
    }

    const handleSaveBlockedHours = async () => {
        try {
            const dates = Array.from(selectedDates).map(date => ({
                date: `2024-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`,
                times: selectedHours
            }));

            await actions.blockMultipleHours(dates);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error al bloquear horas:', error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await actions.getBlockedDates();
                const extractedInfo = response.map(item => {
                    const { month, year, day, hour } = extractDateInfo(item.date);
                    return { year, month, day, hour };
                });
                setExtractedInfo(extractedInfo);
            } catch (error) {
                console.error('Error al obtener fechas bloqueadas:', error);
            }
        }

        fetchData();

        const currentYear = new Date().getFullYear();
        const currentDate = new Date(currentYear, month - 1, 1); 
        const firstDayOfWeek = currentDate.getDay();
        let day = 1;

        const newCalendar = [];

        for (let i = 0; i < 6; i++) {
            const row = [];

            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDayOfWeek) {
                    row.push('');
                } else if (day <= 31) {
                    row.push(day);
                    day++;
                } else {
                    row.push('');
                }
            }

            newCalendar.push(row);
        }
        setCalendar(newCalendar);

    }, [month]);

    const extractDateInfo = (dateString) => {
        const dateObject = new Date(dateString);
        const month = dateObject.getMonth() + 1; 
        const year = dateObject.getFullYear();
        const day = dateObject.getDate();
        const hour = dateObject.getHours() + 5;
        return { month, year, day, hour };
    }

    return (
        <div>
            <h2>Calendario 2024</h2>
            <h2>{meses[month]}</h2>
            <div className="button-container">
                <button onClick={() => setMonth(month - 1)}>Mes Anterior</button>
                <button onClick={() => setMonth(month + 1)}>Mes Siguiente</button>
            </div>
            <table className="calendar">
                <thead>
                    <tr>
                        <th>Domingo</th>
                        <th>Lunes</th>
                        <th>Martes</th>
                        <th>Miércoles</th>
                        <th>Jueves</th>
                        <th>Viernes</th>
                        <th>Sábado</th>
                    </tr>
                </thead>
                <tbody>
                  {calendar.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                              <td
                                  key={cellIndex}
                                  className={`pestanita ${
                                      selectedDates.has(cell) && extractedInfo.every((item) => (
                                          item.year === 2024 &&
                                          item.month === month &&
                                          item.day === cell &&
                                          item.hour >= 8 && item.hour <= 20
                                      )) ? 'selected-day' : ''
                                  }`}
                                  onClick={() => handleDayClickDay(cell)}
                              >
                                  {cell}
                              </td>
                          ))}
                      </tr>
                  ))}
                </tbody>
            </table>
            <div className="button-container">
                <button onClick={handleToggleHours} disabled={selectedDates.size === 0}>
                    {showHours ? 'Ocultar Horas' : 'Mostrar Horas'}
                </button>
            </div>
            {showHours && selectedDates.size > 0 && (
                <div className="hours-container">
                    <h3>Horas disponibles para los días seleccionados</h3>
                    <ul>
                        {Array.from({ length: 13 }, (_, index) => index + 8).map((hour) => {
                            const matchingHour = Array.from(selectedDates).some((date) => (
                                extractedInfo.some((item) => (
                                    item.year === 2024 &&
                                    item.month === month &&
                                    item.day === date &&
                                    item.hour === hour
                                ))
                            ));

                            return (
                                <li
                                    key={hour}
                                    className={`pestanita ${matchingHour ? "bg-danger" : ""}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedHours.includes(hour)}
                                        onChange={() => handleHourCheckboxChange(hour)}
                                    />
                                    {hour}:00 - {hour + 1}:00
                                </li>
                            );
                        })}
                    </ul>
                    <button className='btn btn-primary' onClick={handleSaveBlockedHours}>Guardar</button>
                </div>
            )}
            <div className={`modal fade ${showSuccessModal ? 'show d-block' : 'd-none'}`} id="successModal" tabIndex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{textAlign:'left'}} id="contactModal">
                            <div className="modal-header justify-content-end">
                                <button type="button" className="btn_close_contact" onClick={closeSuccessModal} aria-label="Close">X</button>
                            </div>
                            <div className="modal-body">
                               <span>¡Bloqueo exitoso!</span>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-guardar-contact" onClick={closeSuccessModal}>Cerrar</button>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default Scheduling;
