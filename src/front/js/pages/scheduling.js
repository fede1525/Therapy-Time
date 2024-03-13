import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../store/appContext";
import "../../styles/calendar.css";

export const Scheduling = () => {
  const { actions, store } = useContext(Context);
  const [calendar, setCalendar] = useState([]);
  const [month, setMonth] = useState(1); // empieza en enero
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [showHours, setShowHours] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedHours, setSelectedHours] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [extractedInfo, setExtractedInfo] = useState([]);
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
  
  const fetchUnavailableDates = async () => {
    try {
      const response = await actions.apiFetch('/bloquear', 'GET');
      setUnavailableDates(response);
    } catch (error) {
      console.error('Error al obtener fechas no disponibles:', error);
    }
  };

  useEffect(() => {
    fetchUnavailableDates();
    function extractDateInfo(dateString) {
      const dateObject = new Date(dateString);
      const month = dateObject.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
      const year = dateObject.getFullYear();
      const day = dateObject.getDate();
      const hour = dateObject.getHours() + 5;
      return { month, year, day, hour };
    }
    const extractedInfo = store.unavailableDates.map(item => {
      const { month, year, day, hour } = extractDateInfo(item.date);
      return { year, month, day, hour };
    });
    setExtractedInfo(extractedInfo);

    const currentYear = new Date().getFullYear();
    const currentDate = new Date(currentYear, month - 1, 1); //-1 para que empiece desde enero
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

  
  const handleHourCheckboxChange = (hour) => {
    setSelectedHour(hour)
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

  const handleBlockSelectedHours = async () => {
    try {
        // Verificar si hay fechas seleccionadas
        if (selectedDates.size === 0) {
            console.error('No se ha seleccionado ninguna fecha');
            return;
        }
  
        // Preparar la estructura de datos para enviar al servidor
        const data = Array.from(selectedDates).map(date => ({
            month: date.getMonth() + 1,
            day: date.getDate(),
            times: selectedHours
        }));
  
        // Llamar a la acción bloquearVariasHoras para enviar los datos al servidor
        await actions.bloquearVariasHoras(data);
  
        // Si no hay error, mostrar un mensaje de éxito
        console.log('Horas bloqueadas con éxito');
    } catch (error) {
        console.error('Error al bloquear horas:', error);
    }
  };

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
                    className={`pestanita ${selectedDates.has(cell) ? 'selected-day' : ''}`}
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
            <button className='btn btn-primary' onClick={handleBlockSelectedHours}>Guardar</button>
          </div>
        )}
      </div>
    );
    
};

export default Scheduling;

