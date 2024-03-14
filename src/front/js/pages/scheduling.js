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

    const [rows, setRows] = useState([
        { id: 1, day: 'Domingo', available: true }
      ]);
    
      const handleToggleAvailability = (id) => {
        setRows(rows.map(row => {
          if (row.id === id) {
            return { ...row, available: !row.available };
          }
          return row;
        }));
      };
    
      const handleAddRow = () => {
        if (rows.length === 1 && !rows[0].available) {
          setRows([{ id: 1, day: 'Domingo', available: true }]);
        } else {
          const newRow = {
            id: rows.length + 1,
            available: true
          };
          setRows([...rows, newRow]);
        }
      };
    
      const handleRemoveRow = (id) => {
        if (rows.length === 1) {
          setRows([{ id: 1, day: 'Domingo', available: false }]);
        } else {
          setRows(rows.filter(row => row.id !== id));
        }
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
                <div className='container'>
      <h4>General Availability</h4>
      <div className='row d-flex'>
        <div className='col-9'>
          {rows.map(row => (
            <div className='row d-flex' key={row.id}>
              <div className='col-3'>
                <p>{row.day}</p>
              </div>
              <div className='col-6'>
                {row.available ? (
                  <>
                    <select>
                      <option value='available'>Available</option>
                      <option value='unavailable'>Unavailable</option>
                    </select>
                    <select>
                      <option value='available'>Available</option>
                      <option value='unavailable'>Unavailable</option>
                    </select>
                  </>
                ) : (
                  <p>No disponible</p>
                )}
              </div>
              <div className='col-3'>
                <button onClick={() => handleRemoveRow(row.id)} disabled={!row.available}>-</button>
              </div>
            </div>
          ))}
        </div>
        <div className='col-3'>
          <button onClick={handleAddRow}>+</button>
        </div>
      </div>
    </div>
            </div>
    );
};

export default Scheduling;
