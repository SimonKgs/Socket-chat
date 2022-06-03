// metemos express
const express = require('express')
const cors = require('cors');
const { chatController } = require('../sockets/chat-controller');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {};      

        //Middlewares
        this.middlewares();
        
        //Rutas de mi app
        this.routes();

        //eventos
        this.sockets();
    }

    middlewares(){
        
        //cors
        this.app.use( cors() );

        //Directorio publico
        this.app.use( express.static('public'));

    }

    routes(){
        
        //this.app.use( this.paths.auth, require('../routes/auth'));

    }

    sockets(){

        this.io.on('connection', chatController);


    }
    //comprobar http://localhost:8080/socket.io/socket.io.js
    listen(){
        this.server.listen(this.port, () =>{
            console.log(`servidor corriendo en puerto ${this.port}`);
        });
    }
}

module.exports = Server;