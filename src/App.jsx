import { useState } from 'react'; // Importamos useState para manejar estados

function App() {
  // Estado que guarda un array de tareas, cada una con texto y si está completada
  const [tareas, setTareas] = useState([]);

  // Estado para controlar lo que el usuario escribe en el input
  const [nuevaTarea, setNuevaTarea] = useState('');

  // Función para agregar una nueva tarea
  const agregarTarea = () => {
    // Evita agregar tareas vacías
    if (nuevaTarea.trim() === '') return;

    // Creamos un objeto tarea con texto y estado inicial "no completada"
    const tareaObj = {
      texto: nuevaTarea,
      completada: false
    };

    // Añadimos la nueva tarea al array
    setTareas([...tareas, tareaObj]);

    // Limpiamos el input
    setNuevaTarea('');
  };
  // Función para eliminar una tarea por su índice
  const eliminarTarea = (index) => {
    const nuevasTareas = [...tareas];
    nuevasTareas.splice(index, 1);
    setTareas(nuevasTareas);
  }

  // Función para alternar el estado de completada/no completada
  const toggleCompletada = (index) => {
    // Creamos una copia del array de tareas
    const nuevasTareas = [...tareas];

    // Cambiamos el valor booleano de completada
    nuevasTareas[index].completada = !nuevasTareas[index].completada;

    // Actualizamos el estado
    setTareas(nuevasTareas);
  };

  return (
    <div>
      <h1>To-Do List</h1>

      {/* Input controlado para escribir una nueva tarea */}
      <input
        type="text"
        value={nuevaTarea}
        onChange={(e) => setNuevaTarea(e.target.value)}
        placeholder="Escribe una tarea"
      />

      {/* Botón para agregar la tarea */}
      <button onClick={agregarTarea}>Agregar</button>

      {/* Lista de tareas */}
      <ul>
        {tareas.map((tarea, index) => (
          <li key={index}>

            {/* Icono/botón para marcar completada o no */}
            <button onClick={() => toggleCompletada(index)}>
              {/* Si está completada mostramos un check, si no un círculo */}
              {tarea.completada ? '✔️' : '⭕'}
            </button>

            {/* Texto de la tarea, tachado si está completada */}
            <span style={{ textDecoration: tarea.completada ? 'line-through' : 'none' }}>
              {tarea.texto}
            </span>
            
            {/* Botón para eliminar tarea */}
            <button onClick={() => eliminarTarea(index)}>Eliminar</button>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
