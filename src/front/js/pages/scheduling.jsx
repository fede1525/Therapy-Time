import React, { useState, useEffect } from 'react';
import "../../styles/home.css";

export const Scheduling = () => {
    const [calendar, setCalendar] = useState([]);
    const [month, setMonth] = useState(0);
  
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
    }, [month]); // Ahora, la dependencia incluye 'month'
  
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
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};