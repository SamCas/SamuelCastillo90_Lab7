let uuid = require('uuid');
let express = require('express');
let morgan = require('morgan');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

let {
    CommentList
} = require('./model');

let {
    DATABASE_URL,
    PORT
} = require('./config');

let app = express();
app.use(express.static('public'));
app.use(morgan('dev'));

let comments = [{
    id: uuid(),
    titulo: "Bye bye London",
    contenido: "Yes, this is my post.",
    autor: "Samuel",
    fecha: "2020-03-01"
}, {
    id: 1236213724,
    titulo: "ID Estatico",
    contenido: "Content.",
    autor: "Hola Mundo",
    fecha: "2020-12-03"
}, {
    id: uuid(),
    titulo: "New Comment",
    contenido: null,
    autor: "Manuel",
    fecha: "2020-01-11"
}];

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    if (req.method === "OPTIONS") {
        return res.send(204);
    }
    next();
});

app.get('/blog-api/comentarios', (req, res) => {
    CommentList.getAll()
        .then(commentList => {
            return res.status(200).json(commentList);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = "Hubo un error de conexion con la BD."
            return res.status(500).send();
        });
});

app.get('/blog-api/comentarios-por-autor', (req, res) => {
    let autor = req.query.autor;

    if (isBlank(autor)) {
        return res.status(406).send('Ingrese un autor valido.');
    } else {
        CommentList.findComment(autor)
            .then(comment => {
                return res.status(201).json(comment);
            })
            .catch(error => {
                res.statusMessage = "Error en conexión con la base de datos";
                return res.status(500).json(error);
            });
    }
});

app.post('/blog-api/nuevo-comentario', jsonParser, (req, res) => {
    let newComment = {
        id: uuid(),
        titulo: req.body.titulo,
        contenido: req.body.contenido,
        autor: req.body.autor,
        fecha: Date()
    }

    if (isBlank(newComment.titulo) || isBlank(newComment.autor)) {
        return res.status(406).send('Titulo o autor no valido.');
    } else {
        CommentList.create(newComment)
            .then(comment => {
                return res.status(201).json(comment);
            })
            .catch(error => {
                res.statusMessage = "Error en conexión con la base de datos";
                return res.status(500).json(error);
            });
    }
});

app.delete('/blog-api/remover-comentario/:id', jsonParser, (req, res) => {
    let commentToDelete = req.params.id;

    if (isBlank(commentToDelete)) {
        return res.status(404).send('No se encontro ningun comentario con ese id.');
    } else {
        CommentList.deleteComment(commentToDelete)
            .then(comment => {
                return res.status(201).json(comment);
            })
            .catch(error => {
                res.statusMessage = "Error en conexión con la base de datos";
                return res.status(500).json(error);
            });
    }
});

app.put('/blog-api/actualizar-comentario/:id', jsonParser, (req, res) => {
    let commentToUpdate = {
        id: req.body.id,
        titulo: req.body.titulo,
        autor: req.body.autor,
        fecha: Date()
    }

    console.log(commentToUpdate);

    if (isBlank(commentToUpdate.id)) {
        return res.status(406).send('No se encontro id en el cuerpo.');
    } else {
        if (commentToUpdate.id == req.params.id) {
            if (isBlank(commentToUpdate.id) && isBlank(commentToUpdate.titulo) && isBlank(commentToUpdate.autor) && isBlank(commentToUpdate.fecha)) {
                return res.status(406).send('Es necesario colocar valores a actualizar.');
            } else {
                CommentList.updateComment(commentToUpdate)
                    .then(comment => {
                        return res.status(201).json(comment);
                    })
                    .catch(error => {
                        res.statusMessage = "Error en conexión con la base de datos";
                        return res.status(500).json(error);
                    });
            }
        } else {
            return res.status(406).send('El id del cuerpo no coincide con el de los parametros.');
        }
    }
});

function isBlank(param) {
    if (param == undefined || param == null || param == "" || param == " ") {
        return true;
    } else {
        return false;
    }
}

let server;

function runServer(port, databaseUrl) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, response => {
            if (response) {
                return reject(response);
            } else {
                server = app.listen(port, () => {
                        console.log("App is running on port " + port);
                        resolve();
                    })
                    .on('error', err => {
                        mongoose.disconnect();
                        return reject(err);
                    })
            }
        });
    });
}

function closeServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close(err => {
                    if (err) {
                        return reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });
}

runServer(PORT, DATABASE_URL);

module.exports = {
    app,
    runServer,
    closeServer
}