# Contenido académico incorporado

Fuentes locales en `materiales/`, leídas completas el 27/10/2026. No se publican ni copian los PDF a `public/` o `dist/`.

| Fuente | Cobertura en la PWA |
| --- | --- |
| Apuntes_DWEC_Tema2_Apartado1_JavaScript.pdf, 8 páginas | 7 lecciones; entorno, variables y scope, operadores, tipos y conversiones, strings, control y diálogos; 12 preguntas |
| Apuntes_DWEC_Tema2_Apartado2_Funciones.pdf, 6 páginas | 6 lecciones; retorno/defaults, callbacks, expresiones, flechas, rest/spread, closures; 12 preguntas |
| Apuntes_DWEC_Tema2_Apartado3_Objetos_y_prototipos.pdf, 7 páginas | 10 lecciones siguiendo los epígrafes 3.1–3.10; 12 preguntas |
| Apuntes_DWEC_Tema2_Apartado4_Modulos.pdf, 6 páginas | 5 lecciones; sistemas, export/import, HTML, dependencias y organización; 12 preguntas |
| Apuntes_DWEC_Tema2_Apartado5_Programacion_funcional_AMPLIADOS.pdf, 8 páginas | 9 lecciones; paradigma, filter, find, forEach, map e inmutabilidad, reduce y agregaciones, comparativa; 12 preguntas y 3 retos prácticos |
| Examen_repaso_DWEC_Gestor_Biblioteca.pdf, 4 páginas | 10 ejercicios, pesos originales, plantilla sin soluciones, pistas opcionales, corrección automática y descarga de biblioteca.js |

Los resúmenes, preguntas de cuatro opciones y retos son adaptaciones pedagógicas, no copias íntegramente literales. Cada lección indica documento y páginas. Los 15 retos incluyen referencias y contratos explícitos; los ejercicios nuevos de límite, géneros y funcionales preparan conceptos y patrones del curso.

## Decisiones sobre Biblioteca

- Pesos originales: 0.5, 1, 0.5, 1, 1, 1, 1, 1, 1 y 2 puntos.
- El corrector reparte cada peso entre comprobaciones independientes. La nota es orientativa; no evalúa claridad ni razonamiento.
- Se exige un constructor invocable con `new` y métodos del prototipo, además de comportamiento. No se compara el texto con una solución.
- Se comprueban timestamps con fechas ISO. Los retornos que el documento no pide no se imponen. No se resuelven silenciosamente ambigüedades sobre coerción de páginas o normalización de géneros.
- La disponibilidad sigue la fórmula literal límite menos cantidad, incluso con resultado negativo si el límite se reduce.
- Cada comprobación crea un nuevo ámbito con el archivo completo. Los métodos de los ejercicios 5 y 6 se prueban con instancias preparadas desde el prototipo para reducir dependencias del constructor. Algunas pruebas de integración de los ejercicios 4 y 8 sí dependen de los métodos previos.
- El modo actual es repaso libre con duración orientativa, sin reloj obligatorio ni entrega automática.
- La plantilla deja también las variables globales por resolver para que el ejercicio 1 no regale puntos. Es una adaptación respecto a la plantilla del PDF, que las incluía.

## Verificación

Validación del contenido y fuentes; solución de referencia y alternativa contra la rúbrica; errores parciales y de sintaxis; conservación de borrador/nota; ejecución real de los Worker mediante adaptador Node y terminación de bucles infinitos. El código de referencia de tests no se empaqueta en la PWA.

Pendiente: revisión visual e instalación/offline en Android real. El acceso automatizado al navegador no estaba disponible en la entrega inicial; no se considera la compilación como prueba de instalación.

## Pistas y corrección didáctica

Se añaden tres pistas secuenciales y una posible solución comentada para cada uno de los 12 retos y los 10 apartados de Biblioteca. Las soluciones son adaptaciones didácticas creadas para la PWA (el PDF del examen no contenía soluciones). Solo se insertan en la interfaz tras solicitar y confirmar su revelado; nunca sustituyen el borrador ni restan puntuación. Los tests ejecutan todas las soluciones de retos y la combinación de soluciones de Biblioteca.

En los retos, cada comprobación informa de la llamada original, valor y tipo esperados, valor y tipo obtenidos o excepción, y hasta 15 mensajes de consola. Los valores especiales como undefined, NaN y null se distinguen. Las orientaciones responden a hechos observados y no aseguran identificar la causa exacta del error. Los fragmentos y logs se muestran como texto escapado. El reto de géneros comprueba además el requisito ya existente de no modificar los argumentos.

En Biblioteca se conserva la rúbrica por ejercicio y se añaden orientaciones sobre los fallos y pistas progresivas por apartado. Sus comprobaciones de escenario no se presentan como si fueran llamadas simples de función con un único resultado esperado.

## Prácticas guiadas estructuradas

Se incorporan tres prácticas guiadas paso a paso (33 etapas en total) con desbloqueo progresivo, pistas en tres niveles pedagógicos (conceptual, orientativa y técnica), soluciones comentadas bajo petición y evaluación de comportamiento en Worker:

1. **Tema 2.5 · Programación funcional ("Filtrar y agrupar gastos")**: 17 etapas (8 de `filter()`, 8 de `reduce()` y agrupaciones por clave, y 1 desafío final autónomo con métricas financieras).
2. **Tema 2.3 · Objetos y Prototipos — Práctica A ("La academia de aventureros: crea tus personajes")**: 8 etapas de nivel iniciación:
   - Etapa 1: Recordar objetos literales (`crearPersonaje(nombre, vida, ataque)`).
   - Etapa 2: El problema de repetir objetos (`validarEstructuraPersonaje`).
   - Etapa 3: Función constructora `Personaje(nombre, vida, ataque)` y convención PascalCase.
   - Etapa 4: Comprender `this` como referencia a la nueva instancia creada (`this.vidaMaxima = vida`).
   - Etapa 5: Crear instancias independientes mediante `new` (`crearParejaAventurera()`).
   - Etapa 6: Métodos en el constructor (`this.mostrarEstado()`).
   - Etapa 7: Modificar propiedades mediante métodos (`this.recibirDanyo(cantidad)` con tope en 0).
   - Etapa 8: Desafío autónomo de tienda con constructor `Producto(nombre, precio, stock)` y métodos `obtenerInfo()`, `vender()` y `reponer()`.
3. **Tema 2.3 · Objetos y Prototipos — Práctica B ("La academia de aventureros: habilidades compartidas")**: 8 etapas de nivel intermedio inicial (con recomendación pedagógica previa de la Práctica A no bloqueante):
   - Etapa 1: Recordar constructores y verificar la duplicación de funciones en memoria (`analizarInstancias()`).
   - Etapa 2: Introducción a `Constructor.prototype` con la analogía del manual del gremio.
   - Etapa 3: Compartir un método en el prototipo (`Personaje.prototype.mostrarEstado`).
   - Etapa 4: Comprobar métodos compartidos mediante igualdad estricta (`guerrero.mostrarEstado === maga.mostrarEstado`).
   - Etapa 5: Nuevas habilidades en el prototipo: `recibirDanyo(cantidad)` y `curar(cantidad)`.
   - Etapa 6: Herencia prototípica entre constructores con `Personaje.call(this, ...)` y `Object.create(Personaje.prototype)` (`Guerrero`).
   - Etapa 7: Especialización y métodos exclusivos del subtipo (`Guerrero.prototype.defender`).
   - Etapa 8: Desafío autónomo de herencia prototípica con constructor base `Aventurero` y subtipo `Mago(nombre, vida, mana)` con `lanzarHechizo()`.


