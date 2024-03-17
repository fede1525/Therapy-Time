import React, { useState, useContext, useEffect } from 'react';
import { Context } from "../store/appContext";

export const Scheduling = () => {
  const { actions, store } = useContext(Context);
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const POSSIBLE_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const POSSIBLE_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  const openSuccessModal = () => {
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // Función para filtrar las horas posibles para endTime basadas en la hora seleccionada en startTime
  const filterEndHours = () => {
    if (startTime === '--:--') {
      return ['--:--'];
    } else {
      const startHourIndex = POSSIBLE_HOURS.findIndex(hour => hour === startTime);
      // Si startTime no es la última hora, devolvemos las horas siguientes
      if (startHourIndex < POSSIBLE_HOURS.length - 1) {
        return POSSIBLE_HOURS.slice(startHourIndex + 1);
      } else {
        // Si startTime es la última hora, devolvemos un array vacío
        return [];
      }
    }
  };

  // Efecto para actualizar las horas posibles para endTime cuando cambia la hora seleccionada en startTime
  useEffect(() => {
    const filteredHours = filterEndHours();
    if (!filteredHours.includes(endTime)) {
      // Si la hora seleccionada actualmente en endTime no está en las horas filtradas, establecer la primera hora filtrada
      setEndTime(filteredHours.length > 0 ? filteredHours[0] : '');
    }
  }, [startTime]);

  // Función para verificar si un día y una hora están disponibles en la base de datos
  const isAvailable = (day, hour) => {
    // Buscar el registro correspondiente al día y la hora
    return store.globalEnabled.some(item => item.day === day && hour >= item.start_hour && hour < item.end_hour);
  };

  const handleDayChange = (e) => {
    const day = e.target.value;
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(selectedDay => selectedDay !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleSave = async () => {
    setErrorMessage('');

    if (!selectedDays.length) {
      setErrorMessage('Debe seleccionar al menos un día.');
      return;
    }

    if (startTime >= endTime) {
      setErrorMessage('La hora de inicio debe ser menor que la hora fin.');
      return;
    }

    try {
      const data = selectedDays.map(day => ({
        day,
        start_hour: startTime,
        end_hour: endTime
      }));

      const response = await actions.addGlobalEnabled(data);
      console.log('Disponibilidad agregada:', response); // Verificar la estructura de la respuesta

      // Si la respuesta es una lista de objetos, puedes acceder a los elementos directamente
      if (!response || response.length === 0) {
        throw new Error('La respuesta es vacía o no es una lista de objetos');
      }

      // Aquí puedes hacer algo con la respuesta si es necesario

      // Limpiar campos después de guardar la información
      setSelectedDays([]);
      setStartTime(''); // Restablecer a '' después de guardar
      setEndTime('');
      openSuccessModal();
      actions.getGlobalEnabled();

      // Mostrar mensaje de éxito en un modal
      // Abre el modal aquí

    } catch (error) {
      console.error("Error al guardar disponibilidad global:", error);
      setErrorMessage(error.message || 'Error de red');
    }
  };

  useEffect(() => {
    actions.getGlobalEnabled();
    setStartTime('--:--'); // Establecer el valor predeterminado en '--:--' al cargar la página
  }, []);

  const handleEdit = async (day) => {
    try {
      const response = await actions.getGlobalEnabledByDay(day);
      console.log('Datos de disponibilidad por día:', response); // Verificar la estructura de la respuesta

      // Autocompletar el formulario con la información obtenida
      setStartTime(response[0].start_hour);
      setEndTime(response[0].end_hour);

      // Marcar el día como seleccionado (solo visualmente)
      setSelectedDays([day]);

      // Deshabilitar la modificación de los días
      // Esto previene que se marque/desmarque cualquier día después de hacer clic en el botón editar
      // Si deseas que la modificación de los días siga siendo
    } catch (error) {
      console.error("Error al obtener disponibilidad por día:", error);
    }
  };

  return (
    <div className="row">
      <div className="col">
        <h2>Disponibilidad Existente</h2>
        <table className="table">
          <thead>
            <tr>
              <th></th>
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
                  <td key={hourIndex} style={{ backgroundColor: isAvailable(day, hour) ? 'green' : 'transparent' }}>
                    {/* Aquí puedes mostrar cualquier contenido adicional, como botones de acción */}
                    {/* Por ejemplo: <button onClick={() => handleAction(day, hour)}>Acción</button> */}
                  </td>
                ))}
                <td>
                  <button onClick={() => handleEdit(day)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col">
        <div>
          <h2>Seleccionar Disponibilidad</h2>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          <div>
            <h3>Seleccionar Días</h3>
            {POSSIBLE_DAYS.map(day => (
              <div key={day}>
                <input
                  type="checkbox"
                  id={day}
                  value={day}
                  onChange={handleDayChange}
                  checked={selectedDays.includes(day)}
                />
                <label htmlFor={day}>{day}</label>
              </div>
            ))}
          </div>
          <div className='d-flex mb-3 mt-3'>
            <select className="mr-3" value={startTime} onChange={handleStartTimeChange}>
              <option value="">--:--</option>
              {POSSIBLE_HOURS.map(hour => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
            <select className='ml-2' value={endTime} onChange={handleEndTimeChange}>
              <option value="">--:--</option>
              {filterEndHours().map(hour => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
          </div>
          <button onClick={handleSave}>Guardar</button>
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
