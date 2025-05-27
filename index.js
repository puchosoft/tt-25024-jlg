// +==================================+
// | Talento Tech - C#25024 - Node.JS |
// +==================================+

// +------------------------------+
// | Proyecto Final (pre-entrega) |
// |     Jose Luis Gonzalez       |
// +------------------------------+

// Conjunto de comandos válidos
const comandos = new Set([
    'GET',
    'POST',
    'DELETE'
]);

// Primer parametro obligatorio para los comandos
const parametro1 = 'products'

// URL de la API de productos
const URL = 'https://fakestoreapi.com/products';

// Configuración de la solicitud HTTP
const config = {};

/**
 * Muestra el encabezado de la aplicación
 */
function mostrarAplicacion() {
    console.log('+-----------------------------------+');
    console.log('| OPS - Online Product Store - v1.0 |');
    console.log('+-----------------------------------+');
}

/**
* Muestra las instrucciones de uso (comandos y parametros)
*/
function mostrarAyuda() {
    console.log('\nUso: npm run start <comando> <parametros>\n');
    console.log('Comandos disponibles:');
    console.log('- GET products - Obtiene la lista completa de productos.');
    console.log('- GET products/<id> - Obtiene el producto indicado por <id>.');
    console.log('- POST products <title> <price> <category> - Crea un nuevo producto (entrecomillar palabras que contengan espacios).');
    console.log('- DELETE products/<id> - Elimina el producto indicado por <id>.');
    console.log();
}

/**
* Muestra un mensaje de error y las instrucciones de uso
* @param {string} error - Mensaje de error a mostrar
*/
function mostrarError(error) {
    mostrarAplicacion();
    console.log(`\n*** Error: ${error} ***`);
}

/**
* Verifica los argumentos proporcionados en la línea de comandos
* y valida que sean correctos para el comando especificado
* @param {string[]} args - Argumentos de la línea de comandos
* @returns {boolean} - Retorna true si los argumentos son válidos, false en caso contrario
*/
function verificarArgumentos(args) {
    
    // Verifica si se proporcionaron al menos 2 argumentos
    if (args.length < 2) {
        mostrarError('Debes proporcionar al menos dos argumentos: un comando y otro parametro.');
        return false;
    }
    
    // Obtiene el comando del primer argumento (y lo convierte a mayúsculas)
    const comando = args[0].toUpperCase();
    args[0] = comando;

    // Verifica si el comando es válido
    if (!comandos.has(comando)) {
        mostrarError(`El comando '${comando}' no es válido. Los comandos válidos son: ${Array.from(comandos).join(', ')}.`);
        return false;
    }

    // Verifica que los comandos GET y DELETE tengan un solo parametro
    if ((comando === 'GET' || comando === 'DELETE') && args.length > 2) {
        mostrarError(`El comando '${comando}' debe tener solamente un parametro.`);
        return false;
    }

    // Descompone el segundo argumento en partes si contiene '/'
    const par1 = args[1].split('/');
    if (par1.length > 1) {
        args.splice(1, 1, ...par1);      
    }

    // Verifica si el segundo argumento es válido
    if (args[1] !== parametro1) {
        mostrarError(`El primer parametro debe iniciar con '${parametro1}'.`);
        return false;
    }

    // Verifica que el comando POST tenga al menos 4 parametros
    if (comando === 'POST' && args.length < 5) {
        mostrarError('El comando POST requiere 4 parametros.');
        return false;
    }

    // Verifica que el comando DELETE tenga un ID numerico finalizando su parametro
    if (comando === 'DELETE' && isNaN(args[2])) {
        mostrarError('El comando DELETE requiere un ID numerico finalizando su parametro.');
        return false;
    }

    // Verifica que el comando GET tenga un ID numerico como segundo parametro
    if (comando === 'GET' && args.length > 2 && isNaN(args[2])) {
        mostrarError('El comando GET products/<id> requiere un ID numerico finalizando su parametro.');
        return false;
    }

    // Todos los argumentos son válidos
    return true;
}


/**
 * Realiza una petición HTTP a la API indicada por la URI
* y muestra la respuesta en la consola.
* @async
* @param {String} URI - La URI de la API a la que se realizará la petición
* @param {object} config - Configuración de la petición HTTP (método, cabeceras, cuerpo)
*/
async function ejecutarPeticion(URI, config) {
    try {
        const respuesta = await fetch(URI, config);
        var data = await respuesta.json();
    } catch (error) {
        console.log(`Error al realizar la petición: ${error.message}`);
    } finally {
        console.log(data);
        console.log();
    }
}


// +-------------------+
// | Proceso Principal |
// +-------------------+
// Toma los argumentos de la línea de comandos a partir del 3er argumento
const args = process.argv.slice(2);

if (verificarArgumentos(args)){
    
    // Si los argumentos son válidos, se procede a ejecutar la petición    
    mostrarAplicacion();
    console.log();

    const method = args[0];
    var URI = URL;
    var id = '';
    var titulo = '';
    const producto = {};

    switch (method) {
        case 'GET':
            id = args[2] ? args[2] : '';
            if (id) { // Si se especifica un ID
                titulo = `Producto con ID: ${id}`;
                URI = `${URL}/${id}`;
            }
            else { // Si no se especifica un ID
                titulo = 'Lista completa de productos\n';
            }
            config.method = 'GET';
            break;
    
        case 'DELETE':
            id = args[2];
            titulo = `Eliminando producto con ID: ${id}`;
            URI = `${URL}/${id}`;
            config.method = 'DELETE';
            break;

        case 'POST':
            titulo = `Creando nuevo producto: ${args[2]}`;
            // Se crea un objeto producto con los datos proporcionados
            producto.title = args[2];
            producto.price = parseFloat(args[3]);
            producto.category = args[4];

            config.method = 'POST';
            config.headers = {
                'Content-Type': 'application/json'
            };
            config.body = JSON.stringify(producto);
            break;
            
        default:
            break;
    }

    // Se muestra el título y se ejecuta la petición
    console.log(titulo);
    ejecutarPeticion(URI, config);
}
else {
    // Si los argumentos no son válidos, se muestra la ayuda
    mostrarAyuda();
}
