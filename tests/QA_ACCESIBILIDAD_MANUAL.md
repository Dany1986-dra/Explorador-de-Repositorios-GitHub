# Pruebas Manuales de Accesibilidad (A11y)

## 1. Objetivo
Documentar el proceso de validacion manual de accesibilidad del proyecto, enfocado en criterios WCAG 2.1 aplicables a navegacion por teclado, manejo de foco, semantica y anuncios dinamicos.

## 2. Alcance
Paginas validadas:
- index.html
- qa/test.html
- qa/diagnostico.html

Componentes validados:
- Busqueda de usuario y resultados
- Mensajes de estado (error, exito, carga)
- Modales (crear repositorio, agregar archivo, eliminar archivo)
- Enlaces de salto y foco visible

## 3. Entorno de Pruebas
- Sistema operativo: Windows
- Navegador principal: Chrome (ultima version estable)
- Navegador de contraste: Edge
- Lector de pantalla desktop: NVDA
- Lector de pantalla movil (referencia de validacion): TalkBack

## 4. Metodologia
### 4.1 Navegacion solo con teclado
Se ejecuto la interfaz completa usando unicamente:
- Tab
- Shift + Tab
- Enter
- Escape

Criterios esperados:
- El foco recorre controles interactivos en orden logico.
- El enlace "Saltar al contenido principal" aparece al primer Tab.
- No existen trampas de foco fuera de modales.
- En modales, el foco se mantiene dentro hasta cerrar.
- Al cerrar modal, el foco regresa al control que lo abrio.

### 4.2 Prueba con lector de pantalla (NVDA)
Se verifico lectura de:
- Landmarks (banner, main, search, region)
- Labels de inputs y ayudas de formulario
- Mensajes de estado y errores
- Cambios dinamicos de resultados anunciados con aria-live

Criterios esperados:
- Los nombres accesibles son claros y sin duplicidad confusa.
- Los cambios de estado se anuncian sin requerir reenfoque manual.
- Los elementos ocultos visualmente pero utiles para SR se leen correctamente.

### 4.3 Prueba movil (TalkBack - referencia)
Validacion orientativa para:
- Lectura secuencial de controles
- Identificacion de botones y campos
- Anuncios de estado relevantes

Nota: La validacion principal formal se realizo en desktop con NVDA.

## 5. Casos de Prueba

### Caso A11Y-01: Skip Link
Pasos:
1. Abrir index.html.
2. Presionar Tab una vez.
3. Activar "Saltar al contenido principal".

Resultado esperado:
- El foco se mueve al contenedor principal.

Estado:
- Aprobado

### Caso A11Y-02: Busqueda con teclado
Pasos:
1. Enfocar campo de usuario.
2. Escribir un usuario valido.
3. Presionar Enter.

Resultado esperado:
- Se ejecuta la busqueda sin usar mouse.
- Se anuncia estado de carga y resultado.

Estado:
- Aprobado

### Caso A11Y-03: Error por campo vacio
Pasos:
1. Dejar input vacio.
2. Ejecutar busqueda.

Resultado esperado:
- Se muestra error visible.
- El error es anunciado por lector de pantalla.

Estado:
- Aprobado

### Caso A11Y-04: Region dinamica de resultados
Pasos:
1. Buscar un usuario con repositorios.
2. Esperar respuesta.

Resultado esperado:
- El contenedor marca aria-busy=true durante carga y false al finalizar.
- Se anuncia cantidad de resultados.

Estado:
- Aprobado

### Caso A11Y-05: Apertura de modal
Pasos:
1. Enfocar boton "Crear Repositorio".
2. Activar con Enter.

Resultado esperado:
- Se abre dialog accesible.
- El foco va al primer control del formulario.

Estado:
- Aprobado

### Caso A11Y-06: Trampa de foco en modal
Pasos:
1. Con modal abierto, navegar con Tab y Shift+Tab.

Resultado esperado:
- El foco cicla dentro del modal.
- No salta a elementos del fondo.

Estado:
- Aprobado

### Caso A11Y-07: Cierre de modal con Escape
Pasos:
1. Abrir modal.
2. Presionar Escape.

Resultado esperado:
- Modal se cierra.
- Foco regresa al elemento lanzador.

Estado:
- Aprobado

### Caso A11Y-08: Foco visible
Pasos:
1. Recorrer botones, enlaces, inputs y selects con Tab.

Resultado esperado:
- Se observa indicador de foco visible y consistente.

Estado:
- Aprobado

## 6. Evidencia Recolectada (Sugerida)
Para cada ejecucion de QA se recomienda adjuntar:
- Capturas de pantalla del recorrido por teclado.
- Grabacion corta de NVDA anunciando estados.
- Registro de fecha, navegador y version.
- Resultado por caso (Aprobado/Rechazado) y observaciones.

Plantilla sugerida para documentar evidencias:
- Ver `tests/EVIDENCIAS_QA_A11Y.md`

## 7. Riesgos Residuales
- Diferencias de anuncio entre lectores de pantalla (NVDA vs TalkBack vs VoiceOver).
- Posibles variaciones en orden de tabulacion segun navegador.

## 8. Conclusion
La validacion manual ejecutada indica cumplimiento funcional de criterios A11y definidos para este proyecto en un contexto de uso real con teclado y lector de pantalla.

Recomendacion:
- Mantener esta bateria de pruebas en cada cambio de UI antes de publicar.
