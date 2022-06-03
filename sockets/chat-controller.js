const { Usuarios } = require('../models/usuarios');
const { crearMensaje } = require('../helpers/helperMSG');

const usuarios = new Usuarios();

const chatController = (client) => {

    client.on('entrarChat', ( data, callback ) => {

        if (!data.nombre || !data.sala){

            return callback({ error: true, msg: 'el nombre y la sala son necesarios - controller'});

        }

        client.join( data.sala);

        const existe = usuarios.existePersona( data.nombre );
        //TODO -> viene de socket chat
        if (existe){
            return callback(false);
        }

        usuarios.agregarPersona( client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasSala(data.sala) );

        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje( 'Administrador: ', `${ data.nombre } se unió al chat`));

        callback( usuarios.getPersonasSala( data.sala ) );

    });

    

    client.on('crearMensaje', ( data, callback ) => {

        let persona = usuarios.getPersona(client.id);

        if (data.msg || !data.msg === ''){
            let msg = crearMensaje( persona.nombre, data.msg);
            //client.emit( 'crearMensaje', msg); lo muestra al user que lo envia
            client.broadcast.to(persona.sala).emit( 'crearMensaje', msg);

            callback( msg );
        }
    });

    //mensajes privados
    client.on('mensajePrivado', data => {
        
        let persona = usuarios.getPersona( client.id );
        if (data.msg || !data.msg === ''){
            client.broadcast.to(data.para).emit( 'mensajePrivado', crearMensaje( persona.nombre, data.msg ) );
        }
    });


    client.on('disconnect', () =>{

        let personaBorrada = usuarios.deletePersona( client.id );
     
        if (personaBorrada){
            client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje( 'Administrador: ', `${ personaBorrada.nombre } abandonó el chat`));
            client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasSala( personaBorrada.sala ));
        }
    });

}




module.exports = {
    chatController
}