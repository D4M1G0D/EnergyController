import express from 'express'
import logger from 'morgan'
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'node:http'
import { Server } from 'socket.io'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT ?? 3000;
const app = express();
const server = createServer(app)
const io = new Server(server)

app.use(logger('dev'));
server.listen(port, () => { console.log(`Started at ${port}`); })




app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, '../../frontend/client/chat.html'));

});



io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg) // <-----
        console.log('message: ' + msg)
        })
    socket.on('disconnect', () => {
    console.log('user disconnected')
    })

})
