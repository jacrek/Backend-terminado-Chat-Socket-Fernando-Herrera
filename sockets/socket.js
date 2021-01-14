const { io } = require('../index');
const { comprobatJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    console.log(client.handshake.headers['x-token']);
    const [valido, uid] = comprobatJWT(client.handshake.headers['x-token'])
        // const valido

    //verificar autentificacion
    if (!valido) {
        return client.disconnect();
    }


    // cliente autenticado
    console.log('cliente autenticado ');
    usuarioConectado(uid);

    //Ingresr al usuario a una sala en particular
    //sala global, client.id, 
    client.join(uid);

    //Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal', async(payload) => {
        console.log(payload);

        //TODO: Grabar mensaje
        await grabarMensaje(payload);

        io.to(payload.para).emit('mensaje-personal', payload);
    })




    // client.to(uid);



    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });



    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje', payload);
    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
    // });


});