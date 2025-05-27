// +==================================+
// | Talento Tech - C#25024 - Node.JS |
// +==================================+

// +------------------------------+
// | Proyecto Final (pre-entrega) |
// |     Jose Luis Gonzalez       |
// +------------------------------+

const comandos = new Set([
    'GET',
    'POST',
    'DELETE'
]);

const parametro1 = 'products'

// Muestra las instrucciones de uso (comandos y parametros)
function mostrarAyuda() {
    console.log('Uso: npm run start <comando> <parametros>\n');
    console.log('Comandos disponibles:');
    console.log('- GET products - Obtiene la lista completa de productos.');
    console.log('- GET products/<id> - Obtiene el producto indicado por <id>.');
    console.log('- POST products <title> <price> <category> - Crea un nuevo producto (entrecomillar palabras que contengan espacios).');
    console.log('- DELETE products/<id> - Elimina el producto indicado por <id>.');
    console.log();
}


function mostrarError(error) {
    console.error(`*** Error: ${error} ***\n`);
    mostrarAyuda();
}

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

// Toma los argumentos de la línea de comandos a partir del 3er argumento
const args = process.argv.slice(2);

if (verificarArgumentos(args)){
    console.log('OK\n');
    
}
