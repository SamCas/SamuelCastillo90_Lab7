let uuid = require('uuid');
let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

let app = express();
app.use(express.static('public'));
app.use(morgan('dev'));

let comments = [{
    id: uuid(),
    titulo: "Bye bye London",
    contenido: "Yes, this is my post.",
    autor: "Samuel",
    fecha: "2020-03-01"
},{
    id: 1236213724,
    titulo: "ID Estatico",
    contenido: "Content.",
    autor: "Hola Mundo",
    fecha: "2020-12-03"
},{
    id: uuid(),
    titulo: "New Comment",
    contenido: null,
    autor: "Manuel",
    fecha: "2020-01-11"
}];

app.listen(8080, () => {
    console.log('Corriendo servidor en puerto 8080.');
});

app.get('/blog-api/comentarios', (req, res) => {
    res.status(200).json(comments);
});

app.get('/blog-api/comentarios-por-autor', (req, res) => {
    let autor = req.query.autor;
    
    if(isBlank(autor)){
        return res.status(406).send('Ingrese un autor valido.');
    }else{
        let findAutor = comments.find((comment) => comment.autor == autor);
        if(isBlank(findAutor)){
            return res.status(406).send('No se encontro ningun autor o no hay ningun commentario.');
        }
        return res.status(200).json(findAutor);
    }
});

app.post('/blog-api/nuevo-comentario',jsonParser,(req, res) => {
    let newComment = {
        id : uuid(),
        titulo : req.body.titulo,
        contenido: req.body.contenido,
        autor : req.body.autor,
        fecha : Date()
    }

    console.log(newComment);

    if(isBlank(newComment.titulo) || isBlank(newComment.autor)){
        return res.status(406).send('Titulo o autor no valido.');
    }else{
        comments.push(newComment);
        return res.status(200).json(newComment);
    }
});

app.delete('/blog-api/remover-comentario/:id',jsonParser,(req, res) => {
    let commentToDelete = req.params.id;
  
    if(isBlank(commentToDelete)){
        return res.status(404).send('No se encontro ningun comentario con ese id.');
    }else{
        comments = comments.filter((comment) => comment.id != commentToDelete);  
        return res.status(200).send('El comentario se borro con exito.');
    }
});

app.put('/blog-api/actualizar-comentario/:id',jsonParser,(req, res) => {
    let commentToUpdate = {
        id : req.body.id,
        titulo : req.body.titulo,
        autor : req.body.autor,
        fecha : Date()
    }

    console.log(commentToUpdate);

    if(isBlank(commentToUpdate.id)){
        return res.status(406).send('No se encontro id en el cuerpo.');
    }else{
        if(commentToUpdate.id == req.params.id){
            if(isBlank(commentToUpdate.id) && isBlank(commentToUpdate.titulo) && isBlank(commentToUpdate.autor) && isBlank(commentToUpdate.fecha)){
                return res.status(406).send('Es necesario colocar valores a actualizar.');
            }else{
                var foundIndex = comments.findIndex(comment => comment.id == commentToUpdate.id);
                console.log(foundIndex);
                comments[foundIndex] = {...comments[foundIndex], ...commentToUpdate};
                return res.status(202).send('Comentario actualizado con exito.');
            }
        }else{
            return res.status(406).send('El id del cuerpo no coincide con el de los parametros.');
        }
    }
});

function isBlank(param) {
    if(param == undefined || param == null || param == "" || param == " "){
        return true;
    }else{
        return false;
    }
}