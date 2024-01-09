const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

const config = {
    server: 'srv-polimusic-g1-wr.database.windows.net',
    authentication: {
        type: 'default',
        options: {
            userName: "usr_polimusic_sa",
            password: "EpnFis01"
        }
    },
    options: {
        port: 1433,
        database: 'ENERGYCONTROLLER',
        trustServerCertificate: true
    }
};

const connection = new Connection(config);
let resultRows = []; // Declarar resultRows a nivel superior

connection.connect();

connection.on('connect', (err) => {
    if (err) {
        console.log("Error al conectarse a la base de datos");
        throw err;
    }
    getDevices();
});

app.set('views', __dirname + '/../frontend/admin');
app.use(express.static(__dirname + '/../frontend/admin'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // Renderizar la vista 'index' y pasar los datos de resultRows
    res.render('deviceTable', { devices: resultRows });
});

/***************************AGREGAR DISPOSITIVO  **********************************************/

app.get('/addDevice', (req, res) => {
    res.render('addDevice'); // Renderiza la vista 'addDevice'
});

app.post('/addDevice', (req, res) => {
    // Aquí debes procesar los datos del formulario enviado desde addDevice.ejs
    // Los datos del formulario estarán disponibles en req.body
    const newDeviceData = req.body; // Asegúrate de tener el middleware body-parser configurado

    // Realiza la lógica para insertar el nuevo dispositivo en la base de datos
    // ...

    // Redirige a la página principal después de agregar el dispositivo
    res.redirect('/');
});

/************************************ FIN AGREGAR DISPOSITIVO *********************************************/
function getDevices() {
    console.log("Conectado a la base de datos")
    const request = new Request("SELECT * FROM DEVICE", (err, rowCount) => {
        if (err) {
            console.log("Error al ejecutar el query:", err.message);
            throw err;
        }

        // Cerrar la conexión solo después de que la solicitud se haya completado
        connection.close();
    });

    // Limpiar resultRows antes de cada ejecución
    resultRows = [];

    request.on('row', (columns) => {
        const row = {};
        columns.forEach((column) => {
            row[column.metadata.colName] = column.value;
        });
        resultRows.push(row);
        console.log(resultRows);
    });

    request.on('doneInProc', (rowCount, more, rows) => {
        // Hacer algo con las filas después de que se han recibido
        console.log("Todas las filas:", resultRows);
        // Puedes emitir el evento aquí si es necesario
        io.emit('queryResult', resultRows);
    });

    // Manejar el evento 'done' para cerrar la conexión después de que la solicitud se haya completado
    request.on('done', (rowCount, more, rows) => {
        connection.close();
    });

    connection.execSql(request);
}

http.listen(3000, () => {
    console.log('Server listening on port 3000');
});
