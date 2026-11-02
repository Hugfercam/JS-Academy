# Ampliar el temario

El contenido está separado de las pantallas. Añadir lecciones, preguntas y retos de un archivo no requiere reconstruir la interfaz.

## Material de entrada

Guarda los nuevos apuntes en `materiales/`. De cada documento hay que extraer y revisar los conceptos, crear resúmenes y preguntas, y conservar el nombre del documento y sus páginas. No basta con copiar el PDF para que se convierta automáticamente en ejercicios.

## Añadir contenido a un tema existente

- `src/lessons.js`: añade lecciones al array del tema, con ID estable, título, páginas, explicación, ejemplo y error frecuente.
- `src/question-bank.js`: añade preguntas con ID único, cuatro opciones, índice correcto, explicación, tema, dificultad y referencia.
- `src/content.js`: añade retos con enunciado, plantilla, función de entrada y casos normales, límite e inválidos. Define el contrato antes de escribir los tests.
- `src/coaching.js`: añade tres pistas, una solución comentada, explicación y una orientación de revisión para cada nuevo reto. Los tests ejecutan la solución contra los casos del reto. Si el contrato prohíbe modificar argumentos, usa `unchangedArgs: true` en los casos pertinentes.

Las pantallas de apuntes, el selector de temas y el selector de retos leen estos datos automáticamente.

## Añadir un tema nuevo

1. Registra su documento en `sources` y sus lecciones en `lessons`, ambos en `src/lessons.js`.
2. Añade sus metadatos a `baseTopics` en `src/content.js` (ID estable, título, número y descripción).
3. Usa ese mismo `topicId` en preguntas y retos. El campo `number` se muestra en la cabecera del tema; los títulos de las lecciones permiten indicar el número real del nuevo tema o unidad.
4. Actualiza los totales esperados y la cobertura en los tests si amplías el banco. Ejecuta `npm test` y genera el nuevo paquete con `scripts/prepare-deploy.ps1`.

## Progreso y actualizaciones

Conserva los IDs de los ejercicios existentes. Los intentos y borradores se guardan por ID, de forma que añadir contenido no borra lo anterior. Si un ejercicio cambia de objetivo, asígnale un ID nuevo. No cambies la clave de localStorage ni la versión del esquema por añadir contenidos.

Sube el ZIP al mismo proyecto de Cloudflare Pages, en producción, y sigue usando `https://jsacademy-chc.pages.dev/`. Abre la PWA con conexión, acepta la nueva versión y después podrás estudiar los contenidos incorporados en modo avión. No hay que desinstalar ni borrar datos. Exportar una copia antes de una actualización es una forma práctica de conservar un respaldo.

## Cuándo hace falta ampliar el motor

Los retos actuales evalúan funciones síncronas de un archivo y Biblioteca tiene una rúbrica específica. Si llegan ejercicios de DOM, eventos, asincronía o proyectos con varios módulos, habrá que extender el entorno de ejecución y sus pruebas. El editor Worker actual no dispone de document, alert ni prompt. Esas unidades pueden incorporarse primero como apuntes y test.
