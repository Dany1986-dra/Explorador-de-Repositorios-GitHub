/**
 * ui.js - Gestión de la interfaz de usuario
 * Maneja: modales, mensajes, visibilidad de elementos
 */

// ============================================================
// UTILIDADES DE INTERFAZ
// ============================================================

const focusStateByModal = new Map();

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
        focusStateByModal.set(modalId, document.activeElement);
        modal.showModal();

        const firstFocusable = modal.querySelector('input, textarea, select, button, [href], [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
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

        const previousFocus = focusStateByModal.get(modalId);
        if (previousFocus && typeof previousFocus.focus === 'function') {
            previousFocus.focus();
        }
        focusStateByModal.delete(modalId);
    }
}

/**
 * Anuncia cambios dinámicos para lectores de pantalla
 * @param {string} mensaje - Mensaje a anunciar
 */
function anunciarEstado(mensaje) {
    const announcer = getElement('resultsAnnouncer');
    if (!announcer) {
        return;
    }

    announcer.textContent = '';
    requestAnimationFrame(() => {
        announcer.textContent = mensaje;
    });
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
                cerrarModal(dialog.id);
            }
        });
    });

    // Cierre con Escape
    const dialogs = getElements('dialog');
    dialogs.forEach(dialog => {
        dialog.addEventListener('cancel', (e) => {
            e.preventDefault();
            cerrarModal(dialog.id);
        });

        dialog.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                cerrarModal(dialog.id);
            }

            if (e.key === 'Tab') {
                const focusableElements = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (!focusableElements.length) {
                    e.preventDefault();
                    return;
                }

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
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
