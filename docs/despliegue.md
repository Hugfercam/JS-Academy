# Despliegue HTTPS en Cloudflare Pages

La PWA se despliega como archivos estáticos. No necesita servidor Node, base de datos ni claves de API en producción. No se ha creado una cuenta ni publicado ningún proyecto automáticamente.

## Preparar un ZIP en Windows

Desde la carpeta del proyecto:

```powershell
powershell -NoProfile -File scripts/prepare-deploy.ps1
```

Ejecuta los tests, compila, verifica el precaché de los dos Workers y crea `release/js-academy-pages.zip`. El ZIP contiene el contenido de `dist`, con `index.html` directamente en su raíz y separadores `/` en todas las rutas (también al generarlo en Windows). Se comprueba cada entrada del archivo. No incluye los PDF, fuentes originales, tests, borradores ni node_modules.

## Primera publicación por carga directa

1. Inicia sesión en https://dash.cloudflare.com/ o crea tu cuenta.
2. Abre **Workers & Pages**, crea una aplicación y selecciona **Pages** y la opción de subir archivos (**Drag and drop / Direct Upload**). La interfaz puede variar.
3. Elige un nombre, por ejemplo `js-academy-hugo`, sujeto a disponibilidad.
4. Sube `release/js-academy-pages.zip`, o directamente la carpeta `dist`.
5. Publica y conserva la dirección HTTPS que Cloudflare devuelva. No es necesario comprar un dominio. La dirección será del tipo `https://<nombre-disponible>.pages.dev`.

Este despliegue estándar es accesible a quien tenga la URL. El progreso sigue siendo local a cada navegador. No se suben los PDF originales; los resúmenes y ejercicios sí forman parte de la aplicación publicada.

La carga directa es adecuada para esta primera entrega. Cloudflare no permite convertir ese mismo proyecto a integración Git después: para cambiar a despliegues automáticos con Git habrá que crear otro proyecto. Mantén la dirección de producción estable para conservar el mismo origen de almacenamiento e instalación de la PWA.

## Configuración si se elige integración Git desde el principio

- Framework: Vite o ninguno.
- Comando de compilación: `npm run build`.
- Carpeta de salida: `dist`.
- Node: una versión compatible con Vite 7, por ejemplo Node 24.
- Sin variables de entorno ni secretos.

## Caché y actualizaciones

`public/_headers` se copia al despliegue. La entrada, manifest y Service Worker se revalidan; los recursos con hash de Vite admiten caché larga. El Service Worker mantiene la copia offline y la aplicación solicita actualizar, en lugar de recargar automáticamente durante un ejercicio.

No añadas una política CSP que bloquee `new Function` dentro de los Workers: el corrector evalúa el código local del estudiante. Su aislamiento protege la fluidez de la interfaz, no constituye una barrera de seguridad.

## Comprobación antes del viaje

1. Abre la URL HTTPS en Chrome de Android y espera a que termine la carga.
2. Recarga una vez conectado para que el Service Worker controle la página.
3. Instala desde el menú de Chrome (Instalar aplicación / Añadir a pantalla de inicio).
4. Abre apuntes, un test, un reto y Biblioteca. Escribe un borrador y evalúa.
5. Cierra, activa modo avión y abre desde el icono instalado.
6. Confirma lectura, corrección de código y conservación de borradores/progreso al reabrir.
7. Exporta una copia desde Mi progreso. El progreso de localhost no aparece automáticamente en el dominio HTTPS: impórtalo si quieres conservarlo.

Para futuras versiones, vuelve a generar el ZIP y crea un despliegue de producción en el **mismo proyecto**. Abre conectado y acepta el aviso de nueva versión tras guardar el trabajo.

Documentación oficial: https://developers.cloudflare.com/pages/get-started/direct-upload/ y https://developers.cloudflare.com/pages/configuration/headers/.
