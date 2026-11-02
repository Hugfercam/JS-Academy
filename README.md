# JS Academy

PWA local de estudio de JavaScript para DWEC. JavaScript moderno, Vite, CSS y contenido empaquetado, sin cuentas ni backend.

## Ejecutar

Requiere Node compatible con Vite 7 (20.19+ o 22.12+).

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

La PWA se genera al compilar. El servidor de desarrollo no verifica el uso offline. En producción necesita HTTPS (localhost sirve para las comprobaciones locales). No se ha publicado. El paquete para Cloudflare Pages y sus instrucciones están en [docs/despliegue.md](docs/despliegue.md).

## Incluido

- Inicio, 37 lecciones adaptadas de los cinco PDF con fuente y páginas, 60 preguntas con explicación, test de hasta 10 preguntas y repetición de fallos.
- Quince retos con referencias, borradores, pruebas de comportamiento en Worker y límite de dos segundos.
- Modalidad **Práctica Guiada** paso a paso:
  1. *Programación funcional* ("Filtrar y agrupar gastos", 17 etapas): filtrado y agrupación con `filter()` y `reduce()`, y desafío final integrador.
  2. *Objetos y prototipos A* ("La academia de aventureros: crea tus personajes", 8 etapas): objetos literales, el problema de repetir estructuras, constructor `Personaje`, enlace dinámico de `this`, instancias independientes con `new`, métodos propios en el constructor (`mostrarEstado`), modificación controlada de estado (`recibirDanyo`) y desafío autónomo de tienda (`Producto`).
  3. *Objetos y prototipos B* ("La academia de aventureros: habilidades compartidas", 8 etapas): duplicación de funciones en memoria, objeto `prototype` como manual compartido, traslado de `mostrarEstado` a prototipo, verificación de identidad de métodos (`===`), habilidades mutadoras (`recibirDanyo`, `curar`), herencia prototípica con `Object.create` y `call`, especialización con `defender` y armadura, y desafío autónomo de la orden de los magos.
  Todas con conceptos y analogías previas, pistas progresivas en 3 niveles, soluciones comentadas bajo petición, evaluación síncrona en Worker y persistencia offline.
- Editor compartido para móvil: botones de símbolos, sangrado y retorno automático, deshacer/rehacer, movimiento de cursor y ampliación; dependencias locales y funcionamiento offline.
- Tres pistas progresivas y solución comentada bajo petición para los 15 retos, las 33 etapas guiadas y los 10 apartados de Biblioteca. Pedir ayuda no resta puntos ni sustituye el borrador.
- Corrección de retos con llamada, tipo/valor esperado, tipo/valor obtenido y consola capturada. Orientaciones para errores de sintaxis, referencias, tipos, ausencia de retorno, NaN, promesas y mutación prohibida.
- Progreso local versionado, exportación e importación.
- Precaché del contenido, estilos y Worker; actualización solicitada por el usuario.
- Simulacro de Biblioteca basado en el examen original: diez ejercicios, diez puntos, código compartido, borrador, descarga del archivo y evaluación en Worker con límite de cuatro segundos. Tienda y Cineclub siguen pendientes.

El contenido se ha contrastado con los cinco PDF de `materiales/`. La cobertura y las adaptaciones de la rúbrica se documentan en [docs/contenido.md](docs/contenido.md). Los PDF originales no se incluyen en la compilación. Los retos admiten código síncrono; no DOM, prompt ni proyectos de varios archivos. El Worker evita bloquear la interfaz, pero no es una barrera de seguridad: usar únicamente código propio. Las ayudas y soluciones didácticas se empaquetan para funcionar offline y se revelan en la interfaz solo bajo petición. Las pruebas y soluciones de cualquier aplicación offline pueden inspeccionarse. Los diagnósticos son orientaciones basadas en resultados observados, no un análisis exhaustivo del código.

## Verificación en Android pendiente

1. Servir la compilación por HTTPS e instalar desde Chrome.
2. Abrir apuntes, test y código conectado. Esperar a que el Service Worker controle la página.
3. Cerrar, activar modo avión y abrir desde el icono. Completar test y reto.
4. Escribir `while (true) {}` en un reto: debe detenerse y permitir otro intento.
5. Cerrar y reabrir; comprobar borrador y progreso.
6. Verificar actualización de versión sin perder el borrador.

Incluye iconos PNG de 192 y 512 píxeles, con área segura para recorte maskable. Las comprobaciones locales no equivalen a una instalación validada en un teléfono real.

Para incorporar nuevos apuntes y mantener los progresos, consulta [docs/ampliar-temario.md](docs/ampliar-temario.md). Añadir contenido no requiere cambiar la clave de almacenamiento ni reinstalar la PWA.
