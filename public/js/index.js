let eventType;

$('#btnDone').hide();
$('#id').hide();
$('#content').hide();
$('#autor').hide();
$('#title').hide();

function loadComments() {
    let url = '/blog-api/comentarios';
    $.ajax({
        type: "GET",
        url: url,
        success: function (response) {
            displayComments(response);
        }
    });
}

function displayComments(comments) {
    $.each(comments, function (indexInArray, comment) {
        $('.commentsList').append(
            '<div class ="comment">' +
            '<li>' + comment.id + '</li>' +
            '<li>' + comment.titulo + '</li>' +
            '<li>' + comment.contenido + '</li>' +
            '<li>' + comment.autor + '</li>' +
            '<li>' + comment.fecha + '</li>' +
            '</div>'
        );
    });
}

function displayFind(element) {
    $('#interaction').empty();
    $('#interaction').append(
        '<div class ="comment">' +
        '<li>' + element.id + '</li>' +
        '<li>' + element.titulo + '</li>' +
        '<li>' + element.contenido + '</li>' +
        '<li>' + element.autor + '</li>' +
        '<li>' + element.fecha + '</li>' +
        '</div>'
    );
}

function findComment(autor) {
    let url = '/blog-api/comentarios-por-autor?autor=' + autor;
    $.ajax({
        type: "GET",
        url: url,
        success: function (response) {
            displayFind(response);
        },
        error: function (jqXHR, status, error) {
            alert(jqXHR + " " + error + " " + status);
        }
    });
}

function createComment(params) {
    console.log(JSON.stringify(params));
    let url = '/blog-api/nuevo-comentario';
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(params),
        dataType: "json",
        cache: false,
        contentType: "application/json",
        success: function (response) {
            displayFind(response);
        },
        error: function (jqXHR, status, error) {
            alert(status + " " + error);
        }
    });
}

function deleteComment(params) {
    let url = '/blog-api/remover-comentario/' + params;
    $.ajax({
        type: "DELETE",
        url: url,
        success: function (response) {
            alert('Comentario borrado con exito');
            location.reload();
        },
        error: function (jqXHR, status, error) {
            alert(status + " " + error);
        }
    });
}

function editComment(params) {
    let url = '/blog-api/actualizar-comentario/' + params.id;

    $.ajax({
        type: "PUT",
        url: url,
        data: JSON.stringify(params),
        dataType: "json",
        cache: false,
        contentType: "application/json",
        success: function (response) {
            alert('Comentario actualizado con exito');
            location.reload();
        }
    });
}

function handleDone(params, type) {
    switch (type) {
        case 'find':
            findComment(params);
            break;

        case 'create':
            createComment(params);
            break;

        case 'delete':
            deleteComment(params);

        case 'edit':
            editComment(params);

        default:
            break;
    }
}

$(document).ready(function () {
    loadComments();
});

$('#find').on('click', function () {
    eventType = 'find';

    $('#id').hide(400);
    $('#title').hide(400);
    $('#content').hide(400);
    $('#autor').show(400);
    $('#btnDone').show(400);
});

$('#create').on('click', function () {
    eventType = 'create';

    $('#id').hide(400);
    $('#title').show(400);
    $('#content').show(400);
    $('#autor').show(400);
    $('#btnDone').show(400);
});

$('#delete').on('click', function () {
    eventType = 'delete';

    $('#title').hide(400);
    $('#content').hide(400);
    $('#autor').hide(400);
    $('#id').show(400);
    $('#btnDone').show(400);
});

$('#edit').on('click', function () {
    eventType = 'edit';

    $('#id').show(400);
    $('#title').show(400);
    $('#content').show(400);
    $('#autor').show(400);
    $('#btnDone').show(400);
});


$('#btnDone').on('click', function () {
    let type = eventType;
    switch (type) {
        case 'find':
            handleDone($('#commentAutor').val(), eventType);
            break;

        case 'create':
            handleDone({
                titulo: $('#commentTitle').val(),
                contenido: $('#commentContent').val(),
                autor: $('#commentAutor').val()
            }, eventType);
            break;

        case 'delete':
            handleDone($('#commentId').val(), eventType);
            break;


        case 'edit':
            handleDone({
                id: $('#commentId').val(),
                titulo: $('#commentTitle').val(),
                contenido: $('#commentContent').val(),
                autor: $('#commentAutor').val()
            }, eventType);
            break;

        default:
            break;
    }

})