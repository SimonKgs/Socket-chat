const socket = io();

const lblOffline = document.querySelector('#lblOffline');
const lblOnline = document.querySelector('#lblOnline');



socket.on('connect', () => {

    lblOffline.style.display = 'none';
    lblOnline.style.display = '';

    console.log('conectado al servidor');
    
});

socket.on('disconnect', () => {

    lblOnline.style.display = 'none';
    lblOffline.style.display = '';
    
});