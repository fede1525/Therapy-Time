import React, { useState, useEffect, useContext } from 'react';
import { Context } from "../store/appContext";
import "../../styles/calendar.css";

export const Scheduling = () => {
  const [rows, setRows] = useState([
    { id: 1, day: 'Lunes', row: [{ id: 1, available: true }] },
    { id: 2, day: 'Martes', row: [{ id: 1, available: true }] },
    { id: 3, day: 'Miércoles', row: [{ id: 1, available: true }] },
    { id: 4, day: 'Jueves', row: [{ id: 1, available: true }] },
    { id: 5, day: 'Viernes', row: [{ id: 1, available: true }] }
  ]);

  const handleAddRow = (dayId) => {
    setRows(prevRows => {
      const updatedRows = prevRows.map(day => {
        if (day.id === dayId) {
          if (day.row.length === 1 && !day.row[0].available) {
            return { ...day, row: [{ id: 1, available: true }] };
          } else {
            const newRow = {
              id: day.row.length + 1,
              available: true
            };
            return { ...day, row: [...day.row, newRow] };
          }
        }
        return day;
      });
      return updatedRows;
    });
  };

  const handleRemoveRow = (dayId, rowId) => {
    setRows(prevRows => prevRows.map(day => {
      if (day.id === dayId) {
        const filteredRows = day.row.filter(row => row.id !== rowId);
        if (filteredRows.length === 0) {
          return { ...day, row: [{ id: 1, available: false }] };
        }
        return { ...day, row: filteredRows };
      }
      return day;
    }));
  };

  const [hours] = useState([
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00'
  ]);

  const renderHourOptions = () => {
    return hours.map((hour, index) => (
      <option key={index} value={hour}>{hour}</option>
    ));
  };

  return (
    <div className='container'>
      <h4>General Availability</h4>
      <div className='row d-flex'>
        <div className='col-9'>
          {rows.map(day => (
            <div className='row d-flex align-items-center' key={day.id}>
              <div className='col-3'>
                <p>{day.day}</p>
              </div>
              <div className='col-6'>
                {day.row.map((row, index) => (
                  <div className="d-flex align-items-center" key={index}>
                    {row.available ? (
                      <>
                        <select>
                          {renderHourOptions()}
                        </select>
                        <select>
                          {renderHourOptions()}
                        </select>
                      </>
                    ) : (
                      <p>No disponible</p>
                    )}
                    <button onClick={() => handleRemoveRow(day.id, row.id)} disabled={!row.available}>-</button>
                  </div>
                ))}
                <div className='d-flex justify-content-end'>
                  <button onClick={() => handleAddRow(day.id)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

