// Prácticas guiadas estructuradas para JS Academy.
// Cada etapa aporta un aprendizaje concreto y evalúa el comportamiento del código en un Worker aislado.

export const guidedPractices = [
  {
    id: 'gastos',
    title: 'Filtrar y agrupar gastos',
    description: 'Aprende a transformar, filtrar y resumir datos financieros reales utilizando filter() y reduce() paso a paso.',
    topicId: 'funcional',
    parts: [
      { id: 'A', title: 'Parte A · Filtrar gastos', stagesCount: 8 },
      { id: 'B', title: 'Parte B · Agrupar gastos', stagesCount: 8 },
      { id: 'C', title: 'Parte C · Desafío final', stagesCount: 1 }
    ],
    stages: [
      // ----------------------------------------------------------------------
      // PARTE A: FILTRAR GASTOS
      // ----------------------------------------------------------------------
      {
        id: 'g-a1',
        part: 'A',
        partTitle: 'Parte A · Filtrar gastos',
        number: 1,
        title: 'Comprender la estructura de filter()',
        concept: 'El método filter() recorre un array y comprueba cada elemento con una función callback llamada "predicado". Si el predicado devuelve true (o un valor truthy), el elemento se conserva en el nuevo array; si devuelve false, se descarta. filter() nunca modifica el array original.',
        prompt: 'Implementa esGastoGrande(gasto). Recibe un objeto gasto como { concepto: "Libro", importe: 65 } y devuelve true si su importe es mayor que 50, o false en caso contrario.',
        entrypoint: 'esGastoGrande',
        starter: 'function esGastoGrande(gasto) {\n  // Comprueba si el importe supera 50\n}',
        hints: [
          'Un predicado evalúa una condición y devuelve un valor booleano (true o false).',
          'Accede a la propiedad importe del objeto gasto con gasto.importe y compárala con 50.',
          'Puedes devolver directamente el resultado de la comparación: return gasto.importe > 50;'
        ],
        solution: 'function esGastoGrande(gasto) {\n  // Devuelve true solo si el importe es estrictamente mayor de 50\n  return gasto.importe > 50;\n}',
        explanation: 'En JavaScript, los operadores de comparación (> , < , ===) producen un booleano directamente. No hace falta usar if/else para retornar true o false.',
        review: 'Verifica si estás usando el operador > y accediendo a gasto.importe correctamente.',
        cases: [
          { args: [{ concepto: 'Cena', importe: 65 }], expected: true },
          { args: [{ concepto: 'Café', importe: 12 }], expected: false },
          { args: [{ concepto: 'Teclado', importe: 50 }], expected: false },
          { args: [{ concepto: 'Monitor', importe: 120 }], expected: true }
        ]
      },
      {
        id: 'g-a2',
        part: 'A',
        partTitle: 'Parte A · Filtrar gastos',
        number: 2,
        title: 'Filtrar gastos superiores a un importe mínimo',
        concept: 'Ahora aplicamos filter() sobre una colección de gastos. Al pasar una función flecha o callback a array.filter(gasto => condición), obtenemos un nuevo array con solo los elementos que cumplen dicha condición.',
        prompt: 'Implementa filtrarMinimo(gastos, min). Recibe un array de objetos gasto y un número min. Devuelve un nuevo array con todos los gastos cuyo importe sea mayor o igual a min. No modifiques el array original.',
        entrypoint: 'filtrarMinimo',
        starter: 'function filtrarMinimo(gastos, min) {\n  // Devuelve un nuevo array filtrado por importe mínimo\n}',
        hints: [
          'filter() crea un array nuevo; no necesitas declarar un bucle for manual.',
          'Dentro del callback de filter, compara el importe de cada gasto con min usando >=.',
          'Usa gastos.filter(g => g.importe >= min) y retorna el resultado.'
        ],
        solution: 'function filtrarMinimo(gastos, min) {\n  // Seleccionar gastos que alcancen o superen el mínimo\n  return gastos.filter(gasto => gasto.importe >= min);\n}',
        explanation: 'filter() evalúa la condición para cada objeto y conserva solo los que la satisfacen en un nuevo array sin mutar el original.',
        review: 'Recuerda usar >= para incluir gastos con importe exactamente igual a min.',
        cases: [
          {
            args: [
              [{ concepto: 'A', importe: 10 }, { concepto: 'B', importe: 25 }, { concepto: 'C', importe: 40 }],
              20
            ],
            expected: [{ concepto: 'B', importe: 25 }, { concepto: 'C', importe: 40 }],
            unchangedArgs: true
          },
          {
            args: [
              [{ concepto: 'Metro', importe: 2.5 }],
              10
            ],
            expected: [],
            unchangedArgs: true
          },
          {
            args: [[], 50],
            expected: [],
            unchangedArgs: true
          }
        ]
      },
      {
        id: 'g-a3',
        part: 'A',
        partTitle: 'Parte A · Filtrar gastos',
        number: 3,
        title: 'Filtrar gastos inferiores a un importe máximo',
        concept: 'De la misma forma que podemos filtrar un suelo o mínimo, podemos limitar el techo o importe máximo. Esto es habitual para separar microgastos o gastos cotidianos de desembolsos mayores.',
        prompt: 'Implementa filtrarMaximo(gastos, max). Devuelve un nuevo array con los gastos cuyo importe sea menor o igual a max. No modifiques el array original.',
        entrypoint: 'filtrarMaximo',
        starter: 'function filtrarMaximo(gastos, max) {\n  // Tu solución\n}',
        hints: [
          'Utiliza filter() con una condición de comparación menor o igual (<=).',
          'El callback recibe cada gasto y comprueba gasto.importe <= max.',
          'Escribe: return gastos.filter(g => g.importe <= max);'
        ],
        solution: 'function filtrarMaximo(gastos, max) {\n  // Filtrar elementos que no sobrepasen el importe máximo\n  return gastos.filter(g => g.importe <= max);\n}',
        explanation: 'El predicado g.importe <= max descarta automáticamente cualquier gasto que supere la cantidad indicada.',
        review: 'Comprueba el operador <= y que no modifiques el array recibido.',
        cases: [
          {
            args: [
              [{ concepto: 'Café', importe: 1.8 }, { concepto: 'Libro', importe: 22 }, { concepto: 'Cena', importe: 45 }],
              25
            ],
            expected: [{ concepto: 'Café', importe: 1.8 }, { concepto: 'Libro', importe: 22 }],
            unchangedArgs: true
          },
          {
            args: [[{ concepto: 'Viaje', importe: 300 }], 50],
            expected: [],
            unchangedArgs: true
          }
        ]
      },
      {
        id: 'g-a4',
        part: 'A',
        partTitle: 'Parte A · Filtrar gastos',
        number: 4,
        title: 'Combinar condiciones con operadores lógicos',
        concept: 'Para filtrar dentro de un rango (por ejemplo, entre 10 € y 50 €), unimos dos expresiones booleanas mediante el operador lógico AND (&&). Ambas deben ser verdaderas a la vez para que el elemento se conserve.',
        prompt: 'Implementa filtrarRango(gastos, min, max). Devuelve los gastos cuyo importe esté entre min y max (ambos inclusive). Si min > max, devuelve un array vacío [].',
        entrypoint: 'filtrarRango',
        starter: 'function filtrarRango(gastos, min, max) {\n  // Comprueba el rango y filtra con &&\n}',
        hints: [
          'Puedes verificar primero si min > max; si es así, retorna [] de inmediato.',
          'En el callback de filter, une las dos condiciones: g.importe >= min && g.importe <= max.',
          'return min > max ? [] : gastos.filter(g => g.importe >= min && g.importe <= max);'
        ],
        solution: 'function filtrarRango(gastos, min, max) {\n  if (min > max) return [];\n  return gastos.filter(g => g.importe >= min && g.importe <= max);\n}',
        explanation: 'El operador && exige que se cumplan las dos condiciones a la vez. Validar min > max evita comprobaciones innecesarias.',
        review: 'Asegúrate de comprobar ambos extremos inclusivos (>= y <=).',
        cases: [
          {
            args: [
              [{ concepto: 'A', importe: 5 }, { concepto: 'B', importe: 15 }, { concepto: 'C', importe: 35 }, { concepto: 'D', importe: 80 }],
              10,
              40
            ],
            expected: [{ concepto: 'B', importe: 15 }, { concepto: 'C', importe: 35 }],
            unchangedArgs: true
          },
          {
            args: [[{ concepto: 'A', importe: 20 }], 50, 10],
            expected: [],
            unchangedArgs: true
          }
        ]
      },
      {
        id: 'g-a5',
        part: 'A',
        partTitle: 'Parte A · Filtrar gastos',
        number: 5,
        title: 'Filtrar gastos por fecha',
        concept: 'Las fechas en formato ISO (por ejemplo "2026-03-15") tienen la ventaja de que su orden cronológico coincide con su orden alfabético. También podemos comprobar el año usando startsWith() o comparando cadenas directamente.',
        prompt: 'Implementa filtrarPorAnyo(gastos, anyo). Cada gasto tiene { concepto, importe, fecha: "YYYY-MM-DD" }. Devuelve un nuevo array con los gastos que correspondan exactamente al año indicado (ej: "2026").',
        entrypoint: 'filtrarPorAnyo',
        starter: 'function filtrarPorAnyo(gastos, anyo) {\n  // Filtra los gastos según su año en la fecha ISO\n}',
        hints: [
          'La propiedad fecha es un string como "2026-04-12".',
          'Puedes usar el método g.fecha.startsWith(String(anyo)) para ver si empieza por ese año.',
          'También puedes comparar los primeros cuatro caracteres: g.fecha.slice(0, 4) === String(anyo).'
        ],
        solution: 'function filtrarPorAnyo(gastos, anyo) {\n  const prefijo = String(anyo);\n  return gastos.filter(g => g.fecha && g.fecha.startsWith(prefijo));\n}',
        explanation: 'startsWith() verifica si la cadena de texto comienza con el año buscado. Convertir anyo a String asegura compatibilidad si se pasa como número.',
        review: 'Comprueba que no se muten los gastos y que se devuelva un array vacío si ninguno coincide.',
        cases: [
          {
            args: [
              [{ concepto: 'Libro', importe: 20, fecha: '2025-11-04' }, { concepto: 'Curso', importe: 90, fecha: '2026-02-10' }, { concepto: 'Teclado', importe: 45, fecha: '2026-05-18' }],
              '2026'
            ],
            expected: [{ concepto: 'Curso', importe: 90, fecha: '2026-02-10' }, { concepto: 'Teclado', importe: 45, fecha: '2026-05-18' }],
            unchangedArgs: true
          },
          {
            args: [
              [{ concepto: 'Hotel', importe: 120, fecha: '2024-08-12' }],
              '2026'
            ],
            expected: [],
            unchangedArgs: true
          }
        ]
      },
      {
        id: 'g-a6',
        part: 'A',
        partTitle: 'Parte A · Filtrar gastos',
        number: 6,
        title: 'Búsqueda de texto insensible a mayúsculas',
        concept: 'Para buscar texto sin importar si el usuario escribió "Café", "café" o "CAFÉ", normalizamos ambas cadenas pasándolas a minúsculas con toLowerCase() antes de comprobar con includes().',
        prompt: 'Implementa buscarPorTexto(gastos, texto). Devuelve los gastos cuyo concepto contenga la subcadena texto, sin distinguir mayúsculas ni minúsculas. Si texto es una cadena vacía "", devuelve todos los gastos.',
        entrypoint: 'buscarPorTexto',
        starter: 'function buscarPorTexto(gastos, texto) {\n  // Normaliza con toLowerCase() y busca con includes()\n}',
        hints: [
          'Convierte texto a minúsculas una sola vez antes de filtrar: const query = texto.toLowerCase();',
          'En cada elemento, convierte g.concepto a minúsculas y usa includes(query).',
          'return gastos.filter(g => g.concepto.toLowerCase().includes(query));'
        ],
        solution: 'function buscarPorTexto(gastos, texto) {\n  const termino = String(texto).toLowerCase();\n  return gastos.filter(g => g.concepto.toLowerCase().includes(termino));\n}',
        explanation: 'Al convertir tanto el concepto como el término de búsqueda a minúsculas con toLowerCase(), includes() encuentra coincidencias independientemente de cómo se hayan escrito.',
        review: 'Prueba con mayúsculas y minúsculas mixtas como "cAfE" buscando en "Cafetería".',
        cases: [
          {
            args: [
              [{ concepto: 'Café matutino', importe: 1.5 }, { concepto: 'Compra supermercado', importe: 45 }, { concepto: 'Cápsulas café', importe: 6 }],
              'café'
            ],
            expected: [{ concepto: 'Café matutino', importe: 1.5 }, { concepto: 'Cápsulas café', importe: 6 }],
            unchangedArgs: true
          },
          {
            args: [
              [{ concepto: 'Gasolina', importe: 60 }],
              'hotel'
            ],
            expected: [],
            unchangedArgs: true
          },
          {
            args: [
              [{ concepto: 'A', importe: 1 }, { concepto: 'B', importe: 2 }],
              ''
            ],
            expected: [{ concepto: 'A', importe: 1 }, { concepto: 'B', importe: 2 }],
            unchangedArgs: true
          }
        ]
      },
      {
        id: 'g-a7',
        part: 'A',
        partTitle: 'Parte A · Filtrar gastos',
        number: 7,
        title: 'Filtrar por etiquetas permitidas',
        concept: 'Cada gasto puede tener un array de etiquetas ({ etiquetas: ["ocio", "viajes"] }). Para saber si el gasto tiene alguna etiqueta de una lista permitida, usamos el método some() combinado con includes().',
        prompt: 'Implementa filtrarPorEtiquetas(gastos, permitidas). Devuelve los gastos que tengan al menos una etiqueta incluida en el array permitidas. Si permitidas está vacío, devuelve un array vacío [].',
        entrypoint: 'filtrarPorEtiquetas',
        starter: 'function filtrarPorEtiquetas(gastos, permitidas) {\n  // Comprueba si alguna etiqueta del gasto está en permitidas\n}',
        hints: [
          'Si permitidas.length === 0, puedes retornar [] de inmediato.',
          'gasto.etiquetas.some(etiqueta => permitidas.includes(etiqueta)) comprueba si al menos una etiqueta coincide.',
          'Combina filter() en gastos con some() en etiquetas.'
        ],
        solution: 'function filtrarPorEtiquetas(gastos, permitidas) {\n  if (!permitidas || permitidas.length === 0) return [];\n  return gastos.filter(g => Array.isArray(g.etiquetas) && g.etiquetas.some(e => permitidas.includes(e)));\n}',
        explanation: 'some() devuelve true en cuanto encuentra el primer elemento que satisface la condición, deteniendo la búsqueda y resultando muy eficiente.',
        review: 'Asegúrate de comprobar qué ocurre si permitidas está vacío.',
        cases: [
          {
            args: [
              [{ concepto: 'Cine', importe: 9, etiquetas: ['ocio', 'cultura'] }, { concepto: 'Metro', importe: 2, etiquetas: ['transporte'] }, { concepto: 'Libro', importe: 18, etiquetas: ['cultura', 'estudio'] }],
              ['ocio', 'transporte']
            ],
            expected: [{ concepto: 'Cine', importe: 9, etiquetas: ['ocio', 'cultura'] }, { concepto: 'Metro', importe: 2, etiquetas: ['transporte'] }],
            unchangedArgs: true
          },
          {
            args: [
              [{ concepto: 'Cena', importe: 30, etiquetas: ['restaurante'] }],
              []
            ],
            expected: [],
            unchangedArgs: true
          }
        ]
      },
      {
        id: 'g-a8',
        part: 'A',
        partTitle: 'Parte A · Filtrar gastos',
        number: 8,
        title: 'Construir una función completa con criterios opcionales',
        concept: 'Llegamos a la culminación de la Parte A: construir un motor de filtrado flexible. El usuario puede pasar un objeto de criterios donde cada filtro es opcional (min, max, texto, categoria).',
        prompt: 'Implementa filtrarGastos(gastos, criterios = {}). Aplica solo los criterios definidos:\n- criterios.min: gasto.importe >= min\n- criterios.max: gasto.importe <= max\n- criterios.texto: concepto contiene el texto (insensible a mayúsculas)\n- criterios.categoria: gasto.categoria === categoria exactamente.\nSi no se pasa ningún criterio o está vacío, devuelve todos los gastos.',
        entrypoint: 'filtrarGastos',
        starter: 'function filtrarGastos(gastos, criterios = {}) {\n  // Aplica de forma combinada los criterios opcionales\n}',
        hints: [
          'En el callback de filter, comprueba si cada criterio existe antes de aplicarlo.',
          'Por ejemplo: if (criterios.min !== undefined && g.importe < criterios.min) return false;',
          'Si pasa todas las comprobaciones activas, retorna true al final del callback.'
        ],
        solution: 'function filtrarGastos(gastos, criterios = {}) {\n  const texto = criterios.texto ? String(criterios.texto).toLowerCase() : null;\n  return gastos.filter(g => {\n    if (criterios.min !== undefined && g.importe < criterios.min) return false;\n    if (criterios.max !== undefined && g.importe > criterios.max) return false;\n    if (criterios.categoria !== undefined && g.categoria !== criterios.categoria) return false;\n    if (texto && !g.concepto.toLowerCase().includes(texto)) return false;\n    return true;\n  });\n}',
        explanation: 'Descartar con return false en cuanto falla cualquier criterio activo simplifica la lógica y hace el código muy legible y extensible.',
        review: 'Comprueba el caso donde criterios está vacío {} y debe devolver todos los gastos.',
        cases: [
          {
            args: [
              [
                { concepto: 'Cena pizza', importe: 22, categoria: 'comida' },
                { concepto: 'Compra súper', importe: 65, categoria: 'comida' },
                { concepto: 'Gasolina viaje', importe: 70, categoria: 'transporte' },
                { concepto: 'Billete tren', importe: 15, categoria: 'transporte' }
              ],
              { min: 20, categoria: 'comida' }
            ],
            expected: [
              { concepto: 'Cena pizza', importe: 22, categoria: 'comida' },
              { concepto: 'Compra súper', importe: 65, categoria: 'comida' }
            ],
            unchangedArgs: true
          },
          {
            args: [
              [{ concepto: 'Hotel', importe: 120, categoria: 'viajes' }],
              { max: 100 }
            ],
            expected: [],
            unchangedArgs: true
          },
          {
            args: [
              [{ concepto: 'Teclado', importe: 40, categoria: 'oficina' }],
              {}
            ],
            expected: [{ concepto: 'Teclado', importe: 40, categoria: 'oficina' }],
            unchangedArgs: true
          }
        ]
      },

      // ----------------------------------------------------------------------
      // PARTE B: AGRUPAR GASTOS
      // ----------------------------------------------------------------------
      {
        id: 'g-b1',
        part: 'B',
        partTitle: 'Parte B · Agrupar gastos',
        number: 9,
        title: 'Comprender el acumulador en reduce()',
        concept: 'reduce() es como una cadena de relevos o una hucha: recibe una función callback y un valor inicial. El callback toma dos parámetros clave: el acumulador (lo que llevamos guardado hasta el momento) y el elemento actual. ¡Regla de oro: el callback SIEMPRE debe devolver el nuevo acumulador!',
        prompt: 'Implementa contarElementos(array). Usa reduce() con valor inicial 0 para contar cuántos elementos tiene el array, incrementando el acumulador en 1 por cada elemento.',
        entrypoint: 'contarElementos',
        starter: 'function contarElementos(array) {\n  // Cuenta elementos usando reduce con acumulador inicial 0\n}',
        hints: [
          'La estructura general es array.reduce((acc, elem) => nuevoAcc, 0);',
          'Por cada elemento recibido, debes sumar 1 a acc y devolverlo: return acc + 1;',
          'El segundo argumento de reduce debe ser 0.'
        ],
        solution: 'function contarElementos(array) {\n  // Acumular 1 por cada elemento del array\n  return array.reduce((acc) => acc + 1, 0);\n}',
        explanation: 'En cada paso sumamos 1 al valor anterior del acumulador. Si el array está vacío, reduce devuelve el valor inicial (0).',
        review: 'Comprueba que especificas el 0 como segundo argumento de reduce.',
        cases: [
          { args: [['a', 'b', 'c']], expected: 3 },
          { args: [[]], expected: 0 },
          { args: [[10, 20, 30, 40, 50]], expected: 5 }
        ]
      },
      {
        id: 'g-b2',
        part: 'B',
        partTitle: 'Parte B · Agrupar gastos',
        number: 10,
        title: 'Sumar valores con un acumulador numérico',
        concept: 'El uso más frecuente de reduce con números es calcular sumas totales. En lugar de sumar 1, sumamos la propiedad importe de cada gasto al acumulador en cada vuelta.',
        prompt: 'Implementa sumarTotal(gastos). Recibe un array de gastos { concepto, importe } y devuelve la suma total de todos los importes. Si el array está vacío, devuelve 0.',
        entrypoint: 'sumarTotal',
        starter: 'function sumarTotal(gastos) {\n  // Devuelve la suma acumulada de los importes\n}',
        hints: [
          'Inicia el acumulador en 0: gastos.reduce((total, gasto) => ..., 0);',
          'Dentro del callback, retorna total + gasto.importe;',
          'Asegúrate de no olvidar el 0 inicial.'
        ],
        solution: 'function sumarTotal(gastos) {\n  return gastos.reduce((total, gasto) => total + gasto.importe, 0);\n}',
        explanation: 'Al inicializar con 0, cubrimos correctamente tanto arrays con datos como arrays vacíos, sin provocar errores ni NaN.',
        review: 'Verifica que sumas gasto.importe y no el objeto gasto completo.',
        cases: [
          {
            args: [[{ concepto: 'Café', importe: 1.5 }, { concepto: 'Cena', importe: 28.5 }, { concepto: 'Bus', importe: 2 }]],
            expected: 32,
            unchangedArgs: true
          },
          {
            args: [[]],
            expected: 0,
            unchangedArgs: true
          }
        ]
      },
      {
        id: 'g-b3',
        part: 'B',
        partTitle: 'Parte B · Agrupar gastos',
        number: 11,
        title: 'Utilizar un objeto vacío como acumulador',
        concept: 'El acumulador de reduce() no tiene por qué ser un número. Si pasamos un objeto vacío {} como valor inicial, podemos ir construyendo un diccionario o mapa de datos a medida que recorremos la lista.',
        prompt: 'Implementa mapaConceptoImporte(gastos). Recibe gastos y devuelve un objeto donde cada clave es el concepto del gasto y su valor es el importe correspondiente. (Asume conceptos únicos).',
        entrypoint: 'mapaConceptoImporte',
        starter: 'function mapaConceptoImporte(gastos) {\n  // Inicia reduce con {} y añade cada par clave-valor al acumulador\n}',
        hints: [
          'Pasa {} como segundo argumento a reduce: gastos.reduce((acc, g) => { ... }, {});',
          'En el cuerpo: acc[g.concepto] = g.importe;',
          '¡Imprescindible!: termina el callback con return acc;'
        ],
        solution: 'function mapaConceptoImporte(gastos) {\n  return gastos.reduce((acc, gasto) => {\n    acc[gasto.concepto] = gasto.importe;\n    return acc;\n  }, {});\n}',
        explanation: 'Cada paso muta el objeto acumulador añadiéndole una propiedad y lo retorna para la siguiente iteración, entregando el objeto completo al final.',
        review: 'Si obtienes undefined o error, revisa si pusiste return acc al final del callback.',
        cases: [
          {
            args: [[{ concepto: 'Internet', importe: 35 }, { concepto: 'Luz', importe: 60 }]],
            expected: { Internet: 35, Luz: 60 },
            unchangedArgs: true
          },
          {
            args: [[]],
            expected: {},
            unchangedArgs: true
          }
        ]
      },
      {
        id: 'g-b4',
        part: 'B',
        partTitle: 'Parte B · Agrupar gastos',
        number: 12,
        title: 'Propiedades dinámicas con corchetes acc[clave]',
        concept: 'Cuando el nombre de la propiedad está guardado en una variable (como categoria = "ocio"), no podemos escribir acc.categoria porque buscaría literalmente la palabra "categoria". Debemos usar corchetes: acc[categoria].',
        prompt: 'Implementa contarPorCategoria(gastos). Recibe gastos con { concepto, categoria, importe } y devuelve un objeto donde cada clave es una categoría y su valor es cuántos gastos pertenecen a ella.',
        entrypoint: 'contarPorCategoria',
        starter: 'function contarPorCategoria(gastos) {\n  // Cuenta cuántos gastos hay de cada categoría\n}',
        hints: [
          'acc[gasto.categoria] accede a la cuenta actual de esa categoría.',
          'Si la categoría aún no existe en acc, su valor es undefined; puedes usar (acc[gasto.categoria] || 0) + 1.',
          'Recuerda devolver acc al final de cada iteración.'
        ],
        solution: 'function contarPorCategoria(gastos) {\n  return gastos.reduce((acc, gasto) => {\n    const cat = gasto.categoria;\n    acc[cat] = (acc[cat] || 0) + 1;\n    return acc;\n  }, {});\n}',
        explanation: 'El patrón acc[cat] = (acc[cat] || 0) + 1 usa el operador || como salvaguarda: si acc[cat] es undefined (falsy), toma 0 y le suma 1.',
        review: 'Comprueba qué devuelve con un array vacío (debe devolver {}).',
        cases: [
          {
            args: [
              [{ concepto: 'Pizza', categoria: 'comida' }, { concepto: 'Metro', categoria: 'transporte' }, { concepto: 'Tapa', categoria: 'comida' }]
            ],
            expected: { comida: 2, transporte: 1 },
            unchangedArgs: true
          },
          {
            args: [[]],
            expected: {},
            unchangedArgs: true
          }
        ]
      },
      {
        id: 'g-b5',
        part: 'B',
        partTitle: 'Parte B · Agrupar gastos',
        number: 13,
        title: 'Inicializar listas cuando el valor sea undefined',
        concept: 'Si queremos agrupar los objetos de gastos dentro de arrays por categoría ({ comida: [...], transporte: [...] }), el primer gasto de esa categoría debe crear el array vacío si aún no existe.',
        prompt: 'Implementa agruparPorCategoria(gastos). Devuelve un objeto donde cada clave es una categoría y su valor es un array con todos los gastos de esa categoría.',
        entrypoint: 'agruparPorCategoria',
        starter: 'function agruparPorCategoria(gastos) {\n  // Agrupa los objetos completos de gasto por categoría\n}',
        hints: [
          'Comprueba si existe la categoría: if (!acc[gasto.categoria]) acc[gasto.categoria] = [];',
          'Una vez garantizado el array, haz acc[gasto.categoria].push(gasto);',
          'No olvides hacer return acc al final del callback de reduce.'
        ],
        solution: 'function agruparPorCategoria(gastos) {\n  return gastos.reduce((acc, gasto) => {\n    const cat = gasto.categoria;\n    if (!acc[cat]) {\n      acc[cat] = [];\n    }\n    acc[cat].push(gasto);\n    return acc;\n  }, {});\n}',
        explanation: 'La comprobación inicial asegura que acc[cat] siempre sea un array antes de invocar push(), evitando errores de acceso a métodos en undefined.',
        review: 'Verifica que estás guardando el objeto gasto completo en la lista de su categoría.',
        cases: [
          {
            args: [
              [
                { concepto: 'A', categoria: 'ocio', importe: 10 },
                { concepto: 'B', categoria: 'hogar', importe: 20 },
                { concepto: 'C', categoria: 'ocio', importe: 30 }
              ]
            ],
            expected: {
              ocio: [{ concepto: 'A', categoria: 'ocio', importe: 10 }, { concepto: 'C', categoria: 'ocio', importe: 30 }],
              hogar: [{ concepto: 'B', categoria: 'hogar', importe: 20 }]
            },
            unchangedArgs: true
          },
          {
            args: [[]],
            expected: {},
            unchangedArgs: true
          }
        ]
      },
      {
        id: 'g-b6',
        part: 'B',
        partTitle: 'Parte B · Agrupar gastos',
        number: 14,
        title: 'Sumar importes de cada categoría',
        concept: 'Uniendo la acumulación por clave y la suma numérica, podemos calcular el gasto monetario total desglosado por categorías.',
        prompt: 'Implementa sumarPorCategoria(gastos). Devuelve un objeto donde cada clave es una categoría y su valor es la suma de los importes de los gastos de esa categoría.',
        entrypoint: 'sumarPorCategoria',
        starter: 'function sumarPorCategoria(gastos) {\n  // Acumula la suma del importe para cada categoría\n}',
        hints: [
          'Inicia con {} como acumulador de reduce.',
          'Para cada gasto, suma su importe a lo que ya hubiera acumulado: acc[cat] = (acc[cat] || 0) + gasto.importe;',
          'Devuelve siempre acc.'
        ],
        solution: 'function sumarPorCategoria(gastos) {\n  return gastos.reduce((acc, gasto) => {\n    const cat = gasto.categoria;\n    acc[cat] = (acc[cat] || 0) + gasto.importe;\n    return acc;\n  }, {});\n}',
        explanation: 'En una sola pasada por el array calculamos el total por departamento o categoría sin necesidad de filtros previos ni bucles anidados.',
        review: 'Comprueba que sumas gasto.importe y no 1.',
        cases: [
          {
            args: [
              [
                { concepto: 'Cena', categoria: 'comida', importe: 30 },
                { concepto: 'Autobús', categoria: 'transporte', importe: 5 },
                { concepto: 'Compra', categoria: 'comida', importe: 45 },
                { concepto: 'Tren', categoria: 'transporte', importe: 25 }
              ]
            ],
            expected: { comida: 75, transporte: 30 },
            unchangedArgs: true
          },
          {
            args: [[]],
            expected: {},
            unchangedArgs: true
          }
        ]
      },
      {
        id: 'g-b7',
        part: 'B',
        partTitle: 'Parte B · Agrupar gastos',
        number: 15,
        title: 'Agrupar gastos por mes (YYYY-MM)',
        concept: 'Dado que las fechas vienen en formato "YYYY-MM-DD", podemos extraer los primeros 7 caracteres con fecha.slice(0, 7) para obtener la clave del mes (ej: "2026-03").',
        prompt: 'Implementa totalPorMes(gastos). Recibe gastos con { importe, fecha: "YYYY-MM-DD" } y devuelve un objeto donde cada clave es el año-mes ("YYYY-MM") y su valor es la suma de importes de ese mes.',
        entrypoint: 'totalPorMes',
        starter: 'function totalPorMes(gastos) {\n  // Extrae YYYY-MM con slice(0, 7) y acumula el total\n}',
        hints: [
          'Extrae el mes de cada gasto: const mes = gasto.fecha.slice(0, 7);',
          'Suma al acumulador: acc[mes] = (acc[mes] || 0) + gasto.importe;',
          'Retorna acc en cada iteración de reduce.'
        ],
        solution: 'function totalPorMes(gastos) {\n  return gastos.reduce((acc, gasto) => {\n    const mes = gasto.fecha.slice(0, 7);\n    acc[mes] = (acc[mes] || 0) + gasto.importe;\n    return acc;\n  }, {});\n}',
        explanation: 'slice(0, 7) extrae limpiamente "YYYY-MM", permitiendo agrupar temporalmente datos en series mensuales de forma instantánea.',
        review: 'Verifica los índices de slice (0 a 7 devuelve 7 caracteres: 4 del año, guión y 2 del mes).',
        cases: [
          {
            args: [
              [
                { concepto: 'A', importe: 50, fecha: '2026-01-15' },
                { concepto: 'B', importe: 30, fecha: '2026-01-28' },
                { concepto: 'C', importe: 90, fecha: '2026-02-04' }
              ]
            ],
            expected: { '2026-01': 80, '2026-02': 90 },
            unchangedArgs: true
          },
          {
            args: [[]],
            expected: {},
            unchangedArgs: true
          }
        ]
      },
      {
        id: 'g-b8',
        part: 'B',
        partTitle: 'Parte B · Agrupar gastos',
        number: 16,
        title: 'Combinar filter() y reduce() en un informe',
        concept: 'En el desarrollo web profesional es habitual encadenar operaciones: primero filtramos los datos de interés y después los reducimos para obtener estadísticas agregadas.',
        prompt: 'Implementa informeCategoria(gastos, categoria). Filtra primero los gastos que pertenezcan a esa categoría y luego calcula y devuelve un objeto con:\n- total: suma de sus importes (0 si no hay)\n- cantidad: número de gastos (0 si no hay)\n- media: importe medio (0 si cantidad es 0).',
        entrypoint: 'informeCategoria',
        starter: 'function informeCategoria(gastos, categoria) {\n  // Filtra por categoría y calcula total, cantidad y media con reduce\n}',
        hints: [
          'Usa const filtrados = gastos.filter(g => g.categoria === categoria);',
          'Suma los importes con reduce en filtrados: const total = filtrados.reduce(...);',
          'Calcula cantidad = filtrados.length y media = cantidad > 0 ? total / cantidad : 0.'
        ],
        solution: 'function informeCategoria(gastos, categoria) {\n  const filtrados = gastos.filter(g => g.categoria === categoria);\n  const cantidad = filtrados.length;\n  const total = filtrados.reduce((acc, g) => acc + g.importe, 0);\n  const media = cantidad > 0 ? total / cantidad : 0;\n  return { total, cantidad, media };\n}',
        explanation: 'Combinar filter para acotar el universo de datos y reduce para consolidar el total es uno de los patrones más potentes y limpios de JavaScript funcional.',
        review: 'Ten cuidado con la división por cero cuando no haya gastos de esa categoría: la media debe ser 0.',
        cases: [
          {
            args: [
              [
                { concepto: 'Café', categoria: 'ocio', importe: 2 },
                { concepto: 'Cine', categoria: 'ocio', importe: 10 },
                { concepto: 'Luz', categoria: 'hogar', importe: 80 }
              ],
              'ocio'
            ],
            expected: { total: 12, cantidad: 2, media: 6 },
            unchangedArgs: true
          },
          {
            args: [
              [{ concepto: 'Luz', categoria: 'hogar', importe: 80 }],
              'viajes'
            ],
            expected: { total: 0, cantidad: 0, media: 0 },
            unchangedArgs: true
          }
        ]
      },

      // ----------------------------------------------------------------------
      // PARTE C: DESAFÍO FINAL
      // ----------------------------------------------------------------------
      {
        id: 'g-c1',
        part: 'C',
        partTitle: 'Parte C · Desafío final',
        number: 17,
        title: 'Desafío final · Gestor de pedidos online',
        concept: '¡Hora de demostrar todo lo aprendido! En este desafío final te enfrentas a un problema nuevo: gestionar pedidos de un comercio electrónico sin código predefinido en la plantilla.',
        prompt: 'Implementa procesarPedidos(pedidos, opciones = {}).\nCada pedido tiene la forma: { id: 1, cliente: "Ana", categoria: "tecnologia", total: 120, pagado: true }.\n\nEl objeto opciones puede incluir de forma optativa:\n- soloPagados: booleano (si es true, considera solo pedidos con pagado === true).\n- minImporte: número (considera solo pedidos con total >= minImporte).\n\nLa función debe devolver un objeto con:\n1. pedidosValidos: array con los pedidos que cumplen los filtros (sin modificar el original).\n2. totalFacturado: suma de los importes total de esos pedidos válidos.\n3. porCategoria: objeto con el total facturado desglosado por categoría ({ tecnologia: 120, libros: 40 }).',
        entrypoint: 'procesarPedidos',
        starter: 'function procesarPedidos(pedidos, opciones = {}) {\n  // Escribe tu solución completa aplicando filter y reduce\n}',
        hints: [
          'Paso 1: Filtra los pedidos según opciones.soloPagados y opciones.minImporte.',
          'Paso 2: Suma el totalFacturado recorriendo los pedidos filtrados con reduce.',
          'Paso 3: Construye el objeto porCategoria acumulando el total de cada categoría con reduce.'
        ],
        solution: 'function procesarPedidos(pedidos, opciones = {}) {\n  const pedidosValidos = pedidos.filter(p => {\n    if (opciones.soloPagados && !p.pagado) return false;\n    if (opciones.minImporte !== undefined && p.total < opciones.minImporte) return false;\n    return true;\n  });\n  const totalFacturado = pedidosValidos.reduce((sum, p) => sum + p.total, 0);\n  const porCategoria = pedidosValidos.reduce((acc, p) => {\n    acc[p.categoria] = (acc[p.categoria] || 0) + p.total;\n    return acc;\n  }, {});\n  return { pedidosValidos, totalFacturado, porCategoria };\n}',
        explanation: 'El reto integra filtrado multivariable, acumulación numérica y agregación dinámica por claves en un único pipeline funcional limpio y libre de efectos secundarios.',
        review: 'Comprueba el caso de array vacío o cuando ningún pedido cumple las condiciones (debe devolver { pedidosValidos: [], totalFacturado: 0, porCategoria: {} }).',
        cases: [
          {
            args: [
              [
                { id: 1, cliente: 'Ana', categoria: 'tecnologia', total: 150, pagado: true },
                { id: 2, cliente: 'Luis', categoria: 'libros', total: 30, pagado: true },
                { id: 3, cliente: 'Marta', categoria: 'tecnologia', total: 80, pagado: false },
                { id: 4, cliente: 'Carlos', categoria: 'libros', total: 25, pagado: true }
              ],
              { soloPagados: true, minImporte: 28 }
            ],
            expected: {
              pedidosValidos: [
                { id: 1, cliente: 'Ana', categoria: 'tecnologia', total: 150, pagado: true },
                { id: 2, cliente: 'Luis', categoria: 'libros', total: 30, pagado: true }
              ],
              totalFacturado: 180,
              porCategoria: { tecnologia: 150, libros: 30 }
            },
            unchangedArgs: true
          },
          {
            args: [
              [
                { id: 1, cliente: 'Eva', categoria: 'ropa', total: 45, pagado: false }
              ],
              { soloPagados: true }
            ],
            expected: {
              pedidosValidos: [],
              totalFacturado: 0,
              porCategoria: {}
            },
            unchangedArgs: true
          },
          {
            args: [
              [
                { id: 1, cliente: 'Pepe', categoria: 'hogar', total: 100, pagado: true }
              ],
              {}
            ],
            expected: {
              pedidosValidos: [
                { id: 1, cliente: 'Pepe', categoria: 'hogar', total: 100, pagado: true }
              ],
              totalFacturado: 100,
              porCategoria: { hogar: 100 }
            },
            unchangedArgs: true
          },
          {
            args: [[], { soloPagados: true }],
            expected: {
              pedidosValidos: [],
              totalFacturado: 0,
              porCategoria: {}
            },
            unchangedArgs: true
          }
        ]
      }
    ]
  },
  {
    id: 'aventureros-a',
    title: 'Práctica A — Crea tus propios objetos: La academia de aventureros',
    description: 'Aprende a construir múltiples objetos a partir de una función constructora, utilizando this y new para gestionar fichas de héroes.',
    topicId: 'objetos',
    summaryText: 'Has dominado las funciones constructoras, el enlace dinámico de this, la instanciación con new y la creación de métodos propios en objetos.',
    parts: [
      { id: 'A', title: 'Parte A · Objetos y constructores', stagesCount: 4 },
      { id: 'B', title: 'Parte B · Instancias y métodos propios', stagesCount: 3 },
      { id: 'C', title: 'Parte C · Desafío autónomo', stagesCount: 1 }
    ],
    stages: [
      {
        id: 'av-a1',
        part: 'A',
        partTitle: 'Parte A · Objetos y constructores',
        number: 1,
        title: 'Recordar los objetos literales',
        concept: 'En JavaScript, un objeto literal se define entre llaves {} agrupando pares de propiedad y valor.\n\nPor ejemplo, la ficha de un personaje aventurero puede almacenar su nombre, sus puntos de vida y su fuerza de ataque.\n\nPara leer o modificar los datos de un objeto utilizamos la notación de punto: personaje.nombre o personaje.vida.',
        prompt: 'Implementa la función crearPersonaje(nombre, vida, ataque). Debe devolver un objeto literal con tres propiedades: nombre (string), vida (número) y ataque (número).',
        entrypoint: 'crearPersonaje',
        starter: 'function crearPersonaje(nombre, vida, ataque) {\n  // Devuelve un objeto literal con nombre, vida y ataque\n}',
        hints: [
          'Un objeto literal se delimita con llaves { clave: valor }.',
          'Asigna a cada propiedad su argumento correspondiente: nombre: nombre, vida: vida, ataque: ataque.',
          'Puedes usar la notación abreviada de propiedades: return { nombre, vida, ataque };'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cuál de las siguientes implementaciones de crearPersonaje devuelve correctamente el objeto literal con las tres propiedades recibidas?",
                  "options": [
                            {
                                      "code": "function crearPersonaje(nombre, vida, ataque) {\n  nombre: nombre;\n  vida: vida;\n  ataque: ataque;\n}",
                                      "isCorrect": false,
                                      "explanation": "Escribe etiquetas de código dentro de la función en lugar de retornar un objeto literal delimitado por llaves { ... }. La función no tiene return y devuelve undefined."
                            },
                            {
                                      "code": "function crearPersonaje(nombre, vida, ataque) {\n  return {\n    nombre,\n    vida,\n    ataque\n  };\n}",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! Utiliza la notación abreviada de objetos literales { nombre, vida, ataque }, creando y retornando un nuevo objeto independiente con las tres propiedades y sus respectivos valores."
                            },
                            {
                                      "code": "function crearPersonaje(nombre, vida, ataque) {\n  return { nombre: \"nombre\", vida: 100, ataque: 20 };\n}",
                                      "isCorrect": false,
                                      "explanation": "Asigna valores literales fijos (\"nombre\", 100, 20) en lugar de utilizar las variables recibidas en los parámetros de la función."
                            }
                  ]
        },
        solution: 'function crearPersonaje(nombre, vida, ataque) {\n  // Retorna un objeto literal con las propiedades indicadas\n  return {\n    nombre,\n    vida,\n    ataque\n  };\n}',
        explanation: 'El objeto literal agrupa propiedades relacionadas en una única estructura accesible por punto (personaje.nombre). Cada objeto creado así es independiente en memoria.',
        review: 'Comprueba que el objeto retornado contenga exactamente las claves nombre, vida y ataque con sus respectivos valores.',
        cases: [
          { args: ['Arturo', 100, 20], expected: { nombre: 'Arturo', vida: 100, ataque: 20 } },
          { args: ['Elena', 80, 30], expected: { nombre: 'Elena', vida: 80, ataque: 30 } },
          { args: ['Valeria', 120, 25], expected: { nombre: 'Valeria', vida: 120, ataque: 25 } }
        ]
      },
      {
        id: 'av-a2',
        part: 'A',
        partTitle: 'Parte A · Objetos y constructores',
        number: 2,
        title: 'El problema de repetir objetos',
        concept: 'Imagina que necesitas crear un ejército de 100 soldados o los personajes de un juego de rol. Escribir a mano { nombre: ..., vida: ..., ataque: ... } cien veces es lento, repetitivo y propenso a cometer erratas (por ejemplo, escribir en uno "salud" en vez de "vida").\n\nPara comprobar si un objeto cumple una estructura, podemos verificar la presencia de sus claves. Pero en lugar de seguir escribiendo objetos a mano uno por uno, la solución idiomática en JavaScript es utilizar un molde centralizado: una función constructora.',
        prompt: 'Implementa la función validarEstructuraPersonaje(obj). Comprueba si el objeto recibido posee las tres propiedades requeridas: "nombre", "vida" y "ataque", devolviendo true si las tiene o false en caso contrario (o si obj no es un objeto válido).',
        entrypoint: 'validarEstructuraPersonaje',
        starter: 'function validarEstructuraPersonaje(obj) {\n  // Comprueba si obj contiene las propiedades "nombre", "vida" y "ataque"\n}',
        hints: [
          'Verifica primero que obj exista y sea un objeto (obj && typeof obj === "object").',
          'Puedes comprobar la existencia de propiedades con el operador in: "nombre" in obj.',
          'Escribe: return Boolean(obj && typeof obj === "object" && "nombre" in obj && "vida" in obj && "ataque" in obj);'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cuál de las siguientes funciones comprueba de forma segura y completa la presencia de las tres claves en el objeto?",
                  "options": [
                            {
                                      "code": "function validarEstructuraPersonaje(obj) {\n  return \"nombre\" in obj && \"vida\" in obj && \"ataque\" in obj;\n}",
                                      "isCorrect": false,
                                      "explanation": "Si obj es null, undefined o un tipo primitivo, el operador in lanzará un TypeError en tiempo de ejecución al no comprobar previamente que sea un objeto no nulo."
                            },
                            {
                                      "code": "function validarEstructuraPersonaje(obj) {\n  return Boolean(obj && obj.nombre && obj.vida && obj.ataque);\n}",
                                      "isCorrect": false,
                                      "explanation": "Comprueba el valor booleano (truthy) de cada propiedad en vez de verificar su existencia. Si un personaje tiene vida: 0 o ataque: 0, fallará devolviendo false porque 0 es falsy."
                            },
                            {
                                      "code": "function validarEstructuraPersonaje(obj) {\n  return Boolean(\n    obj &&\n    typeof obj === \"object\" &&\n    \"nombre\" in obj &&\n    \"vida\" in obj &&\n    \"ataque\" in obj\n  );\n}",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! Primero valida que obj sea un objeto no nulo y después comprueba la presencia de las tres propiedades requeridas mediante el operador in."
                            }
                  ]
        },
        solution: 'function validarEstructuraPersonaje(obj) {\n  // Valida que el objeto cumpla la estructura esperada de personaje\n  return Boolean(\n    obj &&\n    typeof obj === "object" &&\n    "nombre" in obj &&\n    "vida" in obj &&\n    "ataque" in obj\n  );\n}',
        explanation: 'Comprobar propiedades manualmente demuestra la fragilidad de fabricar objetos independientes a mano. Una función constructora garantiza que toda instancia nazca con la misma estructura.',
        review: 'Asegúrate de comprobar las 3 propiedades y controlar valores nulos o no objetos.',
        cases: [
          { args: [{ nombre: 'Arturo', vida: 100, ataque: 20 }], expected: true },
          { args: [{ nombre: 'Incompleto', vida: 50 }], expected: false },
          { args: [{ nombre: 'Errata', salud: 80, ataque: 15 }], expected: false },
          { args: [null], expected: false }
        ]
      },
      {
        id: 'av-a3',
        part: 'A',
        partTitle: 'Parte A · Objetos y constructores',
        number: 3,
        title: 'Crear una función constructora',
        concept: 'Una función constructora es una función diseñada para inicializar y dar forma a nuevos objetos siguiendo una estructura común.\n\nPor convención estándar en JavaScript, las funciones constructoras se nombran en PascalCase (primera letra en mayúscula: Personaje, no personaje). Esto avisa visualmente de que debe invocarse con la palabra reservada new.',
        prompt: 'Declara la función constructora Personaje(nombre, vida, ataque). Debe recibir estos tres parámetros e inicializar las propiedades correspondientes: this.nombre = nombre; this.vida = vida; this.ataque = ataque;.',
        entrypoint: 'Personaje',
        starter: 'function Personaje(nombre, vida, ataque) {\n  // Constructor: inicializa nombre, vida y ataque\n}',
        hints: [
          'Usa function Personaje(nombre, vida, ataque) con P mayúscula por convención.',
          'Dentro del constructor, asigna cada parámetro con this: this.nombre = nombre;',
          'Añade las 3 asignaciones: this.nombre = nombre; this.vida = vida; this.ataque = ataque;'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cuál de las siguientes es una función constructora canónica para Personaje?",
                  "options": [
                            {
                                      "code": "function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n}",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! Asigna cada argumento a la nueva instancia creada por new a través de this, respetando el contrato de una función constructora."
                            },
                            {
                                      "code": "function Personaje(nombre, vida, ataque) {\n  return { nombre, vida, ataque };\n}",
                                      "isCorrect": false,
                                      "explanation": "Devuelve un objeto literal explícito en lugar de inicializar la instancia this, desvinculando el objeto retornado del prototipo de Personaje (instancia instanceof Personaje fallará)."
                            },
                            {
                                      "code": "function Personaje(nombre, vida, ataque) {\n  let nombrePersonaje = nombre;\n  let vidaPersonaje = vida;\n  let ataquePersonaje = ataque;\n}",
                                      "isCorrect": false,
                                      "explanation": "Declara variables locales que se destruyen al finalizar la ejecución; no asigna nada a this, por lo que la nueva instancia queda como un objeto vacío {}."
                            }
                  ]
        },
        solution: 'function Personaje(nombre, vida, ataque) {\n  // Función constructora para inicializar personajes\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n}',
        explanation: 'La función constructora actúa como un molde oficial. Toda invocación con new creará un objeto garantizando que posea las propiedades nombre, vida y ataque.',
        review: 'Verifica que la función se llame Personaje y asigne los tres parámetros a this.',
        cases: [
          {
            args: [],
            description: 'new Personaje("Arturo", 100, 20)',
            eval: '(fn) => { const p = new fn("Arturo", 100, 20); return { nombre: p.nombre, vida: p.vida, ataque: p.ataque, esInstancia: p instanceof fn }; }',
            expected: { nombre: 'Arturo', vida: 100, ataque: 20, esInstancia: true }
          },
          {
            args: [],
            description: 'new Personaje("Elena", 80, 30)',
            eval: '(fn) => { const p = new fn("Elena", 80, 30); return { nombre: p.nombre, vida: p.vida, ataque: p.ataque, esInstancia: p instanceof fn }; }',
            expected: { nombre: 'Elena', vida: 80, ataque: 30, esInstancia: true }
          }
        ]
      },
      {
        id: 'av-a4',
        part: 'A',
        partTitle: 'Parte A · Objetos y constructores',
        number: 4,
        title: 'Comprender this',
        concept: '¿Qué representa this dentro de una función constructora?\n\nAnalogía: imagina que el constructor es una máquina de forja de medallas. Cada vez que entra un nuevo disco de metal en la máquina, la palabra this se refiere a este disco concreto que se está grabando en ese preciso instante.\n\nCuando llamamos a new Personaje(...):\n1. JavaScript crea un objeto vacío {} en memoria.\n2. Vincula this a ese nuevo objeto.\n3. Ejecuta el código del constructor agregando propiedades a this.\n4. Devuelve automáticamente ese nuevo objeto.',
        prompt: 'En el constructor Personaje(nombre, vida, ataque), asegura la asignación de this.nombre, this.vida y this.ataque. Además, añade la propiedad this.vidaMaxima = vida; para registrar la salud máxima con la que nace el personaje.',
        entrypoint: 'Personaje',
        starter: 'function Personaje(nombre, vida, ataque) {\n  // Asigna nombre, vida, ataque y vidaMaxima usando this\n}',
        hints: [
          'this hace referencia a la instancia que se está creando.',
          'Asigna a this.vidaMaxima el valor recibido en vida: this.vidaMaxima = vida;',
          'Escribe: this.nombre = nombre; this.vida = vida; this.ataque = ataque; this.vidaMaxima = vida;'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cómo debe asignarse vidaMaxima para conservar el valor inicial de salud en la instancia?",
                  "options": [
                            {
                                      "code": "function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n  let vidaMaxima = vida;\n}",
                                      "isCorrect": false,
                                      "explanation": "Declara vidaMaxima como variable local con let. No se asigna a this, por lo que la propiedad no existirá en el objeto creado (p.vidaMaxima será undefined)."
                            },
                            {
                                      "code": "function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n  this.vidaMaxima = vida;\n}",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! Asigna el valor del parámetro vida tanto a this.vida como a this.vidaMaxima, registrando la salud máxima con la que nace el aventurero."
                            },
                            {
                                      "code": "function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n  this.vidaMaxima = this.vidaMaxima;\n}",
                                      "isCorrect": false,
                                      "explanation": "Intenta asignar this.vidaMaxima a sí misma antes de definirla, guardando undefined en lugar de capturar el valor del parámetro vida."
                            }
                  ]
        },
        solution: 'function Personaje(nombre, vida, ataque) {\n  // Asignación de propiedades propias a la nueva instancia\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n  this.vidaMaxima = vida;\n}',
        explanation: 'this permite que el mismo código de inicialización se aplique a cualquier objeto nuevo sin saber de antemano el nombre de la variable donde se guardará.',
        review: 'Comprueba que this.vidaMaxima guarde el valor inicial de vida.',
        cases: [
          {
            args: [],
            description: 'new Personaje("Lancelot", 140, 22)',
            eval: '(fn) => { const p = new fn("Lancelot", 140, 22); return { nombre: p.nombre, vida: p.vida, ataque: p.ataque, vidaMaxima: p.vidaMaxima, propia: Object.hasOwn(p, "vidaMaxima") }; }',
            expected: { nombre: 'Lancelot', vida: 140, ataque: 22, vidaMaxima: 140, propia: true }
          },
          {
            args: [],
            description: 'new Personaje("Morgana", 90, 35)',
            eval: '(fn) => { const p = new fn("Morgana", 90, 35); return { nombre: p.nombre, vida: p.vida, vidaMaxima: p.vidaMaxima }; }',
            expected: { nombre: 'Morgana', vida: 90, vidaMaxima: 90 }
          }
        ]
      },
      {
        id: 'av-a5',
        part: 'B',
        partTitle: 'Parte B · Instancias y métodos propios',
        number: 5,
        title: 'Crear instancias mediante new',
        concept: 'La palabra reservada new es el disparador que ejecuta una función como constructora.\n\nCada objeto creado mediante new es una instancia independiente.\n\nSi creamos dos personajes (guerrero y maga) y luego modificamos guerrero.vida = 50, la salud de maga no cambia en absoluto porque cada una reside en su propia posición de memoria.',
        prompt: 'Manteniendo el constructor Personaje(nombre, vida, ataque), implementa la función crearParejaAventurera(). Debe instanciar y devolver un objeto { guerrero, maga } donde:\n- guerrero sea new Personaje("Arturo", 100, 20)\n- maga sea new Personaje("Elena", 80, 30)',
        entrypoint: 'crearParejaAventurera',
        starter: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n  this.vidaMaxima = vida;\n}\n\nfunction crearParejaAventurera() {\n  // Crea a Arturo y a Elena con new Personaje y devuelve { guerrero, maga }\n}',
        hints: [
          'Declara const guerrero = new Personaje("Arturo", 100, 20);',
          'Declara const maga = new Personaje("Elena", 80, 30);',
          'Retorna el objeto con ambas instancias: return { guerrero, maga };'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cómo debe implementarse crearParejaAventurera para producir dos instancias independientes?",
                  "options": [
                            {
                                      "code": "function crearParejaAventurera() {\n  const guerrero = Personaje(\"Arturo\", 100, 20);\n  const maga = Personaje(\"Elena\", 80, 30);\n  return { guerrero, maga };\n}",
                                      "isCorrect": false,
                                      "explanation": "Invoca a Personaje como función ordinaria sin el operador new. La función no retorna nada (undefined) y contamina el objeto global o falla en modo estricto."
                            },
                            {
                                      "code": "function crearParejaAventurera() {\n  const guerrero = new Personaje(\"Arturo\", 100, 20);\n  const maga = guerrero;\n  maga.nombre = \"Elena\";\n  maga.vida = 80;\n  maga.ataque = 30;\n  return { guerrero, maga };\n}",
                                      "isCorrect": false,
                                      "explanation": "maga = guerrero copia la referencia en memoria del mismo objeto. Al mutar las propiedades de maga, se muta también a guerrero, perdiendo la independencia de los dos personajes."
                            },
                            {
                                      "code": "function crearParejaAventurera() {\n  const guerrero = new Personaje(\"Arturo\", 100, 20);\n  const maga = new Personaje(\"Elena\", 80, 30);\n  return { guerrero, maga };\n}",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! Utiliza new para crear dos instancias separadas e independientes en memoria a partir del mismo molde constructor."
                            }
                  ]
        },
        solution: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n  this.vidaMaxima = vida;\n}\n\nfunction crearParejaAventurera() {\n  // Instanciación de personajes independientes\n  const guerrero = new Personaje("Arturo", 100, 20);\n  const maga = new Personaje("Elena", 80, 30);\n  return { guerrero, maga };\n}',
        explanation: 'guerrero y maga comparten el mismo molde pero tienen identidades e historias distintas: mutar una propiedad en uno no afecta al otro.',
        review: 'Comprueba que crearParejaAventurera devuelva las dos instancias con los nombres y estadísticas exactas.',
        cases: [
          {
            args: [],
            description: 'crearParejaAventurera() devuelve instancias independientes',
            eval: '(fn) => { const { guerrero, maga } = fn(); return { gNombre: guerrero.nombre, gVida: guerrero.vida, mNombre: maga.nombre, mVida: maga.vida, distintas: guerrero !== maga }; }',
            expected: { gNombre: 'Arturo', gVida: 100, mNombre: 'Elena', mVida: 80, distintas: true }
          },
          {
            args: [],
            description: 'Modificar los puntos de vida de guerrero no altera a maga',
            eval: '(fn) => { const { guerrero, maga } = fn(); guerrero.vida -= 40; return { gVida: guerrero.vida, mVida: maga.vida }; }',
            expected: { gVida: 60, mVida: 80 }
          }
        ]
      },
      {
        id: 'av-a6',
        part: 'B',
        partTitle: 'Parte B · Instancias y métodos propios',
        number: 6,
        title: 'Añadir métodos al constructor',
        concept: 'Un objeto no solo almacena datos: también puede realizar acciones. Cuando una propiedad contiene una función, la llamamos método.\n\n- Propiedad de dato: this.nombre = "Arturo" (guarda un valor).\n- Propiedad de método: this.mostrarEstado = function() { ... } (guarda una acción).\n\nDentro de la función del método, this apunta al personaje concreto que invoca la acción.',
        prompt: 'En el constructor Personaje(nombre, vida, ataque), añade a this el método mostrarEstado(). No recibe parámetros y debe devolver una cadena con el formato: "[nombre] tiene [vida] puntos de vida." (ejemplo: "Arturo tiene 100 puntos de vida.").',
        entrypoint: 'Personaje',
        starter: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n  this.vidaMaxima = vida;\n  // Define aquí this.mostrarEstado = function() { ... }\n}',
        hints: [
          'Asigna una función anónima a this.mostrarEstado dentro del constructor.',
          'Accede a los datos del personaje con this.nombre y this.vida.',
          'Escribe: this.mostrarEstado = function() { return `${this.nombre} tiene ${this.vida} puntos de vida.`; };'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cuál es la forma correcta de definir el método mostrarEstado dentro del constructor?",
                  "options": [
                            {
                                      "code": "this.mostrarEstado = function() {\n  return `${nombre} tiene ${vida} puntos de vida.`;\n};",
                                      "isCorrect": false,
                                      "explanation": "Accede a los parámetros originales nombre y vida por clausura (closure) en lugar de a this.nombre y this.vida. Si la salud del personaje cambia más adelante, el método mostrará siempre los valores iniciales desactualizados."
                            },
                            {
                                      "code": "this.mostrarEstado = function() {\n  return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n};",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! Asigna una función a this.mostrarEstado que lee dinámicamente this.nombre y this.vida de la instancia concreta que invoca el método."
                            },
                            {
                                      "code": "this.mostrarEstado = function() {\n  console.log(`${this.nombre} tiene ${this.vida} puntos de vida.`);\n};",
                                      "isCorrect": false,
                                      "explanation": "Imprime el mensaje por consola mediante console.log en lugar de retornarlo con return. La llamada al método devolverá undefined."
                            }
                  ]
        },
        solution: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n  this.vidaMaxima = vida;\n\n  // Método propio asignado a la instancia\n  this.mostrarEstado = function() {\n    return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n  };\n}',
        explanation: 'Al llamar guerrero.mostrarEstado(), this dentro de la función adopta el valor de guerrero, leyendo sus datos particulares.',
        review: 'Asegúrate de que el texto devuelto coincida exactamente con "[nombre] tiene [vida] puntos de vida."',
        cases: [
          {
            args: [],
            description: 'guerrero.mostrarEstado() devuelve la presentación esperada',
            eval: '(fn) => { const g = new fn("Arturo", 100, 20); return g.mostrarEstado(); }',
            expected: 'Arturo tiene 100 puntos de vida.'
          },
          {
            args: [],
            description: 'maga.mostrarEstado() utiliza sus propios datos',
            eval: '(fn) => { const m = new fn("Elena", 80, 30); return m.mostrarEstado(); }',
            expected: 'Elena tiene 80 puntos de vida.'
          },
          {
            args: [],
            description: 'Comprobar que es un método propio de la instancia',
            eval: '(fn) => { const p = new fn("Test", 50, 10); return Object.hasOwn(p, "mostrarEstado"); }',
            expected: true
          }
        ]
      },
      {
        id: 'av-a7',
        part: 'B',
        partTitle: 'Parte B · Instancias y métodos propios',
        number: 7,
        title: 'Modificar propiedades mediante métodos',
        concept: 'Los métodos son la forma idónea de modificar el estado interno de un objeto con control y seguridad.\n\nCuando un aventurero recibe daño en batalla, no queremos que su salud baje a valores negativos (la salud mínima en combate es 0).\nDentro de un método podemos usar operadores, condicionales y devolver el resultado para mantener la coherencia del estado.',
        prompt: 'Añade al constructor Personaje el método recibirDanyo(cantidad):\n- Debe restar cantidad a this.vida.\n- Si la vida cae por debajo de 0, establécela en 0 (sin valores negativos).\n- Devuelve los puntos de vida restantes (this.vida).\n(Conserva también this.mostrarEstado).',
        entrypoint: 'Personaje',
        starter: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n  this.vidaMaxima = vida;\n  this.mostrarEstado = function() {\n    return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n  };\n  // Añade this.recibirDanyo = function(cantidad) { ... }\n}',
        hints: [
          'Resta cantidad a this.vida: this.vida -= cantidad;',
          'Comprueba si this.vida < 0 con una condición y en tal caso fija this.vida = 0;',
          'Devuelve la vida restante al final: return this.vida;'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cómo debe implementarse recibirDanyo para descontar salud sin permitir valores negativos?",
                  "options": [
                            {
                                      "code": "this.recibirDanyo = function(cantidad) {\n  this.vida -= cantidad;\n  if (this.vida < 0) {\n    this.vida = 0;\n  }\n  return this.vida;\n};",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! Resta la cantidad recibida a this.vida, verifica si ha descendido por debajo de 0 para fijarla en 0 y devuelve la salud resultante."
                            },
                            {
                                      "code": "this.recibirDanyo = function(cantidad) {\n  this.vida -= cantidad;\n  return this.vida;\n};",
                                      "isCorrect": false,
                                      "explanation": "Resta directamente el daño sin controlar el límite inferior, lo que permite que la salud del personaje baje a valores negativos (por ejemplo, -20 puntos de vida)."
                            },
                            {
                                      "code": "this.recibirDanyo = function(cantidad) {\n  const restante = Math.max(0, this.vida - cantidad);\n  return restante;\n};",
                                      "isCorrect": false,
                                      "explanation": "Calcula el valor en una constante local y lo devuelve, pero olvida reasignar el valor a this.vida en el objeto; la salud de la instancia nunca se modifica."
                            }
                  ]
        },
        solution: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n  this.vidaMaxima = vida;\n\n  this.mostrarEstado = function() {\n    return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n  };\n\n  this.recibirDanyo = function(cantidad) {\n    this.vida -= cantidad;\n    if (this.vida < 0) {\n      this.vida = 0;\n    }\n    return this.vida;\n  };\n}',
        explanation: 'Encapsular la modificación de la vida dentro de recibirDanyo() evita inconsistencias y garantiza que ningún personaje tenga salud negativa.',
        review: 'Verifica que recibirDanyo retorne la vida restante y que nunca sea menor que cero.',
        cases: [
          {
            args: [],
            description: 'recibirDanyo reduce la salud de la instancia',
            eval: '(fn) => { const p = new fn("Arturo", 100, 20); const restante = p.recibirDanyo(35); return { restante, vida: p.vida }; }',
            expected: { restante: 65, vida: 65 }
          },
          {
            args: [],
            description: 'recibirDanyo no permite valores negativos (tope en 0)',
            eval: '(fn) => { const p = new fn("Elena", 80, 30); const restante = p.recibirDanyo(120); return { restante, vida: p.vida }; }',
            expected: { restante: 0, vida: 0 }
          }
        ]
      },
      {
        id: 'av-a8',
        part: 'C',
        partTitle: 'Parte C · Desafío autónomo',
        number: 8,
        title: 'Desafío autónomo: Gestión de productos',
        concept: '¡Es momento de aplicar de forma autónoma lo aprendido sobre constructores, this y new sin guía paso a paso!\n\nVas a programar la función constructora Producto para gestionar artículos en la tienda del gremio (pociones, armas y pergaminos).',
        prompt: 'Crea la función constructora Producto(nombre, precio, stock) con:\n\n1. Propiedades de la instancia:\n- this.nombre = nombre;\n- this.precio = precio;\n- this.stock = stock;\n\n2. Métodos de la instancia:\n- obtenerInfo(): devuelve la cadena "[nombre] - [precio]€ (Stock: [stock])" (ejemplo: "Poción de vida - 15€ (Stock: 10)").\n- vender(unidades): si unidades <= this.stock, resta unidades a this.stock y devuelve true. Si no hay suficiente stock disponible, no modifica this.stock y devuelve false.\n- reponer(unidades): suma unidades a this.stock y devuelve el stock actualizado (this.stock).',
        entrypoint: 'Producto',
        starter: '// Desafío autónomo: Implementa el constructor Producto y sus métodos\n\nfunction Producto(nombre, precio, stock) {\n  // Tu solución aquí\n}',
        hints: [
          'Inicializa nombre, precio y stock asignándolos a this en el cuerpo del constructor.',
          'En vender(unidades), comprueba if (unidades <= this.stock) { this.stock -= unidades; return true; } return false;',
          'En reponer(unidades), suma las unidades: this.stock += unidades; return this.stock;'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cuál es la implementación correcta del constructor Producto con vender y reponer?",
                  "options": [
                            {
                                      "code": "function Producto(nombre, precio, stock) {\n  this.nombre = nombre;\n  this.precio = precio;\n  this.stock = stock;\n  this.obtenerInfo = function() {\n    return `${this.nombre} - ${this.precio}€ (Stock: ${this.stock})`;\n  };\n  this.vender = function(unidades) {\n    this.stock -= unidades;\n    return this.stock >= 0;\n  };\n  this.reponer = function(unidades) {\n    this.stock += unidades;\n    return this.stock;\n  };\n}",
                                      "isCorrect": false,
                                      "explanation": "En vender(), resta las unidades antes de comprobar la disponibilidad, dejando el stock en números negativos cuando no había suficientes existencias para la venta."
                            },
                            {
                                      "code": "function Producto(nombre, precio, stock) {\n  this.nombre = nombre;\n  this.precio = precio;\n  this.stock = stock;\n  this.obtenerInfo = function() {\n    return `${this.nombre} - ${this.precio}€ (Stock: ${this.stock})`;\n  };\n  this.vender = function(unidades) {\n    if (unidades <= this.stock) {\n      this.stock -= unidades;\n      return true;\n    }\n    return false;\n  };\n  this.reponer = function(unidades) {\n    this.stock += unidades;\n    return this.stock;\n  };\n}",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! Valida unidades <= this.stock antes de mutar el stock devolviendo booleano, acumula con += en reponer() y formatea la ficha en obtenerInfo()."
                            },
                            {
                                      "code": "function Producto(nombre, precio, stock) {\n  this.nombre = nombre;\n  this.precio = precio;\n  this.stock = stock;\n  this.obtenerInfo = function() {\n    return `${this.nombre} - ${this.precio}€ (Stock: ${this.stock})`;\n  };\n  this.vender = function(unidades) {\n    return unidades <= this.stock;\n  };\n  this.reponer = function(unidades) {\n    this.stock = unidades;\n    return this.stock;\n  };\n}",
                                      "isCorrect": false,
                                      "explanation": "vender() comprueba la condición pero nunca resta unidades a this.stock, y reponer() sobrescribe this.stock = unidades en vez de acumular las existencias."
                            }
                  ]
        },
        solution: 'function Producto(nombre, precio, stock) {\n  this.nombre = nombre;\n  this.precio = precio;\n  this.stock = stock;\n\n  this.obtenerInfo = function() {\n    return `${this.nombre} - ${this.precio}€ (Stock: ${this.stock})`;\n  };\n\n  this.vender = function(unidades) {\n    if (unidades <= this.stock) {\n      this.stock -= unidades;\n      return true;\n    }\n    return false;\n  };\n\n  this.reponer = function(unidades) {\n    this.stock += unidades;\n    return this.stock;\n  };\n}',
        explanation: 'El desafío consolida el uso de funciones constructoras como moldes de objetos autónomos con datos y métodos encapsulados en cada instancia.',
        review: 'Prueba la venta con stock suficiente e insuficiente, la reposición y el formato de obtenerInfo().',
        cases: [
          {
            args: [],
            description: 'obtenerInfo() devuelve los datos formateados',
            eval: '(fn) => { const p = new fn("Poción de vida", 15, 10); return p.obtenerInfo(); }',
            expected: 'Poción de vida - 15€ (Stock: 10)'
          },
          {
            args: [],
            description: 'vender(unidades) reduce el stock si hay existencias y devuelve true',
            eval: '(fn) => { const p = new fn("Espada corta", 50, 5); const ok = p.vender(3); return { ok, stock: p.stock }; }',
            expected: { ok: true, stock: 2 }
          },
          {
            args: [],
            description: 'vender(unidades) rechaza la venta si no hay stock suficiente y devuelve false',
            eval: '(fn) => { const p = new fn("Escudo", 40, 2); const ok = p.vender(5); return { ok, stock: p.stock }; }',
            expected: { ok: false, stock: 2 }
          },
          {
            args: [],
            description: 'reponer(unidades) incrementa las existencias y retorna el nuevo stock',
            eval: '(fn) => { const p = new fn("Flechas", 2, 20); const nuevoStock = p.reponer(30); return { nuevoStock, stock: p.stock }; }',
            expected: { nuevoStock: 50, stock: 50 }
          }
        ]
      }
    ]
  },
  {
    id: 'aventureros-b',
    title: 'Práctica B — Prototipos y herencia: Habilidades compartidas',
    description: 'Comprende cómo los objetos comparten métodos y heredan comportamientos mediante prototipos y la cadena de prototipos.',
    topicId: 'objetos',
    recommendedBefore: 'aventureros-a',
    recommendedBeforeTitle: 'Práctica A — Crea tus propios objetos',
    summaryText: 'Has dominado el objeto prototype, la compartición eficiente de métodos en memoria, la cadena de prototipos y la herencia prototípica entre constructores.',
    parts: [
      { id: 'A', title: 'Parte A · Prototipos y métodos compartidos', stagesCount: 4 },
      { id: 'B', title: 'Parte B · Habilidades y mutación', stagesCount: 1 },
      { id: 'C', title: 'Parte C · Herencia prototípica y desafío', stagesCount: 3 }
    ],
    stages: [
      {
        id: 'av-b1',
        part: 'A',
        partTitle: 'Parte A · Prototipos y métodos compartidos',
        number: 1,
        title: 'Recordar las funciones constructoras',
        concept: 'En la práctica anterior aprendimos a crear personajes con un constructor y métodos asignados a this.\n\nRecordemos la estructura:\n- Propiedades de datos: this.nombre, this.vida, this.ataque.\n- Método en el constructor: this.mostrarEstado = function() { ... }.\n\nTodo funciona, pero analicemos la memoria RAM: cada vez que invocamos new Personaje(), JavaScript crea una NUEVA función mostrarEstado. Si creamos 1.000 personajes, ¡habrá 1.000 funciones idénticas ocupando memoria!',
        prompt: 'Dado el constructor Personaje con this.mostrarEstado asignado en el constructor, implementa la función analizarInstancias(). Debe crear dos personajes ("Thor" y "Loki") y devolver { mismaFuncion: p1.mostrarEstado === p2.mostrarEstado } para verificar si comparten la misma función en memoria o no.',
        entrypoint: 'analizarInstancias',
        starter: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n  this.mostrarEstado = function() {\n    return `${this.nombre} (${this.vida} PV)`;\n  };\n}\n\nfunction analizarInstancias() {\n  // Crea dos personajes y comprueba si p1.mostrarEstado === p2.mostrarEstado\n}',
        hints: [
          'Instancia a dos personajes: const p1 = new Personaje("Thor", 120, 25); const p2 = new Personaje("Loki", 90, 20);',
          'Compara sus funciones con ===: const mismaFuncion = p1.mostrarEstado === p2.mostrarEstado;',
          'Retorna { mismaFuncion }; Verás que resulta false porque son funciones duplicadas.'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cómo debe comprobar analizarInstancias si dos objetos comparten la misma función en memoria?",
                  "options": [
                            {
                                      "code": "function analizarInstancias() {\n  const p1 = new Personaje(\"Thor\", 120, 25);\n  const p2 = new Personaje(\"Loki\", 90, 20);\n  return {\n    mismaFuncion: p1.mostrarEstado() === p2.mostrarEstado()\n  };\n}",
                                      "isCorrect": false,
                                      "explanation": "Coloca paréntesis p1.mostrarEstado(), comparando las cadenas de texto retornadas por las funciones en lugar de comparar las referencias de las funciones en memoria."
                            },
                            {
                                      "code": "function analizarInstancias() {\n  const p1 = new Personaje(\"Thor\", 120, 25);\n  const p2 = new Personaje(\"Loki\", 90, 20);\n  return {\n    mismaFuncion: p1.mostrarEstado === p2.mostrarEstado\n  };\n}",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! Compara las referencias a las funciones con === sin paréntesis. Al haberse declarado dentro de this en el constructor, son dos funciones diferentes en memoria (false)."
                            },
                            {
                                      "code": "function analizarInstancias() {\n  const p1 = new Personaje(\"Thor\", 120, 25);\n  return {\n    mismaFuncion: p1.mostrarEstado === p1.mostrarEstado\n  };\n}",
                                      "isCorrect": false,
                                      "explanation": "Compara p1.mostrarEstado consigo misma en lugar de comparar dos instancias independientes, devolviendo siempre true sin evaluar la compartición real."
                            }
                  ]
        },
        solution: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n  this.mostrarEstado = function() {\n    return `${this.nombre} (${this.vida} PV)`;\n  };\n}\n\nfunction analizarInstancias() {\n  const p1 = new Personaje("Thor", 120, 25);\n  const p2 = new Personaje("Loki", 90, 20);\n  return {\n    mismaFuncion: p1.mostrarEstado === p2.mostrarEstado\n  };\n}',
        explanation: 'Definir métodos dentro del constructor duplica funciones en cada instancia (p1.mostrarEstado !== p2.mostrarEstado). En las siguientes etapas aprenderemos a compartir una única función mediante prototype.',
        review: 'Comprueba que analizarInstancias devuelva { mismaFuncion: false }.',
        cases: [
          {
            args: [],
            description: 'analizarInstancias() confirma que los métodos en this se duplican (false)',
            eval: '(fn) => fn()',
            expected: { mismaFuncion: false }
          }
        ]
      },
      {
        id: 'av-b2',
        part: 'A',
        partTitle: 'Parte A · Prototipos y métodos compartidos',
        number: 2,
        title: 'Introducción a prototype',
        concept: '¿Por qué duplicar una función mil veces si todas hacen exactamente lo mismo?\n\nAnalogía: en un gremio de aventureros, cada héroe lleva su propia mochila con pociones y armas individuales (propiedades del constructor). Pero no hace falta imprimir un libro entero de reglas de combate para cada héroe: hay un único manual de habilidades en la biblioteca del gremio que todos pueden consultar.\n\nEse manual compartido en JavaScript es el objeto prototype.\nToda función constructora en JavaScript posee automáticamente un objeto especial llamado Constructor.prototype.',
        prompt: 'Define el constructor Personaje(nombre, vida, ataque) inicializando únicamente sus datos (this.nombre, this.vida, this.ataque). No definas ningún método dentro del constructor. Las pruebas comprobarán que Personaje.prototype existe y es un objeto válido.',
        entrypoint: 'Personaje',
        starter: 'function Personaje(nombre, vida, ataque) {\n  // Inicializa solo los datos con this. No añadas métodos aquí.\n}',
        hints: [
          'Asigna this.nombre = nombre; this.vida = vida; this.ataque = ataque;',
          'No definas this.mostrarEstado dentro del cuerpo del constructor.',
          'JavaScript crea automáticamente Personaje.prototype como un objeto listo para recibir métodos compartidos.'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cuál es la forma óptima de preparar Personaje para que sus métodos se alojen en el prototipo?",
                  "options": [
                            {
                                      "code": "function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n}",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! Inicializa exclusivamente las propiedades de datos en this, dejando el constructor limpio para que los métodos se compartan en Personaje.prototype."
                            },
                            {
                                      "code": "function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n  this.mostrarEstado = function() {\n    return `${this.nombre} (${this.vida} PV)`;\n  };\n}",
                                      "isCorrect": false,
                                      "explanation": "Mantiene el método asignado a this, continuando la duplicación innecesaria de una nueva función por cada personaje instanciado."
                            },
                            {
                                      "code": "function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n  this.prototype = {};\n}",
                                      "isCorrect": false,
                                      "explanation": "Crea una propiedad individual llamada prototype en la instancia this. El prototipo compartido de JavaScript reside en la función constructora Personaje.prototype, no en la instancia."
                            }
                  ]
        },
        solution: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n}',
        explanation: 'Al separar los datos de las funciones, dejamos el constructor preparado para que los métodos se compartan eficientemente a través de su prototipo.',
        review: 'Asegúrate de no definir ningún método en this dentro de Personaje.',
        cases: [
          {
            args: [],
            description: 'Personaje posee un prototipo accesible y válido',
            eval: '(fn) => ({ esObjeto: typeof fn.prototype === "object", tieneConstructor: fn.prototype.constructor === fn })',
            expected: { esObjeto: true, tieneConstructor: true }
          },
          {
            args: [],
            description: 'Las instancias conservan sus propiedades individuales de datos',
            eval: '(fn) => { const p = new fn("Arturo", 100, 20); return { n: p.nombre, v: p.vida, a: p.ataque }; }',
            expected: { n: 'Arturo', v: 100, a: 20 }
          }
        ]
      },
      {
        id: 'av-b3',
        part: 'A',
        partTitle: 'Parte A · Prototipos y métodos compartidos',
        number: 3,
        title: 'Compartir un método en el prototipo',
        concept: 'Para compartir una función entre todas las instancias, la añadimos directamente a Personaje.prototype:\nPersonaje.prototype.mostrarEstado = function() { ... };\n\nCuando invocas heroe.mostrarEstado(), el motor de JavaScript sigue la cadena de prototipos (prototype chain):\n1. ¿Tiene heroe la propiedad mostrarEstado propia? No.\n2. ¿La tiene su prototipo (Personaje.prototype)? ¡Sí! La ejecuta allí.\n3. Dentro de esa función del prototipo, this apunta a la instancia que realizó la llamada (heroe).',
        prompt: '1. Mantén Personaje(nombre, vida, ataque) con sus propiedades de datos.\n2. Fuera del constructor, añade al prototipo el método Personaje.prototype.mostrarEstado:\nDebe devolver: "[nombre] tiene [vida] puntos de vida."',
        entrypoint: 'Personaje',
        starter: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n}\n\n// Añade aquí el método al prototipo:\n// Personaje.prototype.mostrarEstado = function() { ... };',
        hints: [
          'No añadas this.mostrarEstado dentro del constructor; asígnalo fuera sobre Personaje.prototype.mostrarEstado.',
          'Dentro de la función puedes acceder a this.nombre y this.vida.',
          'Escribe: Personaje.prototype.mostrarEstado = function() { return `${this.nombre} tiene ${this.vida} puntos de vida.`; };'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cómo debe vincularse mostrarEstado al prototipo para que todas las instancias lo compartan?",
                  "options": [
                            {
                                      "code": "Personaje.prototype.mostrarEstado = () => {\n  return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n};",
                                      "isCorrect": false,
                                      "explanation": "Las funciones flecha no tienen enlace propio de this; adoptan el this del ámbito léxico exterior (window o undefined), provocando que this.nombre y this.vida no apunten a la instancia."
                            },
                            {
                                      "code": "Personaje.prototype = {\n  mostrarEstado: function() {\n    return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n  }\n};",
                                      "isCorrect": false,
                                      "explanation": "Reemplaza el objeto prototype completo con uno nuevo, lo que destruye la propiedad nativa constructor (instancia.constructor === Personaje pasará a ser false)."
                            },
                            {
                                      "code": "Personaje.prototype.mostrarEstado = function() {\n  return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n};",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! Añade la propiedad al objeto prototype existente mediante una función tradicional; this se vinculará dinámicamente a la instancia invocadora."
                            }
                  ]
        },
        solution: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n}\n\nPersonaje.prototype.mostrarEstado = function() {\n  return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n};',
        explanation: 'Ahora todas las instancias pueden invocar .mostrarEstado() sin duplicar la función en memoria: la función vive únicamente en Personaje.prototype.',
        review: 'Verifica que mostrarEstado esté asignado a Personaje.prototype y no dentro de this.',
        cases: [
          {
            args: [],
            description: 'p.mostrarEstado() devuelve el texto esperado',
            eval: '(fn) => { const p = new fn("Arturo", 100, 20); return p.mostrarEstado(); }',
            expected: 'Arturo tiene 100 puntos de vida.'
          },
          {
            args: [],
            description: 'El método reside en Personaje.prototype y no como propiedad propia',
            eval: '(fn) => { const p = new fn("Elena", 80, 30); return { enPrototipo: Object.hasOwn(fn.prototype, "mostrarEstado"), esPropia: Object.hasOwn(p, "mostrarEstado") }; }',
            expected: { enPrototipo: true, esPropia: false }
          }
        ]
      },
      {
        id: 'av-b4',
        part: 'A',
        partTitle: 'Parte A · Prototipos y métodos compartidos',
        number: 4,
        title: 'Comprobar métodos compartidos',
        concept: 'Ahora podemos comprobar la gran ventaja de prototype en memoria:\nSi creamos dos personajes:\nlet guerrero = new Personaje("Arturo", 100, 20);\nlet maga = new Personaje("Elena", 80, 30);\n\nAl comparar:\nguerrero.mostrarEstado === maga.mostrarEstado\n\n¡El resultado es true! Ambas instancias apuntan a la misma y única función en la memoria RAM.',
        prompt: 'Manteniendo Personaje con mostrarEstado en su prototipo, implementa la función verificarMetodoCompartido(). Debe crear a "Arturo" y a "Elena", y devolver un objeto con:\n- compartenMetodo: booleano de guerrero.mostrarEstado === maga.mostrarEstado\n- mensajeGuerrero: resultado de guerrero.mostrarEstado()',
        entrypoint: 'verificarMetodoCompartido',
        starter: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n}\n\nPersonaje.prototype.mostrarEstado = function() {\n  return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n};\n\nfunction verificarMetodoCompartido() {\n  // Crea a guerrero y maga y devuelve { compartenMetodo, mensajeGuerrero }\n}',
        hints: [
          'Instancia a guerrero ("Arturo", 100, 20) y a maga ("Elena", 80, 30).',
          'Comprueba la igualdad estricta: guerrero.mostrarEstado === maga.mostrarEstado.',
          'Retorna { compartenMetodo: guerrero.mostrarEstado === maga.mostrarEstado, mensajeGuerrero: guerrero.mostrarEstado() };'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cómo debe verificarMetodoCompartido constatar la delegación de métodos en el prototipo?",
                  "options": [
                            {
                                      "code": "function verificarMetodoCompartido() {\n  const guerrero = new Personaje(\"Arturo\", 100, 20);\n  const maga = new Personaje(\"Elena\", 80, 30);\n  return {\n    compartenMetodo: typeof guerrero.mostrarEstado === typeof maga.mostrarEstado,\n    mensajeGuerrero: guerrero.mostrarEstado()\n  };\n}",
                                      "isCorrect": false,
                                      "explanation": "typeof ... === typeof ... únicamente evalúa si ambos son \"function\", lo cual daría true incluso con dos funciones duplicadas en memoria."
                            },
                            {
                                      "code": "function verificarMetodoCompartido() {\n  const guerrero = new Personaje(\"Arturo\", 100, 20);\n  const maga = new Personaje(\"Elena\", 80, 30);\n  return {\n    compartenMetodo: guerrero.mostrarEstado === maga.mostrarEstado,\n    mensajeGuerrero: guerrero.mostrarEstado()\n  };\n}",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! guerrero.mostrarEstado === maga.mostrarEstado compara la referencia en memoria: al estar en Personaje.prototype, ambas instancias comparten la misma y única función (true)."
                            },
                            {
                                      "code": "function verificarMetodoCompartido() {\n  const guerrero = new Personaje(\"Arturo\", 100, 20);\n  return {\n    compartenMetodo: true,\n    mensajeGuerrero: Personaje.mostrarEstado()\n  };\n}",
                                      "isCorrect": false,
                                      "explanation": "Personaje.mostrarEstado() intenta ejecutar el método como si fuese estático de la función constructora; mostrarEstado reside en el prototipo y debe ser llamado por una instancia."
                            }
                  ]
        },
        solution: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n}\n\nPersonaje.prototype.mostrarEstado = function() {\n  return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n};\n\nfunction verificarMetodoCompartido() {\n  const guerrero = new Personaje("Arturo", 100, 20);\n  const maga = new Personaje("Elena", 80, 30);\n  return {\n    compartenMetodo: guerrero.mostrarEstado === maga.mostrarEstado,\n    mensajeGuerrero: guerrero.mostrarEstado()\n  };\n}',
        explanation: 'La igualdad estricta es true porque ambas instancias delegan la búsqueda del método en el mismo objeto prototipo, optimizando recursos.',
        review: 'Comprueba que compartenMetodo devuelva true y mensajeGuerrero contenga la ficha formateada.',
        cases: [
          {
            args: [],
            description: 'verificarMetodoCompartido() demuestra la igualdad estricta de la función compartida',
            eval: '(fn) => fn()',
            expected: { compartenMetodo: true, mensajeGuerrero: 'Arturo tiene 100 puntos de vida.' }
          }
        ]
      },
      {
        id: 'av-b5',
        part: 'B',
        partTitle: 'Parte B · Habilidades y mutación',
        number: 5,
        title: 'Añadir habilidades: recibirDanyo y curar',
        concept: 'Los métodos en el prototipo actúan directamente sobre las propiedades de la instancia que los ejecuta mediante this.\n\nVamos a dotar a todos los personajes de dos habilidades esenciales de combate:\n1. recibirDanyo(cantidad): reduce la vida de la instancia sin permitir valores negativos (tope en 0).\n2. curar(cantidad): incrementa los puntos de vida de la instancia.\nAmbos métodos retornan los puntos de vida actualizados (this.vida).',
        prompt: 'Añade al prototipo de Personaje los métodos:\n- Personaje.prototype.recibirDanyo(cantidad): resta cantidad a this.vida sin bajar de 0 (tope en 0) y devuelve this.vida.\n- Personaje.prototype.curar(cantidad): suma cantidad a this.vida y devuelve this.vida.\n(Conserva también mostrarEstado en el prototipo).',
        entrypoint: 'Personaje',
        starter: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n}\n\nPersonaje.prototype.mostrarEstado = function() {\n  return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n};\n\n// Añade Personaje.prototype.recibirDanyo y Personaje.prototype.curar',
        hints: [
          'En recibirDanyo(cantidad): this.vida = Math.max(0, this.vida - cantidad); return this.vida;',
          'En curar(cantidad): this.vida += cantidad; return this.vida;',
          'Asigna ambos métodos sobre Personaje.prototype.'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cuál es la implementación correcta de recibirDanyo y curar en Personaje.prototype?",
                  "options": [
                            {
                                      "code": "Personaje.prototype.recibirDanyo = function(cantidad) {\n  this.vida = Math.max(0, this.vida - cantidad);\n  return this.vida;\n};\n\nPersonaje.prototype.curar = function(cantidad) {\n  this.vida += cantidad;\n  return this.vida;\n};",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! Añade ambos métodos a Personaje.prototype, evita salud negativa con Math.max(0, ...) en el daño, acumula salud en curar y devuelve this.vida en ambos casos."
                            },
                            {
                                      "code": "Personaje.prototype.recibirDanyo = function(cantidad) {\n  this.vida = Math.max(0, this.vida - cantidad);\n  return this.vida;\n};\n\nPersonaje.prototype.curar = function(cantidad) {\n  this.vida = cantidad;\n  return this.vida;\n};",
                                      "isCorrect": false,
                                      "explanation": "En curar(), asigna this.vida = cantidad en vez de sumar this.vida += cantidad, sobreescribiendo la salud del personaje con el valor recibido."
                            },
                            {
                                      "code": "Personaje.prototype.recibirDanyo = function(cantidad) {\n  vida = Math.max(0, vida - cantidad);\n  return vida;\n};\n\nPersonaje.prototype.curar = function(cantidad) {\n  vida += cantidad;\n  return vida;\n};",
                                      "isCorrect": false,
                                      "explanation": "Omite la palabra clave this al manipular vida, intentando modificar una variable global no declarada y arrojando un ReferenceError."
                            }
                  ]
        },
        solution: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n}\n\nPersonaje.prototype.mostrarEstado = function() {\n  return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n};\n\nPersonaje.prototype.recibirDanyo = function(cantidad) {\n  this.vida = Math.max(0, this.vida - cantidad);\n  return this.vida;\n};\n\nPersonaje.prototype.curar = function(cantidad) {\n  this.vida += cantidad;\n  return this.vida;\n};',
        explanation: 'Aunque recibirDanyo y curar son funciones compartidas y únicas en memoria, this asegura que las modificaciones de salud se apliquen con total precisión a la instancia invocadora.',
        review: 'Comprueba que recibirDanyo no deje la vida en negativo y que ambos métodos devuelvan this.vida.',
        cases: [
          {
            args: [],
            description: 'recibirDanyo y curar mutan la salud de la instancia concreta',
            eval: '(fn) => { const p = new fn("Arturo", 100, 20); p.recibirDanyo(40); const curada = p.curar(15); return { vida: p.vida, curada }; }',
            expected: { vida: 75, curada: 75 }
          },
          {
            args: [],
            description: 'recibirDanyo no permite vida negativa',
            eval: '(fn) => { const p = new fn("Elena", 50, 20); p.recibirDanyo(90); return p.vida; }',
            expected: 0
          },
          {
            args: [],
            description: 'Ambos métodos residen en el prototipo',
            eval: '(fn) => ({ r: Object.hasOwn(fn.prototype, "recibirDanyo"), c: Object.hasOwn(fn.prototype, "curar") })',
            expected: { r: true, c: true }
          }
        ]
      },
      {
        id: 'av-b6',
        part: 'C',
        partTitle: 'Parte C · Herencia prototípica y desafío',
        number: 6,
        title: 'Herencia prototípica entre constructores',
        concept: '¿Cómo creamos tipos especializados de personajes, como un Guerrero, sin reescribir todo el código de Personaje?\n\nMediante herencia prototípica:\n1. Reutilizar el constructor padre: dentro de Guerrero, llamamos a Personaje.call(this, nombre, vida, ataque) para inicializar las propiedades base en la nueva instancia.\n2. Conectar la cadena de prototipos: Guerrero.prototype = Object.create(Personaje.prototype);\n3. Restablecer el constructor: Guerrero.prototype.constructor = Guerrero;\n\n¡Así cualquier Guerrero hereda mostrarEstado, recibirDanyo y curar automáticamente!',
        prompt: 'Manteniendo el constructor Personaje y sus métodos en el prototipo, crea el constructor especializado Guerrero(nombre, vida, ataque, armadura):\n- Llama a Personaje.call(this, nombre, vida, ataque) y asigna this.armadura = armadura;.\n- Vincula su prototipo para que herede de Personaje.prototype mediante Object.create(Personaje.prototype).\n- Restaura la referencia Guerrero.prototype.constructor = Guerrero;.',
        entrypoint: 'Guerrero',
        starter: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n}\nPersonaje.prototype.mostrarEstado = function() {\n  return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n};\nPersonaje.prototype.recibirDanyo = function(cantidad) {\n  this.vida = Math.max(0, this.vida - cantidad);\n  return this.vida;\n};\nPersonaje.prototype.curar = function(cantidad) {\n  this.vida += cantidad;\n  return this.vida;\n};\n\n// Implementa aquí Guerrero y conecta su cadena de prototipos',
        hints: [
          'Dentro de function Guerrero(nombre, vida, ataque, armadura), llama a Personaje.call(this, nombre, vida, ataque); y asigna this.armadura = armadura;',
          'Conecta el prototipo: Guerrero.prototype = Object.create(Personaje.prototype);',
          'Restaura el constructor: Guerrero.prototype.constructor = Guerrero;'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cómo debe enlazarse la herencia prototípica de Guerrero respecto a Personaje?",
                  "options": [
                            {
                                      "code": "function Guerrero(nombre, vida, ataque, armadura) {\n  Personaje.call(this, nombre, vida, ataque);\n  this.armadura = armadura;\n}\n\nGuerrero.prototype = Personaje.prototype;\nGuerrero.prototype.constructor = Guerrero;",
                                      "isCorrect": false,
                                      "explanation": "Asignar Guerrero.prototype = Personaje.prototype comparte el mismo objeto prototipo por referencia. Cualquier método añadido a Guerrero se agregaría también a Personaje y cambia el constructor de Personaje a Guerrero."
                            },
                            {
                                      "code": "function Guerrero(nombre, vida, ataque, armadura) {\n  Personaje.call(this, nombre, vida, ataque);\n  this.armadura = armadura;\n}\n\nGuerrero.prototype = Object.create(Personaje.prototype);\nGuerrero.prototype.constructor = Guerrero;",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! Llama al constructor padre vinculando this con Personaje.call, crea un nuevo objeto intermediario con Object.create(Personaje.prototype) y restablece la propiedad constructor."
                            },
                            {
                                      "code": "function Guerrero(nombre, vida, ataque, armadura) {\n  this.armadura = armadura;\n}\n\nGuerrero.prototype = Object.create(Personaje.prototype);",
                                      "isCorrect": false,
                                      "explanation": "No invoca a Personaje.call(this, nombre, vida, ataque) dentro del constructor, dejando a las instancias de Guerrero sin las propiedades nombre, vida ni ataque, y omite restaurar el constructor."
                            }
                  ]
        },
        solution: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n}\nPersonaje.prototype.mostrarEstado = function() {\n  return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n};\nPersonaje.prototype.recibirDanyo = function(cantidad) {\n  this.vida = Math.max(0, this.vida - cantidad);\n  return this.vida;\n};\nPersonaje.prototype.curar = function(cantidad) {\n  this.vida += cantidad;\n  return this.vida;\n};\n\nfunction Guerrero(nombre, vida, ataque, armadura) {\n  Personaje.call(this, nombre, vida, ataque);\n  this.armadura = armadura;\n}\n\nGuerrero.prototype = Object.create(Personaje.prototype);\nGuerrero.prototype.constructor = Guerrero;',
        explanation: 'Object.create(Personaje.prototype) crea un objeto nuevo cuyo prototipo interno apunta a Personaje.prototype, formando la cadena de herencia clásica de JavaScript sin clases ES6.',
        review: 'Comprueba la llamada con call, la asignación de armadura y la conexión con Object.create.',
        cases: [
          {
            args: [],
            description: 'Guerrero hereda métodos de Personaje y tiene su propiedad armadura',
            eval: '(fn) => { const g = new fn("Thor", 120, 25, 10); return { n: g.nombre, v: g.vida, a: g.armadura, msg: g.mostrarEstado(), esG: g instanceof fn }; }',
            expected: { n: 'Thor', v: 120, a: 10, msg: 'Thor tiene 120 puntos de vida.', esG: true }
          },
          {
            args: [],
            description: 'La cadena de prototipos y constructor están correctamente configurados',
            eval: '(fn) => ({ c: fn.prototype.constructor === fn, protoValido: Object.getPrototypeOf(fn.prototype) !== Object.prototype })',
            expected: { c: true, protoValido: true }
          }
        ]
      },
      {
        id: 'av-b7',
        part: 'C',
        partTitle: 'Parte C · Herencia prototípica y desafío',
        number: 7,
        title: 'Especialización y métodos propios del subtipo',
        concept: 'Un subtipo no solo hereda lo que tiene el padre: también puede incorporar habilidades exclusivas.\n\nAñadiremos al prototipo de Guerrero el método defender(ataqueRecibido):\n- La armadura amortigua el impacto: el daño real es Math.max(0, ataqueRecibido - this.armadura).\n- Aplica ese daño llamando al método heredado this.recibirDanyo(danyoReal) y devuelve la vida restante.',
        prompt: 'Añade a Guerrero.prototype el método defender(ataqueRecibido). Debe calcular el daño reduciendo ataqueRecibido según this.armadura (sin que sea menor que 0), aplicar ese daño invocando this.recibirDanyo(danyoReal) y devolver la vida restante (this.vida).',
        entrypoint: 'Guerrero',
        starter: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n}\nPersonaje.prototype.mostrarEstado = function() {\n  return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n};\nPersonaje.prototype.recibirDanyo = function(cantidad) {\n  this.vida = Math.max(0, this.vida - cantidad);\n  return this.vida;\n};\nPersonaje.prototype.curar = function(cantidad) {\n  this.vida += cantidad;\n  return this.vida;\n};\n\nfunction Guerrero(nombre, vida, ataque, armadura) {\n  Personaje.call(this, nombre, vida, ataque);\n  this.armadura = armadura;\n}\nGuerrero.prototype = Object.create(Personaje.prototype);\nGuerrero.prototype.constructor = Guerrero;\n\n// Añade Guerrero.prototype.defender = function(ataqueRecibido) { ... };',
        hints: [
          'Calcula el daño restando la armadura: const danyoReal = Math.max(0, ataqueRecibido - this.armadura);',
          'Llama a this.recibirDanyo(danyoReal);',
          'Retorna la salud restante: return this.vida;'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cómo debe definirse Guerrero.prototype.defender aprovechando el método heredado recibirDanyo?",
                  "options": [
                            {
                                      "code": "Guerrero.prototype.defender = function(ataqueRecibido) {\n  const danyoReal = ataqueRecibido - this.armadura;\n  return this.recibirDanyo(danyoReal);\n};",
                                      "isCorrect": false,
                                      "explanation": "No acota el daño mínimo a 0. Si ataqueRecibido es menor que this.armadura, danyoReal será negativo, por lo que restar un número negativo en recibirDanyo curará al personaje."
                            },
                            {
                                      "code": "Guerrero.prototype.defender = function(ataqueRecibido) {\n  const danyoReal = Math.max(0, ataqueRecibido - this.armadura);\n  return this.recibirDanyo(danyoReal);\n};",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! Calcula el daño amortiguado con Math.max(0, ataqueRecibido - this.armadura) y delega la aplicación del daño en el método heredado this.recibirDanyo(danyoReal)."
                            },
                            {
                                      "code": "Guerrero.prototype.defender = function(ataqueRecibido) {\n  const danyoReal = Math.max(0, ataqueRecibido - this.armadura);\n  this.vida -= danyoReal;\n  return this.vida;\n};",
                                      "isCorrect": false,
                                      "explanation": "Muta this.vida directamente sin invocar el método heredado recibirDanyo() y sin proteger el estado contra valores inferiores a 0."
                            }
                  ]
        },
        solution: 'function Personaje(nombre, vida, ataque) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.ataque = ataque;\n}\nPersonaje.prototype.mostrarEstado = function() {\n  return `${this.nombre} tiene ${this.vida} puntos de vida.`;\n};\nPersonaje.prototype.recibirDanyo = function(cantidad) {\n  this.vida = Math.max(0, this.vida - cantidad);\n  return this.vida;\n};\nPersonaje.prototype.curar = function(cantidad) {\n  this.vida += cantidad;\n  return this.vida;\n};\n\nfunction Guerrero(nombre, vida, ataque, armadura) {\n  Personaje.call(this, nombre, vida, ataque);\n  this.armadura = armadura;\n}\nGuerrero.prototype = Object.create(Personaje.prototype);\nGuerrero.prototype.constructor = Guerrero;\n\nGuerrero.prototype.defender = function(ataqueRecibido) {\n  const danyoReal = Math.max(0, ataqueRecibido - this.armadura);\n  return this.recibirDanyo(danyoReal);\n};',
        explanation: 'Guerrero.prototype.defender solo está disponible para instancias de Guerrero, mientras que los métodos de Personaje siguen estando accesibles para ambos.',
        review: 'Comprueba que defender reduzca el daño según la armadura y devuelva this.vida.',
        cases: [
          {
            args: [],
            description: 'defender amortigua el ataque con la armadura',
            eval: '(fn) => { const g = new fn("Arturo", 100, 20, 15); const vidaRestante = g.defender(40); return { vidaRestante, vida: g.vida }; }',
            expected: { vidaRestante: 75, vida: 75 }
          },
          {
            args: [],
            description: 'defender bloquea por completo ataques inferiores a la armadura',
            eval: '(fn) => { const g = new fn("Arturo", 100, 20, 15); const vidaRestante = g.defender(10); return { vidaRestante, vida: g.vida }; }',
            expected: { vidaRestante: 100, vida: 100 }
          },
          {
            args: [],
            description: 'defender reside en Guerrero.prototype',
            eval: '(fn) => Object.hasOwn(fn.prototype, "defender")',
            expected: true
          }
        ]
      },
      {
        id: 'av-b8',
        part: 'C',
        partTitle: 'Parte C · Herencia prototípica y desafío',
        number: 8,
        title: 'Desafío autónomo: La orden de los magos',
        concept: '¡Es momento de consolidar tu dominio de la herencia prototípica sin guía paso a paso!\n\nVas a implementar el constructor base Aventurero y el subtipo Mago que hereda de él, con gestión de energía mágica (maná).',
        prompt: 'Implementa la jerarquía de aventureros con herencia prototípica:\n\n1. Constructor base Aventurero(nombre, vida):\n- Propiedades: this.nombre = nombre; this.vida = vida; this.vidaMaxima = vida;\n- En Aventurero.prototype:\n  · recibirDanyo(cantidad): resta cantidad a this.vida (tope mínimo en 0) y devuelve this.vida.\n  · curar(cantidad): aumenta this.vida sin superar this.vidaMaxima (Math.min(this.vida + cantidad, this.vidaMaxima)) y devuelve this.vida.\n\n2. Constructor derivado Mago(nombre, vida, mana):\n- Invoca a Aventurero.call(this, nombre, vida).\n- Añade this.mana = mana;.\n- Conecta la herencia con Object.create(Aventurero.prototype) y restaura Mago.prototype.constructor = Mago;.\n- En Mago.prototype:\n  · lanzarHechizo(objetivo, costeMana, danyoHechizo):\n    - Si this.mana >= costeMana: resta costeMana a this.mana, invoca objetivo.recibirDanyo(danyoHechizo) y devuelve: "${this.nombre} lanza hechizo a ${objetivo.nombre} causando ${danyoHechizo} de daño. Mana restante: ${this.mana}."\n    - Si this.mana < costeMana: no modifica maná ni vida, y devuelve: "${this.nombre} no tiene suficiente mana."',
        entrypoint: 'Mago',
        starter: '// Desafío autónomo: Implementa Aventurero y el subtipo Mago con herencia prototípica\n\nfunction Aventurero(nombre, vida) {\n  // Constructor base\n}\n\n// Métodos en Aventurero.prototype\n\nfunction Mago(nombre, vida, mana) {\n  // Subtipo derivado\n}\n\n// Herencia y métodos de Mago.prototype',
        hints: [
          'En Mago, llama a Aventurero.call(this, nombre, vida); y conecta Mago.prototype = Object.create(Aventurero.prototype); Mago.prototype.constructor = Mago;',
          'En curar, usa Math.min(this.vida + cantidad, this.vidaMaxima) para no sobrepasar el tope máximo de salud.',
          'En lanzarHechizo, comprueba if (this.mana >= costeMana) { this.mana -= costeMana; objetivo.recibirDanyo(danyoHechizo); return ...; } return `${this.nombre} no tiene suficiente mana.`;'
        ],
        multipleChoiceCode: {
                  "title": "Elige la solución correcta",
                  "prompt": "¿Cuál es la implementación correcta de lanzarHechizo en Mago.prototype?",
                  "options": [
                            {
                                      "code": "Mago.prototype.lanzarHechizo = function(objetivo, costeMana, danyoHechizo) {\n  if (this.mana >= costeMana) {\n    this.mana -= costeMana;\n    return `${this.nombre} lanza hechizo a ${objetivo.nombre} causando ${danyoHechizo} de daño. Mana restante: ${this.mana}.`;\n  }\n  return `${this.nombre} no tiene suficiente mana.`;\n};",
                                      "isCorrect": false,
                                      "explanation": "Descuenta el maná y devuelve el texto con éxito, pero olvida invocar objetivo.recibirDanyo(danyoHechizo), por lo que la salud del objetivo no disminuye."
                            },
                            {
                                      "code": "Mago.prototype.lanzarHechizo = function(objetivo, costeMana, danyoHechizo) {\n  if (this.mana >= costeMana) {\n    this.mana -= costeMana;\n    objetivo.recibirDanyo(danyoHechizo);\n    return `${this.nombre} lanza hechizo a ${objetivo.nombre} causando ${danyoHechizo} de daño. Mana restante: ${this.mana}.`;\n  }\n  return `${this.nombre} no tiene suficiente mana.`;\n};",
                                      "isCorrect": true,
                                      "explanation": "¡Correcto! Verifica la condición de maná, descuenta el coste, inflige el daño al objetivo mediante objetivo.recibirDanyo(danyoHechizo) y retorna la cadena informativa esperada."
                            },
                            {
                                      "code": "Aventurero.prototype.curar = function(cantidad) {\n  this.vida += cantidad;\n  return this.vida;\n};",
                                      "isCorrect": false,
                                      "explanation": "En el constructor base Aventurero, omite respetar el límite superior con Math.min(this.vida + cantidad, this.vidaMaxima), permitiendo superar la vida máxima inicial."
                            }
                  ]
        },
        solution: 'function Aventurero(nombre, vida) {\n  this.nombre = nombre;\n  this.vida = vida;\n  this.vidaMaxima = vida;\n}\n\nAventurero.prototype.recibirDanyo = function(cantidad) {\n  this.vida = Math.max(0, this.vida - cantidad);\n  return this.vida;\n};\n\nAventurero.prototype.curar = function(cantidad) {\n  this.vida = Math.min(this.vida + cantidad, this.vidaMaxima);\n  return this.vida;\n};\n\nfunction Mago(nombre, vida, mana) {\n  Aventurero.call(this, nombre, vida);\n  this.mana = mana;\n}\n\nMago.prototype = Object.create(Aventurero.prototype);\nMago.prototype.constructor = Mago;\n\nMago.prototype.lanzarHechizo = function(objetivo, costeMana, danyoHechizo) {\n  if (this.mana >= costeMana) {\n    this.mana -= costeMana;\n    objetivo.recibirDanyo(danyoHechizo);\n    return `${this.nombre} lanza hechizo a ${objetivo.nombre} causando ${danyoHechizo} de daño. Mana restante: ${this.mana}.`;\n  }\n  return `${this.nombre} no tiene suficiente mana.`;\n};',
        explanation: 'El desafío consolida el modelo prototípico completo: constructores especializados que llaman al constructor padre, cadena de prototipos con Object.create y métodos de instancia interactuando entre objetos.',
        review: 'Prueba el lanzamiento de hechizo con maná suficiente e insuficiente, la curación con tope en vidaMaxima y la herencia de métodos.',
        cases: [
          {
            args: [],
            description: 'lanzarHechizo inflige daño al objetivo y descuenta maná',
            eval: '(fn) => { const mago = new fn("Gandalf", 80, 50); const orco = new fn("Orco", 60, 0); const msg = mago.lanzarHechizo(orco, 20, 35); return { msg, orcoVida: orco.vida, magoMana: mago.mana }; }',
            expected: { msg: 'Gandalf lanza hechizo a Orco causando 35 de daño. Mana restante: 30.', orcoVida: 25, magoMana: 30 }
          },
          {
            args: [],
            description: 'lanzarHechizo avisa si no hay maná suficiente',
            eval: '(fn) => { const mago = new fn("Raistlin", 50, 10); const dummy = new fn("Objetivo", 40, 0); const msg = mago.lanzarHechizo(dummy, 25, 40); return { msg, dummyVida: dummy.vida, magoMana: mago.mana }; }',
            expected: { msg: 'Raistlin no tiene suficiente mana.', dummyVida: 40, magoMana: 10 }
          },
          {
            args: [],
            description: 'Mago hereda curar y respeta vidaMaxima',
            eval: '(fn) => { const m = new fn("Elena", 70, 30); m.recibirDanyo(30); const curada = m.curar(50); return { vida: m.vida, curada }; }',
            expected: { vida: 70, curada: 70 }
          },
          {
            args: [],
            description: 'Comprobar que Mago es instancia de Aventurero y prototipos conectados',
            eval: '(fn) => { const m = new fn("Test", 50, 20); return { esMago: m instanceof fn, esAventurero: typeof fn.prototype.curar === "function" }; }',
            expected: { esMago: true, esAventurero: true }
          }
        ]
      }
    ]
  }
];

