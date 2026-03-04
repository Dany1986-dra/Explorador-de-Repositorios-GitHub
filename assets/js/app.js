/**
 * app.js - Lógica principal de la aplicación
 * Orquesta todo: búsqueda, creación, UI, etc.
 */

// ============================================================
// VARIABLES GLOBALES
// ============================================================

let repoActual = null; // Repositorio seleccionado actualmente
let usuarioActual = null; // Usuario siendo consultado

// Se inicializan en DOMContentLoaded
let searchInput = null;
let searchButton = null;
let createRepoBtn = null;

// ============================================================
// EVENTOS PRINCIPALES
// ============================================================

/**
 * Inicializa los eventos cuando el DOM está cargado
 */
document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias al DOM (AHORA el DOM está listo)
    searchInput = getElement('searchInput');
    searchButton = getElement('searchButton');
    createRepoBtn = getElement('createRepoBtn');

    // Verificar que los elementos existan
    if (!searchInput || !searchButton) {
        console.error('Error: No se encontraron elementos del DOM');
        return;
    }

    // Configurar eventos de búsqueda
    searchButton.addEventListener('click', manejarBusqueda);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            manejarBusqueda();
        }
    });

    // Configurar botón crear repositorio
    if (createRepoBtn) {
        createRepoBtn.addEventListener('click', () => {
            abrirModal('createRepoForm');
        });
    }

    // Configurar eventos de formularios
    configurarEventosFormularios();

    // Configurar eventos de modales
    configurarEventosModales();

    console.log('✅ App inicializada correctamente');
});

/**
 * Reinicia la interfaz limpiando mensajes y errores
 */
function reiniciarInterfaz() {
    ocultarError();
    ocultarConfirmacion();
}

// ============================================================
// BÚSQUEDA DE REPOSITORIOS
// ============================================================

/**
 * Maneja la búsqueda de repositorios
 */
async function manejarBusqueda() {
    const usuario = searchInput.value.trim();

    if (!usuario) {
        mostrarError('Por favor, ingresa un nombre de usuario.');
        return;
    }

    usuarioActual = usuario;
    repoActual = null;
    reiniciarInterfaz();
    mostrarCargando();

    try {
        const repos = await buscarRepositoriosAPI(usuario);
        mostrarRepositorios(repos);
        mostrarElemento('acciones');
        ocultarCargando();
    } catch (error) {
        mostrarError(error.message);
        ocultarCargando();
    }
}

// ============================================================
// VISUALIZACIÓN DE REPOSITORIOS
// ============================================================

/**
 * Muestra los repositorios en el DOM
 * @param {Array} repos - Lista de repositorios
 */
function mostrarRepositorios(repos) {
    const container = getElement('reposContainer');

    if (!repos || repos.length === 0) {
        mostrarError('Este usuario no tiene repositorios públicos.');
        container.innerHTML = '';
        return;
    }

    container.innerHTML = '';

    repos.forEach(repo => {
        const tarjeta = crearTarjetaRepositorio(repo);
        container.appendChild(tarjeta);
    });
}

/**
 * Crea una tarjeta de repositorio
 * @param {Object} repo - Datos del repositorio
 * @returns {HTMLElement} Elemento tarjeta
 */
function crearTarjetaRepositorio(repo) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'repo-card';
    tarjeta.setAttribute('data-repo-name', repo.name);

    tarjeta.innerHTML = `
        <div class="repo-header">
            <h3 class="repo-name">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                    ${repo.name}
                </a>
            </h3>
        </div>

        <div class="repo-description">
            ${repo.description || '<em>Sin descripción</em>'}
        </div>

        <div class="repo-stats">
            <span class="stat">
                <span class="icon">⭐</span>
                <span>${repo.stargazers_count}</span>
            </span>
            <span class="stat">
                <span class="icon">🍴</span>
                <span>${repo.forks_count}</span>
            </span>
            <span class="stat">
                <span class="icon">📝</span>
                <span>${repo.language || 'N/A'}</span>
            </span>
        </div>

        <div class="repo-actions">
            <button 
                type="button" 
                class="btn btn-sm btn-primary"
                data-action="add-file"
                data-repo="${repo.name}">
                Agregar Archivo
            </button>
            <button 
                type="button" 
                class="btn btn-sm btn-danger"
                data-action="delete-file"
                data-repo="${repo.name}">
                Eliminar Archivo
            </button>
        </div>
    `;

    // Agregar eventos a los botones de la tarjeta
    configurarBotonesTarjeta(tarjeta);

    return tarjeta;
}

/**
 * Configura los eventos de los botones en una tarjeta
 * @param {HTMLElement} tarjeta - Elemento tarjeta
 */
function configurarBotonesTarjeta(tarjeta) {
    const botonesAccion = tarjeta.querySelectorAll('[data-action]');

    botonesAccion.forEach(boton => {
        boton.addEventListener('click', () => {
            repoActual = boton.getAttribute('data-repo');
            const accion = boton.getAttribute('data-action');

            if (accion === 'add-file') {
                abrirModal('addFileForm');
            } else if (accion === 'delete-file') {
                abrirModal('deleteFileForm');
            }
        });
    });
}

// ============================================================
// GESTIÓN DE FORMULARIOS
// ============================================================

/**
 * Configura los eventos de envío de formularios
 */
function configurarEventosFormularios() {
    // Crear repositorio
    const createForm = getElement('createRepoFormElement');
    if (createForm) {
        createForm.addEventListener('submit', manejarCrearRepositorio);
    }

    // Agregar archivo
    const addFileForm = getElement('addFileFormElement');
    if (addFileForm) {
        addFileForm.addEventListener('submit', manejarAgregarArchivo);
    }

    // Eliminar archivo
    const deleteFileForm = getElement('deleteFileFormElement');
    if (deleteFileForm) {
        deleteFileForm.addEventListener('submit', manejarEliminarArchivo);
    }
}

// ============================================================
// CREAR REPOSITORIO
// ============================================================

/**
 * Maneja la creación de un repositorio
 * @param {Event} event - Evento del formulario
 */
async function manejarCrearRepositorio(event) {
    event.preventDefault();

    const nombre = getElement('newRepoName').value.trim();
    const descripcion = getElement('newRepoDesc').value.trim();
    const privado = getElement('newRepoPrivate').value === 'true';

    if (!nombre) {
        mostrarError('El nombre del repositorio es requerido.');
        return;
    }

    mostrarCargando();

    try {
        await crearRepositorioAPI({
            name: nombre,
            description: descripcion,
            private: privado,
        });

        mostrarConfirmacion('Repositorio creado exitosamente.');
        event.target.reset();
        cerrarModal('createRepoForm');

        // Recargar lista después de 2 segundos
        setTimeout(() => {
            manejarBusqueda();
        }, 2000);
    } catch (error) {
        mostrarError(error.message);
    } finally {
        ocultarCargando();
    }
}

// ============================================================
// AGREGAR ARCHIVO
// ============================================================

/**
 * Maneja la adición de un archivo
 * @param {Event} event - Evento del formulario
 */
async function manejarAgregarArchivo(event) {
    event.preventDefault();

    const ruta = getElement('filePath').value.trim();
    const contenido = getElement('fileContent').value.trim();
    const mensaje = getElement('fileCommitMsg').value.trim();

    if (!usuarioActual || !repoActual || !ruta || !contenido || !mensaje) {
        mostrarError('Por favor, completa todos los campos.');
        return;
    }

    mostrarCargando();

    try {
        await agregarArchivoAPI(usuarioActual, repoActual, {
            ruta,
            contenido,
            mensaje,
        });

        mostrarConfirmacion('Archivo agregado exitosamente.');
        event.target.reset();
        cerrarModal('addFileForm');
    } catch (error) {
        mostrarError(error.message);
    } finally {
        ocultarCargando();
    }
}

// ============================================================
// ELIMINAR ARCHIVO
// ============================================================

/**
 * Maneja la eliminación de un archivo
 * @param {Event} event - Evento del formulario
 */
async function manejarEliminarArchivo(event) {
    event.preventDefault();

    const ruta = getElement('delFilePath').value.trim();
    const mensaje = getElement('delCommitMsg').value.trim();

    if (!usuarioActual || !repoActual || !ruta || !mensaje) {
        mostrarError('Por favor, completa todos los campos.');
        return;
    }

    mostrarCargando();

    try {
        await eliminarArchivoAPI(usuarioActual, repoActual, {
            ruta,
            mensaje,
        });

        mostrarConfirmacion('Archivo eliminado exitosamente.');
        event.target.reset();
        cerrarModal('deleteFileForm');
    } catch (error) {
        mostrarError(error.message);
    } finally {
        ocultarCargando();
    }
}
