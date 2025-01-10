

document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://vacantes-api.vercel.app';

  // Elemento donde se mostrarán los cursos
  const cursosList = document.getElementById('cursos-list');

  // Función para obtener todos los cursos
  async function fetchCursos() {
    try {
      const response = await fetch(`${API_URL}/cursos`);
      if (!response.ok) {
        throw new Error('Error al obtener los cursos');
      }
      const cursos = await response.json();
      console.log(cursos); // Ver los datos obtenidos
      mostrarCursos(cursos);
    } catch (error) {
      console.error(error);
    }
  }

  // Función para mostrar los cursos
  async function mostrarCursos(cursos: any[]) {
    // Ordenar alfabéticamente por sigla
    cursos.sort((a, b) => a.sigla.localeCompare(b.sigla));

    // Limpiar la lista
    if (!cursosList) {
      throw new Error('Elemento cursos-list no encontrado');
    }
    cursosList.innerHTML = '';

    // Mostrar los cursos en la lista
    for (const curso of cursos) {
      const li = document.createElement('li');
      li.textContent = `${curso.sigla}`;

      // Obtener las vacantes del curso
      const vacantes = await fetchVacantes(curso.nrc);
      li.textContent = `${curso.sigla} - Vacantes: ${vacantes}`; // Actualiza el texto correctamente

      cursosList.appendChild(li);
    }
  }

  // Función para obtener las vacantes de una sección por NRC
  async function fetchVacantes(nrc: string) {
    try {
      const response = await fetch(`${API_URL}/cursos/${nrc}`);
      if (!response.ok) {
        throw new Error(`Error al obtener vacantes para NRC: ${nrc}`);
      }

      const vacantesData = await response.json();
      console.log(vacantesData); // Ver la respuesta de vacantes
      if (vacantesData) {
        // Asegurarse de que se está obteniendo un valor válido para las vacantes
        return vacantesData.vacantes.total_disponibles;
      }
      return 'No disponible';
    } catch (error) {
      console.error(error);
      return 'Error al obtener vacantes';
    }
  }

  // Llamada inicial para obtener los cursos
  fetchCursos();
});
