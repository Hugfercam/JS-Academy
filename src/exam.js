const check=(description,code)=>({description,code});
export const libraryExam = {
  id:'sim-biblioteca',title:'Gestor de Biblioteca',duration:'60–90 minutos',source:'Examen_repaso_DWEC_Gestor_Biblioteca.pdf',
  description:'Construye la lógica de una biblioteca personal en un único archivo biblioteca.js. No necesitas HTML ni CSS. Puedes consultar tus apuntes.',
  adaptations:[
    'El PDF no especifica todos los retornos ni todos los tipos aceptados: no se puntúan retornos de borrarLibro, actualizarPaginas, actualizarFecha o los métodos de géneros.',
    'Para páginas, se comprueban números positivos, 0 y negativos. No se exige aceptar ni rechazar cadenas numéricas. Las fechas comprobadas son cadenas ISO válidas o claramente inválidas; se espera un timestamp.',
    'Los géneros se comparan como cadenas exactas, sin normalizar mayúsculas ni espacios. Se conserva el orden de los que permanecen.',
    'No se exige impedir que el límite baje de la cantidad almacenada: el PDF solo pide un entero positivo. librosDisponibles devuelve la diferencia literal, que puede ser negativa.',
    'La puntuación automática divide el peso de cada ejercicio entre sus comprobaciones. No sustituye la revisión del razonamiento y la claridad del código. Cada comprobación vuelve a ejecutar tu archivo desde cero.'
  ],
  starter:`// REPASO DWEC · Gestor de biblioteca personal
// Completa cada apartado. El código se comparte entre los 10 ejercicios.

// 1. Declara libros, idLibro y limiteLibros con sus valores iniciales.

function actualizarLimite(nuevoLimite) {
}

function mostrarLimite() {
}

function CrearLibro(titulo, autor, paginas, fecha, ...generos) {
}

CrearLibro.prototype.mostrarLibro = function() {
};
CrearLibro.prototype.actualizarPaginas = function(nuevasPaginas) {
};
CrearLibro.prototype.actualizarFecha = function(nuevaFecha) {
};
CrearLibro.prototype.anyadirGeneros = function(...nuevosGeneros) {
};
CrearLibro.prototype.borrarGeneros = function(...generosBorrar) {
};

function listarLibros() {
}
function anyadirLibro(libro) {
}
function borrarLibro(id) {
}
function calcularTotalPaginas() {
}
function calcularMediaPaginas() {
}
function librosDisponibles() {
}
`,
  tasks:[
    {id:1,title:'Variables globales',points:0.5,page:1,prompt:'Declara libros como array vacío, idLibro con valor 0 y limiteLibros con valor 20.',hint:'Deben estar disponibles para las funciones del archivo. El contador y el límite cambiarán.',checks:[
      check('Estado inicial del array y contadores','return Array.isArray(libros) && libros.length === 0 && idLibro === 0 && limiteLibros === 20;')
    ]},
    {id:2,title:'actualizarLimite(nuevoLimite)',points:1,page:1,prompt:'Actualiza el límite solo si recibe un número entero mayor que cero. Devuelve el nuevo límite si es válido; si no, conserva el anterior y devuelve -1.',hint:'No basta con comprobar > 0: hay que descartar decimales, strings y otros tipos.',checks:[
      check('Acepta enteros positivos','return actualizarLimite(35) === 35 && limiteLibros === 35;'),
      check('Rechaza cero y conserva el estado','const previo=limiteLibros; return actualizarLimite(0) === -1 && limiteLibros === previo;'),
      check('Rechaza negativos, decimales y entradas no numéricas','for(const valor of [-1,2.5,"30",null,undefined,NaN,Infinity]) { const previo=limiteLibros; if(actualizarLimite(valor)!==-1 || limiteLibros!==previo) return false; } return true;')
    ]},
    {id:3,title:'mostrarLimite()',points:0.5,page:1,prompt:'Devuelve exactamente: El límite actual de la biblioteca es de 20 libros. Sustituye 20 por el límite vigente; no añadas un punto final.',hint:'Una plantilla literal permite insertar limiteLibros en el texto.',checks:[
      check('Texto exacto con el límite inicial','return mostrarLimite() === "El límite actual de la biblioteca es de 20 libros";'),
      check('Usa el límite actual, sin fijar 20','limiteLibros=7; return mostrarLimite() === "El límite actual de la biblioteca es de 7 libros";')
    ]},
    {id:4,title:'Constructor CrearLibro',points:1,page:1,prompt:'Crea CrearLibro(titulo, autor, paginas, fecha, ...generos). Guarda titulo y autor; paginas como número positivo o 0 si no es válido; fecha como timestamp o fecha actual si es inválida u omitida. Inicializa generos y añádelos mediante anyadirGeneros.',hint:'Usa this para las propiedades de la instancia y el método del prototipo para incorporar los géneros.',checks:[
      check('Construye las propiedades y convierte una fecha válida a timestamp','const b=new CrearLibro("El principito","Antoine de Saint-Exupéry",96,"2026-10-15"); return b.titulo==="El principito" && b.autor==="Antoine de Saint-Exupéry" && b.paginas===96 && b.fecha===Date.parse("2026-10-15") && Array.isArray(b.generos);'),
      check('Páginas inválidas se guardan como 0','return [0,-4,NaN,Infinity].every(p=>new CrearLibro("A","B",p,"2026-10-15").paginas===0);'),
      check('Fecha inválida u omitida usa la fecha actual','const inicio=Date.now(); const a=new CrearLibro("A","B",10,"fecha-invalida"); const b=new CrearLibro("A","B",10); const fin=Date.now(); return [a.fecha,b.fecha].every(f=>typeof f==="number" && f>=inicio && f<=fin);'),
      check('Incorpora géneros mediante el método, sin duplicarlos','const original=CrearLibro.prototype.anyadirGeneros; let llamadas=0; CrearLibro.prototype.anyadirGeneros=function(...g){llamadas++; return original.apply(this,g);}; const b=new CrearLibro("A","B",10,"2026-10-15","Ficción","Ficción","Clásicos"); return llamadas>0 && JSON.stringify(b.generos)===JSON.stringify(["Ficción","Clásicos"]);')
    ]},
    {id:5,title:'Métodos del libro',points:1,page:2,prompt:'Implementa en CrearLibro.prototype mostrarLibro(), actualizarPaginas(nuevasPaginas) y actualizarFecha(nuevaFecha). Texto exacto: Libro: El principito - Autor: Antoine de Saint-Exupéry - Páginas: 96. Las actualizaciones inválidas conservan el dato anterior.',hint:'En cada método this representa el libro que recibe la llamada. Valida antes de asignar.',checks:[
      check('mostrarLibro vive en el prototipo y devuelve el texto exacto','const p=CrearLibro.prototype; const b=Object.assign(Object.create(p),{titulo:"El principito",autor:"Antoine de Saint-Exupéry",paginas:96}); return Object.hasOwn(p,"mostrarLibro") && b.mostrarLibro()==="Libro: El principito - Autor: Antoine de Saint-Exupéry - Páginas: 96";'),
      check('Actualiza páginas válidas y conserva las anteriores ante datos inválidos','const p=CrearLibro.prototype; const b=Object.assign(Object.create(p),{paginas:96}); b.actualizarPaginas(120); if(b.paginas!==120 || !Object.hasOwn(p,"actualizarPaginas")) return false; for(const x of [0,-2,NaN,Infinity]) { b.actualizarPaginas(x); if(b.paginas!==120) return false; } return true;'),
      check('Actualiza fecha válida y conserva la anterior si no es válida','const p=CrearLibro.prototype; const b=Object.assign(Object.create(p),{fecha:Date.parse("2026-10-15")}); b.actualizarFecha("2026-11-03"); if(b.fecha!==Date.parse("2026-11-03") || !Object.hasOwn(p,"actualizarFecha")) return false; b.actualizarFecha("fecha-invalida"); return b.fecha===Date.parse("2026-11-03");')
    ]},
    {id:6,title:'Añadir y borrar géneros',points:1,page:2,prompt:'Implementa anyadirGeneros(...nuevosGeneros) sin duplicados y borrarGeneros(...generosBorrar) para retirar uno o varios, conservando los demás.',hint:'includes ayuda a evitar duplicados; filter permite conservar los géneros no solicitados para borrar.',checks:[
      check('Añade varios géneros sin duplicados','const p=CrearLibro.prototype; const b=Object.assign(Object.create(p),{generos:["Ficción"]}); b.anyadirGeneros("Clásicos","Ficción","Clásicos"); return Object.hasOwn(p,"anyadirGeneros") && JSON.stringify(b.generos)===JSON.stringify(["Ficción","Clásicos"]);'),
      check('Borra varios, ignora ausentes y conserva los restantes','const p=CrearLibro.prototype; const b=Object.assign(Object.create(p),{generos:["A","B","C","D"]}); b.borrarGeneros("B","D","No existe"); return Object.hasOwn(p,"borrarGeneros") && JSON.stringify(b.generos)===JSON.stringify(["A","C"]);'),
      check('Sin argumentos no cambia los géneros','const b=Object.assign(Object.create(CrearLibro.prototype),{generos:["A"]}); b.anyadirGeneros("B"); b.anyadirGeneros(); b.borrarGeneros("A"); b.borrarGeneros(); return JSON.stringify(b.generos)===JSON.stringify(["B"]);')
    ]},
    {id:7,title:'Listar y añadir libros',points:1,page:2,prompt:'listarLibros() devuelve el array global. anyadirLibro(libro) añade al final si cabe, asigna el id actual e incrementa el contador. Devuelve true al añadir y false si no cabe; en ese caso no modifica el contador.',hint:'Comprueba la capacidad antes de asignar el id o incrementar el contador.',checks:[
      check('listarLibros devuelve el propio array global','return listarLibros() === libros;'),
      check('Asigna IDs consecutivos y añade al final','const a={titulo:"A"}, b={titulo:"B"}; return anyadirLibro(a)===true && anyadirLibro(b)===true && a.id===0 && b.id===1 && idLibro===2 && libros.length===2 && libros[0]===a && libros[1]===b;'),
      check('Al alcanzar el límite no cambia ni el array ni el contador','limiteLibros=1; const a={titulo:"A"}, b={titulo:"B"}; anyadirLibro(a); const contador=idLibro; return anyadirLibro(b)===false && idLibro===contador && libros.length===1 && !Object.hasOwn(b,"id");')
    ]},
    {id:8,title:'borrarLibro(id)',points:1,page:2,prompt:'Elimina solo el libro cuyo identificador coincide. Si no existe, conserva el array. No reduzcas ni reutilices idLibro.',hint:'El identificador no tiene por qué coincidir con la posición del libro dentro del array.',checks:[
      check('Elimina por id conservando el resto y el contador','libros=[{id:2},{id:7},{id:9}]; idLibro=10; borrarLibro(7); return JSON.stringify(libros)===JSON.stringify([{id:2},{id:9}]) && idLibro===10;'),
      check('Un identificador inexistente no elimina nada','libros=[{id:0},{id:1}]; idLibro=2; borrarLibro(99); return libros.length===2 && libros[0].id===0 && libros[1].id===1 && idLibro===2;'),
      check('Los IDs eliminados no se reutilizan','anyadirLibro({titulo:"A"}); anyadirLibro({titulo:"B"}); borrarLibro(0); const c={titulo:"C"}; anyadirLibro(c); return c.id===2 && idLibro===3;')
    ]},
    {id:9,title:'calcularTotalPaginas()',points:1,page:2,prompt:'Devuelve la suma de las páginas de todos los libros. Si el array está vacío, devuelve 0.',hint:'Recorre libros y acumula la propiedad paginas. Piensa en el valor inicial de la suma.',checks:[
      check('Array vacío devuelve 0','return calcularTotalPaginas()===0;'),
      check('Suma páginas incluyendo libros con 0','libros=[{paginas:96},{paginas:120},{paginas:0}]; return calcularTotalPaginas()===216;')
    ]},
    {id:10,title:'Media y capacidad disponible',points:2,page:2,prompt:'calcularMediaPaginas() devuelve la media o 0 si no hay libros. librosDisponibles() devuelve limiteLibros menos la cantidad de libros almacenados.',hint:'Evita dividir por cero. La cantidad de libros es libros.length, no idLibro.',checks:[
      check('Media con biblioteca vacía','return calcularMediaPaginas()===0;'),
      check('Media decimal correcta','libros=[{paginas:10},{paginas:15}]; return calcularMediaPaginas()===12.5;'),
      check('Capacidad usa cantidad, no contador','libros=[{id:3},{id:8}]; idLibro=9; limiteLibros=20; return librosDisponibles()===18;'),
      check('Capacidad es la diferencia literal con el límite actual','libros=[{id:0},{id:1}]; limiteLibros=1; return librosDisponibles()===-1;')
    ]}
  ]
};
