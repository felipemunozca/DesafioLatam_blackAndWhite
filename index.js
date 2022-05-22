const http = require("http");
const url = require('url');
const fs = require("fs");
const Jimp = require("jimp");
const yargs = require('yargs');

const contrasena = "123";

const argv = yargs.command('validar', 'validar si la contraseña ingresada es igual a la solicitada por el desafio', 
{
    key: {
        describe: 'Contraseña para usar el programa.',
        alias: 'k',
    },
},
(args) => {

    if (args.key == contrasena) {

        console.log('key correcta, bienvenido')
        
        http
        .createServer((req, res) => {
            if (req.url == "/") {
                res.writeHead(200, { "Content-Type": "text/html" });
                fs.readFile("index.html", "utf8", (err, html) => {
                    res.end(html);
                });
            }

            if (req.url == "/estilos") {
                res.writeHead(200, { "Content-Type": "text/css" });
                fs.readFile("styles.css", (err, css) => {
                    res.end(css);
                });
            }

            if (req.url.includes('/imagen')) {

                const params = url.parse(req.url, true).query;
                const urlImagen = params.imagen;

                Jimp.read(urlImagen)

                .then((imagen) => {
                    console.log('procesando imagen...')
                    return imagen
                    .resize(350, Jimp.AUTO)
                    .quality(60) 
                    .greyscale()
                    .write("newImg.jpg");
                }).then(() =>{
                    console.log('guardando imagen en el servidor...')
                    fs.readFile("newImg.jpg", (err, img) => {
                        res.writeHead(200, {'content-type': 'image/jpeg'})
                        res.end(img);
                    })
                })
                .catch((err) => {
                    console.error(err);
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