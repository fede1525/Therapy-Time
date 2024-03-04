
import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Block = () => {
  const { actions } = useContext(Context);
  const [calendar, setCalendar] = useState([]);
  const [month, setMonth] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([])

  useEffect(() => {
    
    const fetchUnavailableDates = async () => {
      try {
        const response = await actions.apiFetch('/bloquear');
        setUnavailableDates(response);
      } catch (error) {
        console.error('Error al obtener fechas no disponibles:', error);
      }
    };

    fetchUnavailableDates();
  
    const currentYear = new Date().getFullYear();
    const currentDate = new Date(currentYear, month, 1);
    const firstDayOfWeek = currentDate.getDay();
    let day = 1;
  
    const newCalendar = [];
  
    for (let i = 0; i < 6; i++) {
      const row = [];
  
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfWeek) {
          // Celdas vacías antes del primer día del mes
          row.push('');
        } else if (day <= 31) {
          row.push(day);
          day++;
        } else {
          // Celdas vacías después del último día del mes
          row.push('');
        }
      }
  
      newCalendar.push(row);
    }
    setCalendar(newCalendar);
    
  }, [month, actions ]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setShowModal(true);
    console.log("se seleccionó el día: ", selectedDay)
    console.log(calendar)
    
  };

  const handleHourClick = (hour) => {
    setSelectedHour(hour);
    setShowModal(true)
    console.log("hora seleccionada", hour, ":00", "del día", selectedDay)
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHour(null); // Quitar hora del modal
  };

  const handleBlockTime = () => {
    
    const data = {
      date: selectedDay,
      time_id: selectedHour,
    };
    console.log(data)
    actions.apiFetch('/bloquear', 'POST', data)
      .then(data => {
        console.log('Hora bloqueada exitosamente:', data);
        const updatedCalendar = calendar.map(row => row.filter(cell => cell !== selectedDay));
        setCalendar(updatedCalendar);
        handleCloseModal();
      })
      .catch(error => {
        console.error('Error al bloquear la hora:', error);

      });
  };

  const renderModalContent = () => {
    const hours = Array.from({ length: 13 }, (_, index) => index + 8);
    
    console.log("renderizó el modal")

    return (
      <div className="modal-content">
        <h2>Horas disponibles para el día {selectedDay}</h2>
        <ul>
          {hours.map((hour) => (
            <li key={hour} onClick={() => handleHourClick(hour)}>
              {hour}:00 - {hour + 1}:00
              <button onClick={handleBlockTime}>Bloquear Hora</button>
              
            </li>
          ))}
        </ul>

        <button onClick={handleCloseModal}>Cerrar</button>
      </div>
    );
  };
  return (
    <div>
      <h2>Calendario 2024</h2>
      <button onClick={() => setMonth(month + 1)}>Mes Siguiente</button>
      <button onClick={() => setMonth(month - 1)}>Mes Anterior</button>
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
                <td key={cellIndex} onClick={() => handleDayClick(cell)}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          {renderModalContent()}
        </div>
      )}
    </div>
  );
};
