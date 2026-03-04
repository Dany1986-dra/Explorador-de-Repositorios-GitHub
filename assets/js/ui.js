/**
 * ui.js - Gestión de la interfaz de usuario
 * Maneja: modales, mensajes, visibilidad de elementos
 */

// ============================================================
// UTILIDADES DE INTERFAZ
// ============================================================

/**
 * Obtiene un elemento del DOM
 * @param {string} id - ID del elemento
 * @returns {HTMLElement} El elemento encontrado
 */
function getElement(id) {
    return document.getElementById(id);
}

/**
 * Obtiene todos los elementos que coincidan con un selector
 * @param {string} selector - Selector CSS
 * @returns {NodeList} Elementos encontrados
 */
function getElements(selector) {
    return document.querySelectorAll(selector);
}

// ============================================================
// GESTIÓN DE MENSAJES
// ============================================================

/**
 * Muestra un mensaje de error
 * @param {string} mensaje - Texto del error
 */
function mostrarError(mensaje) {
    const errorElement = getElement('errorMessage');
    errorElement.textContent = mensaje;
    errorElement.hidden = false;
}

/**
 * Oculta el mensaje de error
 */
function ocultarError() {
    const errorElement = getElement('errorMessage');
    errorElement.hidden = true;
}

/**
 * Muestra un mensaje de éxito
 * @param {string} mensaje - Texto del éxito
 */
function mostrarConfirmacion(mensaje) {
    const successElement = getElement('successMessage');
    successElement.textContent = mensaje;
    successElement.hidden = false;
}

/**
 * Oculta el mensaje de éxito
 */
function ocultarConfirmacion() {
    const successElement = getElement('successMessage');
    successElement.hidden = true;
}

// ============================================================
// GESTIÓN DE CARGA
// ============================================================

/**
 * Muestra el indicador de carga
 */
function mostrarCargando() {
    const loadingElement = getElement('loading');
    loadingElement.hidden = false;
}

/**
 * Oculta el indicador de carga
 */
function ocultarCargando() {
    const loadingElement = getElement('loading');
    loadingElement.hidden = true;
}

// ============================================================
// GESTIÓN DE MODALES
// ============================================================

/**
 * Abre un diálogo modal
 * @param {string} modalId - ID del modal
 */
function abrirModal(modalId) {
    const modal = getElement(modalId);
    if (modal && modal.tagName === 'DIALOG') {
        modal.showModal();
    }
}

/**
 * Cierra un diálogo modal
 * @param {string} modalId - ID del modal
 */
function cerrarModal(modalId) {
    const modal = getElement(modalId);
    if (modal && modal.tagName === 'DIALOG') {
        modal.close();
    }
}

/**
 * Limpia los campos de un formulario
 * @param {string} formId - ID del formulario
 */
function limpiarFormulario(formId) {
    const form = getElement(formId);
    if (form) {
        form.reset();
    }
}

// ============================================================
// GESTIÓN DE VISIBILIDAD
// ============================================================

/**
 * Muestra un elemento por su ID
 * @param {string} id - ID del elemento
 */
function mostrarElemento(id) {
    const elemento = getElement(id);
    if (elemento) {
        elemento.hidden = false;
    }
}

/**
 * Oculta un elemento por su ID
 * @param {string} id - ID del elemento
 */
function ocultarElemento(id) {
    const elemento = getElement(id);
    if (elemento) {
        elemento.hidden = true;
    }
}

// ============================================================
// CONFIGURACIÓN DE EVENTOS DE MODALES
// ============================================================

/**
 * Configura los eventos de cierre de todos los modales
 */
function configurarEventosModales() {
    // Botones de cerrar
    const closeButtons = getElements('dialog .btn-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const dialog = e.target.closest('dialog');
            if (dialog) {
                dialog.close();
            }
        });
    });

    // Cierre con Escape
    const dialogs = getElements('dialog');
    dialogs.forEach(dialog => {
        dialog.addEventListener('cancel', (e) => {
            e.preventDefault();
        });

        dialog.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dialog.close();
            }
        });
    });

    // Botones que abren modales
    const openButtons = getElements('[data-modal]');
    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            abrirModal(modalId);
        });
    });
}

/**
 * Reinicia la interfaz (limpia todos los mensajes)
 */
function reiniciarInterfaz() {
    ocultarError();
    ocultarConfirmacion();
    ocultarCargando();
}
