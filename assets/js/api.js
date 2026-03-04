/**
 * api.js - Gestión de llamadas a la API de GitHub
 * Usa Axios para realizar solicitudes HTTP
 * 
 * IMPORTANTE: El token se importa desde config.js (archivo privado)
 * Para usar este proyecto, debes crear tu propio config.js basado en config.example.js
 */

// El token GITHUB_TOKEN se importa desde config.js (NO subir ese archivo a GitHub)
// Asegúrate de cargar config.js antes que este archivo en tu HTML
// Formato esperado del token: const GITHUB_TOKEN = 'ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
// Ejemplo: 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 (40 caracteres después de 'ghp_')
const GITHUB_API_BASE = 'https://api.github.com';
const API_TIMEOUT = 10000; // 10 segundos

// ============================================================
// CONFIGURACIÓN DE AXIOS
// ============================================================

/**
 * Obtiene los headers de autenticación
 * @returns {Object} Headers con token de autenticación
 */
function obtenerHeadersAutenticacion() {
    return {
        'Authorization': `token ${GITHUB_TOKEN}`
    };
}

/**
 * Crea una instancia de axios configurada
 * @returns {axios.AxiosInstance} Instancia de axios
 */
function crearInstanceAxios() {
    return axios.create({
        baseURL: GITHUB_API_BASE,
        timeout: API_TIMEOUT,
        headers: obtenerHeadersAutenticacion(),
    });
}

// ============================================================
// OPERACIONES CON REPOSITORIOS
// ============================================================

/**
 * Busca repositorios de un usuario en GitHub
 * @param {string} usuario - Nombre de usuario
 * @returns {Promise<Array>} Lista de repositorios
 */
async function buscarRepositoriosAPI(usuario) {
    if (!usuario || usuario.trim() === '') {
        throw new Error('Por favor, ingresa un nombre de usuario válido.');
    }

    const endPoint = `/users/${usuario}/repos`;
    const axiosInstance = crearInstanceAxios();

    try {
        const response = await axiosInstance.get(endPoint, {
            params: {
                sort: 'updated',
                direction: 'desc',
                per_page: 100,
            }
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error('Usuario no encontrado. Por favor, verifica el nombre de usuario.');
        } else if (error.response?.status === 401) {
            throw new Error('Error de autenticación. Verifica tu token.');
        } else {
            throw new Error(`Error al buscar repositorios: ${error.message}`);
        }
    }
}

/**
 * Crea un nuevo repositorio
 * @param {Object} datos - Datos del repositorio
 * @returns {Promise<Object>} Repositorio creado
 */
async function crearRepositorioAPI(datos) {
    const endPoint = '/user/repos';
    const axiosInstance = crearInstanceAxios();

    try {
        const response = await axiosInstance.post(endPoint, datos);
        return response.data;
    } catch (error) {
        throw new Error(`Error al crear el repositorio: ${error.response?.data?.message || error.message}`);
    }
}

// ============================================================
// OPERACIONES CON ARCHIVOS
// ============================================================

/**
 * Obtiene el SHA de un archivo en un repositorio
 * @param {string} usuario - Propietario del repositorio
 * @param {string} repo - Nombre del repositorio
 * @param {string} ruta - Ruta del archivo
 * @returns {Promise<string>} SHA del archivo
 */
async function obtenerSHAArchivo(usuario, repo, ruta) {
    if (!ruta || ruta.trim() === '') {
        return null;
    }

    const endPoint = `/repos/${usuario}/${repo}/contents/${ruta}`;
    const axiosInstance = crearInstanceAxios();

    try {
        const response = await axiosInstance.get(endPoint);
        return response.data.sha;
    } catch (error) {
        return null;
    }
}

/**
 * Agrega un archivo a un repositorio
 * @param {string} usuario - Propietario del repositorio
 * @param {string} repo - Nombre del repositorio
 * @param {Object} datos - Datos del archivo
 * @returns {Promise<Object>} Respuesta de la API
 */
async function agregarArchivoAPI(usuario, repo, datos) {
    if (!datos.ruta || !datos.contenido || !datos.mensaje) {
        throw new Error('Por favor, completa todos los campos.');
    }

    const endPoint = `/repos/${usuario}/${repo}/contents/${datos.ruta}`;
    const axiosInstance = crearInstanceAxios();

    const payload = {
        message: datos.mensaje,
        content: btoa(unescape(encodeURIComponent(datos.contenido))),
    };

    try {
        const response = await axiosInstance.put(endPoint, payload);
        return response.data;
    } catch (error) {
        throw new Error(`Error al agregar el archivo: ${error.message}`);
    }
}

/**
 * Elimina un archivo de un repositorio
 * @param {string} usuario - Propietario del repositorio
 * @param {string} repo - Nombre del repositorio
 * @param {Object} datos - Datos del archivo
 * @returns {Promise<Object>} Respuesta de la API
 */
async function eliminarArchivoAPI(usuario, repo, datos) {
    if (!datos.ruta || !datos.mensaje) {
        throw new Error('Por favor, completa todos los campos.');
    }

    const sha = await obtenerSHAArchivo(usuario, repo, datos.ruta);
    if (!sha) {
        throw new Error('No se encontró el archivo. Verifica la ruta.');
    }

    const endPoint = `/repos/${usuario}/${repo}/contents/${datos.ruta}`;
    const axiosInstance = crearInstanceAxios();

    const payload = {
        message: datos.mensaje,
        sha: sha,
    };

    try {
        const response = await axiosInstance.delete(endPoint, { data: payload });
        return response.data;
    } catch (error) {
        throw new Error(`Error al eliminar el archivo: ${error.message}`);
    }
}
