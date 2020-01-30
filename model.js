let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let commentCollection = mongoose.Schema({
    id: {
        type: String
    },
    titulo: {
        type: String
    },
    contenido: {
        type: String
    },
    autor: {
        type: String
    },
    fecha: {
        type: Date
    }
});

let Comment = mongoose.model('comments', commentCollection);

let CommentList = {
    getAll: function () {
        return Comment.find()
            .then(comments => {
                return comments;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    create: function (newComment) {
        return Comment.create(newComment)
            .then(comment => {
                return comment;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    findComment: function (autorName) {
        return Comment.findOne({
                autor: autorName
            })
            .then(comment => {
                return comment;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    deleteComment: function (id) {
        return Comment.deleteOne({
                id: id
            })
            .then(comment => {
                return comment;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    updateComment: function (commentToUpdate) {
        return Comment.updateOne({
                id: commentToUpdate.id
            }, commentToUpdate)
            .then(comment => {
                return comment;
            })
            .catch(error => {
                throw Error(error);
            });
    }
};

module.exports = {
    CommentList
};