const {
    io
} = require('../index')
const Bands = require('../models/bands')
const Band = require('../models/band')
const bands = new Bands()

bands.addBand(new Band('Queen'))
bands.addBand(new Band('Bon jovi'))
bands.addBand(new Band('Héroes del silencio'))
bands.addBand(new Band('Metallica'))

io.on('connection', client => {
    console.log("Cliente conectado");

    client.emit('active-bands', bands.getBands())

    client.on('disconnect', () => {
        console.log("cliente desconectado");
    });

    client.on('mensaje', (data) => {

        io.emit("mensaje", {
            admin: 'Nuevo mensaje'
        })
    })
    client.on('emitir-mensaje', (data) => {
        client.broadcast.emit("emitir-mensaje", data)
    })

    client.on('nuevo-mensaje', (data) => {
        client.broadcast.emit("nuevo-mensaje", data)
    })
    client.on('vote-band', (data) => {
        bands.voteband(data.id)
        io.emit('active-bands', bands.getBands())
    })
    client.on('add-band', (data) => {
        const newBand = new Band(data.name)
        bands.addBand(newBand)
        io.emit('active-bands', bands.getBands())
    })
    client.on('delete-band', (data) => {
        bands.deleteBand(data.id)
        io.emit('active-bands', bands.getBands())
    })
});