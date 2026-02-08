import { useMemo, useState } from 'react';
import './App.css';

function App() {
  // Estado principal: almacena todas las tareas del listado.
  // Cada tarea es un objeto con esta forma:
  // { texto: string, completada: boolean }
  const [tareas, setTareas] = useState([]);

  // Estado del input superior para crear una nueva tarea.
  const [nuevaTarea, setNuevaTarea] = useState('');

  // Guarda el índice de la tarea que está en modo edición.
  // Si vale null significa que ninguna tarea se está editando.
  const [indiceEnEdicion, setIndiceEnEdicion] = useState(null);

  // Estado temporal con el texto que se está escribiendo durante la edición.
  const [textoEdicion, setTextoEdicion] = useState('');

  // Crea una tarea nueva leyendo el texto del input principal.
  const agregarTarea = () => {
    // trim() evita guardar tareas vacías o con solo espacios.
    const textoLimpio = nuevaTarea.trim();
    if (textoLimpio === '') return;

    // Se añade una nueva tarea al final conservando las anteriores.
    setTareas([
      ...tareas,
      {
        texto: textoLimpio,
        completada: false,
      },
    ]);

    // Reinicia el campo para permitir crear otra tarea rápidamente.
    setNuevaTarea('');
  };

  // Elimina la tarea cuyo índice coincide con el recibido.
  const eliminarTarea = (index) => {
    // filter crea un nuevo array sin la tarea eliminada.
    setTareas(tareas.filter((_, i) => i !== index));

    // Si justo estábamos editando esa tarea, salimos del modo edición.
    if (indiceEnEdicion === index) {
      setIndiceEnEdicion(null);
      setTextoEdicion('');
    }
  };

  // Alterna el estado completada/no completada para una tarea específica.
  const toggleCompletada = (index) => {
    setTareas(
      // map devuelve un nuevo array: solo se modifica la tarea objetivo.
      tareas.map((tarea, i) =>
        i === index ? { ...tarea, completada: !tarea.completada } : tarea,
      ),
    );
  };

  // Activa la edición para la tarea seleccionada y precarga su texto actual.
  const iniciarEdicion = (index) => {
    setIndiceEnEdicion(index);
    setTextoEdicion(tareas[index].texto);
  };

  // Guarda el texto editado en la tarea seleccionada.
  const guardarEdicion = (index) => {
    // Evita reemplazar por texto vacío.
    const textoLimpio = textoEdicion.trim();
    if (textoLimpio === '') return;

    setTareas(
      // Actualiza únicamente la tarea en edición.
      tareas.map((tarea, i) =>
        i === index ? { ...tarea, texto: textoLimpio } : tarea,
      ),
    );

    // Cierra el modo edición y limpia el buffer temporal.
    setIndiceEnEdicion(null);
    setTextoEdicion('');
  };

  // Cancela la edición sin modificar la tarea original.
  const cancelarEdicion = () => {
    setIndiceEnEdicion(null);
    setTextoEdicion('');
  };

  // Calcula contadores derivados del array de tareas.
  // useMemo evita recalcular en renders donde `tareas` no cambia.
  const { tareasCompletadas, tareasIncompletas } = useMemo(() => {
    const tareasCompletadas = tareas.filter((t) => t.completada).length;

    return {
      tareasCompletadas,
      tareasIncompletas: tareas.length - tareasCompletadas,
    };
  }, [tareas]);

  return (
    <div className="app">
      <h1>To-Do List</h1>

      <div className="acciones-principales">
        {/* Input controlado para crear nuevas tareas */}
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Escribe una tarea"
          // Permite crear tarea pulsando Enter.
          onKeyDown={(e) => e.key === 'Enter' && agregarTarea()}
        />
        <button onClick={agregarTarea}>Agregar</button>
      </div>

      {/* Contadores de progreso */}
      <div className="contadores">
        <p>Incompletas: {tareasIncompletas}</p>
        <p>Completadas: {tareasCompletadas}</p>
      </div>

      <ul>
        {tareas.map((tarea, index) => (
          // Se aplica clase `completada` para marcar visualmente la tarea.
          <li key={index} className={tarea.completada ? 'tarea completada' : 'tarea'}>
            {/* Botón para alternar estado de completada */}
            <button onClick={() => toggleCompletada(index)}>
              {tarea.completada ? '✔️' : '⭕'}
            </button>

            {indiceEnEdicion === index ? (
              // Vista cuando la tarea está en edición.
              <>
                <input
                  type="text"
                  value={textoEdicion}
                  onChange={(e) => setTextoEdicion(e.target.value)}
                />
                <button onClick={() => guardarEdicion(index)}>Guardar</button>
                <button onClick={cancelarEdicion}>Cancelar</button>
              </>
            ) : (
              // Vista normal cuando la tarea no está en edición.
              <>
                <span>{tarea.texto}</span>
                <button onClick={() => iniciarEdicion(index)}>Editar</button>
                <button onClick={() => eliminarTarea(index)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
