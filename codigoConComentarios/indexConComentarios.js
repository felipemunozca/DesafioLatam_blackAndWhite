/* declaro los paquetes que utilizare en el desarrollo del desafio. */
const http = require("http");
const url = require('url');
const fs = require("fs");
const Jimp = require("jimp");
const yargs = require('yargs');

/* creo una constante en donde almacenare la contraseña de debe tener la key. */
const contrasena = "123";

/* argv es la forma mas comun de declarar esta variable. 
Se utiliza para obtener los argumentos que se procesan con NODEJS cuando se ejecuta en la línea de comandos. */
/* declaro el metodo command() el cual recibe un string como primer parametro. */
/* despues se debe agregar una descripcion. */
/* lo siguiente es crear un objeto para construir las diferentes caracteristicas para el saludo. */
const argv = yargs.command('validar', 'validar si la contraseña ingresada es igual a la solicitada por el desafio', 
{
    key: {
        describe: 'Contraseña para usar el programa.',
        alias: 'k',
    },
},
/* args es la forma mas comun de declarar esta variable. Significa "Arguments" */
(args) => {

    if (args.key == contrasena) {

        console.log('key correcta')
        
        http
        .createServer((req, res) => {
            if (req.url == "/") {
                res.writeHead(200, { "Content-Type": "text/html" });
                fs.readFile("index.html", "utf8", (err, html) => {
                    res.end(html);
                });
            }

            /* utilizo req para posicionarme en la ruta que me va a devolver el styles.css. */
            if (req.url == "/estilos") {
                /* Se especifica en la cabecera un codigo 200 para indicar que esta OK y el formato es de tipo CSS. */
                res.writeHead(200, { "Content-Type": "text/css" });
                fs.readFile("styles.css", (err, css) => {
                    res.end(css);
                });
            }

            /* El path o ruta "/imagen" que es llamado desde el formulario en el index.html */
            if (req.url.includes('/imagen')) {

                /* Constantes para obtener la url de la imagen desde el formulario */
                /* url.parse() Analisa la direccion y devuelve un objeto URL con cada parte de la direccion como propiedades. */
                const params = url.parse(req.url, true).query;
                const urlImagen = params.imagen;

                /* Jimp leera el path o ruta de la imagen. */
                Jimp.read(urlImagen)

                /* utilizo un .then y .catch para capturar el error en caso que exista un problema con la url.  */
                .then((imagen) => {
                    console.log('procesando imagen...')
                    return imagen
                    .resize(350, Jimp.AUTO) //medidas en pixeles, el primer valor corresponde al ancho, el segundo al alto.
                    .quality(60) //calidad de la imagen en porcentaje.
                    .greyscale() //escala de grises
                    .write("newImg.jpg"); //guardo la imagen con nombre y formato en la raiz del programa.
                }).then(() =>{
                    console.log('guardando imagen en el servidor...')
                    /* leo la imagen que guarde anteriormente. */
                    fs.readFile("newImg.jpg", (err, img) => {
                        /* Se especifica en la cabecera un codigo 200 para indicar que esta OK y el formato image/jpeg */
                        res.writeHead(200, {'content-type': 'image/jpeg'})
                        /* finalizo la comunicacion y levanto la variable img que es la que esta leyendo la imagen en la raiz. */
                        res.end(img);
                    })
                })
                .catch((err) => {
                    console.error(err);
                    /* Se especifica en la cabecera un codigo 500 para indicar que existe un error del lado del servidor. */
                    res.writeHead(500, {'content-type': 'text/html'})
                    res.write("<p>ha ocurrido un error al procesar la imagen</p>");
                    res.end();
                });

            }
        })
        .listen(3000, () => console.log("Servidor encendido en http://localhost:3000"));
    } else {
        console.log('La key ingresada no es valida. \nFavor de escribirla nuevamente')
    }

}).help().argv;


/* para ejecutar el programa, se debe escribir el siguiente comando en la terminal */
/* node index.js validar --key 123 */