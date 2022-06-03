
const paramsJ = new URLSearchParams( window.location.search);

let nombre = paramsJ.get('nombre');
const sala = paramsJ.get('sala');

//referencias jquery
const divUsuarios = $('#divUsuarios');
const formEnviar = $('#formEnviar');
const txtMensaje = $('#txtMensaje');
const chatBox = $('#chatBox');
const barra = document.querySelector('#cuadroTxt');
const tituloSala = $('#tituloSala');

const renderizarUsuarios = ( personas ) => {

    console.log( ' renderizar usuarios ', personas );

    let html = "";

    html += `<hr><li>
                <a href="javascript:void(0)" name="${ paramsJ.get('sala')}" onclick="obtenerSala(this.name)"> chat de <span> ${ paramsJ.get('sala') }</span></a>
            </li><hr>`;

    for ( let persona of personas){
        // <img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"></img> Si queremos poner imagenes, habria que añadir la subida de archivos etc.......
        html += `<li>
                    <a name="${ persona.id }" onclick="obtenerId(this.name);" href="javascript:void(0)"><span>${ persona.nombre } - 
                    <small class="text-success">online</small></span></a>
                </li>`;

    }
    tituloSala.html(`Sala de ${ paramsJ.get('sala')}`)
    divUsuarios.html(html);

}
//Podriamos unificar estos 2 en obtener lugar¿?
//-------------------------------------------------
const obtenerSala= ( sala ) => {

    console.log( sala );

}

const obtenerId = ( id ) => {

    console.log( id );

}

//--------------------------------------------------


const renderizarMsgs = ( msg, yo ) => {

    let html = '';

    let fecha = new Date( msg.fecha );
    let hora = fecha.getHours() + ':' + fecha.getMinutes();

    let adminClass = "alert alert-dismissible alert-info";
    let adminName = "text-primary";

    if ( msg.nombre === 'Administrador: '){
        adminClass = 'alert alert-dismissible alert-danger';
        adminName = "text-danger";
    }

    if ( yo ){
        
        html+=  `<li>
                    <div class="bloque">
                        <div class="l">
                            <h5 class="text-secondary">${msg.nombre}</h5>
                            <div class="alert alert-dismissible alert-light">${ msg.msg }</div>
                        </div>
                        <div class="">${ hora }</div>
                    </div>
                </li>`;

    } else {

        html+=  `<li>
                    <div class="bloque">
                        <div class="l"> 
                            <h5 class="${ adminName }">${ msg.nombre }</h5>
                            <div class="${ adminClass }">${ msg.msg }</div>
                        </div>
                        <div class="l">${ hora }</div>
                    </div>
                </li>`;

    }

    chatBox.append(html);
}

const scrollBottom = () => {

    barra.scrollTop = barra.scrollHeight - barra.clientHeight;
}


//Listeners
formEnviar.on('submit', ( event ) => {

    event.preventDefault();
    if (txtMensaje.val().trim().length === 0){
        return;
    }
    // console.log( txtMensaje.val());

    socket.emit('crearMensaje', {
        nombre,
        msg: txtMensaje.val(),

    }, ( msg ) => {
        txtMensaje.val('').trigger('focus');
        renderizarMsgs( msg, true );
        scrollBottom();
    });

});
