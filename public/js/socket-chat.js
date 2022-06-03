const socket = io();

let params = new URLSearchParams( window.location.search);

if ( !params.has('nombre') || params.get('nombre') === '' || !params.has('sala') || params.get('sala') === '' ){
    
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios - chat');

}

const usuario = {

    nombre: params.get('nombre'),
    sala: params.get('sala'),

}
//TODO resp renderizar usuarios -> chat-controller
socket.on('connect', () => {

    socket.emit('entrarChat', usuario, ( resp ) => {

        // console.log( 'Usuarios conectados ', resp);
        if ( resp === false ){
            console.log('respuesta false')
            window.location = 'index.html';
        }else {
            renderizarUsuarios(resp);
        }
    });
    
});
//Envio de mensajes
//socket.emit()


//Escuchar información
socket.on('crearMensaje', (msg) => {
    //console.log('Server: ', msg);
    renderizarMsgs( msg, false );
    scrollBottom();

});
//escuchar cambio de usuarios
socket.on('listaPersonas', ( personas ) => {

    renderizarUsuarios( personas );
    
});

// escucha mensajes privados
socket.on('mensajePrivado', ( msg ) => {

    console.log(' mensaje privado: ', msg );

});

socket.on('disconnect', () => {

    
});

