import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../store/appContext";

export const Scheduling = () => {
  const { actions, store } = useContext(Context);
  const [selectedDay, setSelectedDay] = useState('');
  const [scheduleData, setScheduleData] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formDisabled, setFormDisabled] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const POSSIBLE_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const POSSIBLE_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  const openSuccessModal = () => {
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleDayChange = (day) => {
    setSelectedDay(day);
    setDayOfWeek(day);
    const dayData = store.globalEnabled.filter(item => item.day === day);
    setScheduleData(dayData);
    setStartTime('');
    setEndTime('');
    setErrorMessage('');
    setFormDisabled(false); 
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    setEndTime(''); 
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleAddSchedule = () => {
    if (!startTime || !endTime || startTime >= endTime) {
      setErrorMessage('Ingrese horas válidas.');
      return;
    }
    const newSlot = { start_hour: startTime, end_hour: endTime };
    const updatedData = [...scheduleData, newSlot];
    setScheduleData(updatedData);
    setStartTime('');
    setEndTime('');
    setErrorMessage('');
    setHasChanges(true); 
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await actions.deleteGlobalEnabled(id);
      const updatedData = scheduleData.filter(slot => slot.id !== id);
      setScheduleData(updatedData);
      setHasChanges(true);
    } catch (error) {
      console.error("Error al eliminar el registro de disponibilidad global:", error);
    }
  };

  const handleSave = async () => {
    if (!selectedDay || !dayOfWeek) {
      setErrorMessage('Seleccione un día y una hora.');
      return;
    }
    try {
      const newSlots = scheduleData.map(slot => ({
        day: selectedDay,
        start_hour: slot.start_hour,
        end_hour: slot.end_hour
      }));
      const response = await actions.addGlobalEnabled(newSlots);
      console.log('Disponibilidad agregada:', response); 
      setScheduleData([]);
      setStartTime('');
      setEndTime('');
      setErrorMessage('');
      openSuccessModal();
      actions.getGlobalEnabled();
      setFormDisabled(true);
      setSelectedDay('');
      setDayOfWeek('');
      setHasChanges(false); 
    } catch (error) {
      console.error("Error al guardar disponibilidad global:", error);
      setErrorMessage(error.message || 'Error de red');
    }
  };

  useEffect(() => {
    actions.getGlobalEnabled();
    setFormDisabled(true);
    setSelectedDay('');
    setDayOfWeek('');
    setScheduleData([]);
    setStartTime('');
    setEndTime('');
    setErrorMessage('');
  }, []);

  const filterAvailableStartHours = () => {
    let availableHours = POSSIBLE_HOURS.filter(hour => {
      return !scheduleData.some(slot => (slot.start_hour <= hour && hour < slot.end_hour));
    });
    availableHours = availableHours.filter(hour => hour !== '20:00');
    return availableHours;
  };

  const filterAvailableEndHours = () => {
    if (!startTime) return []; 

    let availableHours = [];
    let lastSelectedHourIndex = POSSIBLE_HOURS.indexOf(startTime);

    for (let i = lastSelectedHourIndex + 1; i < POSSIBLE_HOURS.length; i++) {
      let hour = POSSIBLE_HOURS[i];
      let isAvailable = true;

      for (let j = 0; j < scheduleData.length; j++) {
        if (hour >= scheduleData[j].start_hour && hour <= scheduleData[j].end_hour) {
          isAvailable = false;
          if (hour === scheduleData[j].start_hour) {
            availableHours.push(hour);
          }
          break;
        }
      }
      if (!isAvailable) {
        break; 
      }
      availableHours.push(hour);
    }
    return availableHours;
  };

  return (
    <div className="row">
      <div className="col">
        <h2>Disponibilidad Existente</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Día</th>
              {POSSIBLE_HOURS.map((hour, index) => (
                <th key={index}>{hour}</th>
              ))}
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {POSSIBLE_DAYS.map((day, index) => (
              <tr key={index}>
                <td>{day}</td>
                {POSSIBLE_HOURS.map((hour, hourIndex) => (
                  <td key={hourIndex} style={{ backgroundColor: store.globalEnabled.some(item => item.day === day && hour >= item.start_hour && hour < item.end_hour) ? 'green' : 'transparent' }}>
                  </td>
                ))}
                <td>
                  <button onClick={() => handleDayChange(day)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col">
        <div>
          <h2>Editar Disponibilidad</h2>
          <div className="mb-3">
            <label htmlFor="day-of-week">Día de la semana:</label>
            <input type="text" id="day-of-week" value={dayOfWeek} readOnly disabled={formDisabled} />
          </div>
          <div className="mb-3">
            <h3>Registros para {selectedDay}</h3>
            {scheduleData.map((slot, index) => (
              <div key={index}>
                <span>{slot.start_hour} - {slot.end_hour}</span>
                <button onClick={() => handleDeleteSchedule(slot.id)}>Eliminar</button>
              </div>
            ))}
          </div>
          <div className="mb-3">
            <label htmlFor="start-time">Hora de inicio:</label>
            <select id="start-time" value={startTime} onChange={handleStartTimeChange} disabled={formDisabled}>
              <option value="">--:--</option>
              {filterAvailableStartHours().map(hour => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
            <label htmlFor="end-time">Hora de fin:</label>
            <select id="end-time" value={endTime} onChange={handleEndTimeChange} disabled={formDisabled}>
              <option value="">--:--</option>
              {filterAvailableEndHours().map(hour => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
            <button onClick={handleAddSchedule} disabled={formDisabled}>+</button>
          </div>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          <button onClick={handleSave} disabled={formDisabled || !hasChanges}>Guardar</button>
        </div>
        <div className={`modal fade ${showSuccessModal ? 'show d-block' : 'd-none'}`} id="successModal" tabIndex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ textAlign: 'left' }} id="contactModal">
              <div className="modal-header justify-content-end">
                <button type="button" className="btn_close_contact" onClick={closeSuccessModal} aria-label="Close">X</button>
              </div>
              <div className="modal-body">
                <span>Disponibilidad cargada exitosamente!</span>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-guardar-contact" onClick={closeSuccessModal}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};






