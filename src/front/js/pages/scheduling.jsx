import React, { useState, useEffect } from 'react';
import "../../styles/home.css";

export const Scheduling = () => {
  const [calendar, setCalendar] = useState([]);
  const [month, setMonth] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
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
          // Llenar celdas con números del 1 al 31
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
  }, [month]); // La dependencia incluye 'month'

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderModalContent = () => {
    // Lógica para generar las horas (de 8 a 20) en el modal
    const hours = Array.from({ length: 13 }, (_, index) => index + 8);

    return (
      <div className="modal-content">
        <h2>Horas disponibles para el día {selectedDay}</h2>
        <ul>
          {hours.map((hour) => (
            <li key={hour}>{hour}:00 - {hour + 1}:00</li>
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
