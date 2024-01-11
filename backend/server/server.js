import express from 'express';
import logger from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import { Connection, Request, TYPES } from 'tedious';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);

let totalDevices = 0;
const dynamicDevices = {};

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../../frontend')));

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.set('views', path.join(__dirname, '../../frontend'));
app.use(express.static(path.join(__dirname, '../../frontend')));
app.set('view engine', 'ejs');

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
        database: 'ENERGYCONTROLLER',
        trustServerCertificate: true
    }
};

const connection = new Connection(config);
let resultRows = [];

connection.connect();

connection.on('connect', (err) => {
    if (err) {
        console.log("Error connecting to the database");
        throw err;
    }
    //getDevices();
    //getDevicesCount();
    
    setInterval(() => {
        getDevicesCount();
    }, 1000);

    generateDynamicDevices();

    
});

/*app.get('/', (req, res) => {
    res.render('client/homeClient',{ totalDevices: totalDevices }); 
});*/

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/admin/HomeAdmin.html'));
});

app.get('/client', (req, res) => {
    res.render('client/homeClient',{ totalDevices: totalDevices }); 
    res.sendFile(path.join(__dirname, '../../frontend/client/homeClient.html'));
});

app.get('/getDynamicDevices', (req, res) => {
    const filePath = path.join(__dirname, 'dynamicDevices.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading dynamicDevices file:", err.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        const dynamicDevices = JSON.parse(data);
        res.json(dynamicDevices);
    });
});

// Manejo del evento 'disconnect' en Socket.IO
io.on('disconnect', () => {
    console.log('Client disconnected');
    connection.close();
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        console.log('message: ' + msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

/*app.post('/addDevice', (req, res) => {
    const newDeviceData = req.body;
    console.log(newDeviceData);

    if (newDeviceData && newDeviceData.Name_d) {
        const insertRequest = new Request(`
        INSERT INTO DEVICE (ID, Category, Name_d, KWh, KgCO2h, Status_d, Room_ID) 
        VALUES (@ID, @Category, @Name_d, @KWh, @KgCO2h, @Status_d, @Room_ID);
        `, (err) => {
            if (err) {
                console.error("Error executing insertion query:", err.message);
                throw err;
            }

            getDevices();
            res.redirect('/');
        });

        insertRequest.addParameter('ID', TYPES.Int, newDeviceData.ID);
        insertRequest.addParameter('Name_d', TYPES.NVarChar, newDeviceData.Name_d);
        insertRequest.addParameter('Category', TYPES.NVarChar, newDeviceData.Category);
        insertRequest.addParameter('KWh', TYPES.Int, newDeviceData.KWh);
        insertRequest.addParameter('KgCO2h', TYPES.Float, newDeviceData.KgCO2h);
        insertRequest.addParameter('Status_d', TYPES.NVarChar, newDeviceData.Status_d);
        insertRequest.addParameter('Room_ID', TYPES.Int, newDeviceData.Room_ID);

        connection.execSql(insertRequest);
    } else {
        console.error("Invalid device data");
        res.redirect('/error');
    }
});

app.post('/deleteDevice', (req, res) => {
    const deviceId = req.body.ID;

    if (deviceId) {
        const deleteRequest = new Request(`
            DELETE FROM DEVICE
            WHERE ID = @ID;
        `, (err) => {
            if (err) {
                console.error("Error executing deletion query:", err.message);
                throw err;
            }

            getDevices();
            res.redirect('/');
        });

        deleteRequest.addParameter('ID', TYPES.Int, deviceId);

        connection.execSql(deleteRequest);
    } else {
        console.error("Invalid device ID");
        res.redirect('/error');
    }
});

app.post('/updateDevice', (req, res) => {
    const newDeviceData = req.body;
    console.log(newDeviceData);

    if (newDeviceData && newDeviceData.Name_d) {
        const updateRequest = new Request(`
        UPDATE DEVICE SET Name_d = @Name_d, Category = @Category, KWh = @KWh, KgCO2h = @KgCO2h, Status_d = @Status_d, Room_ID = @Room_ID
        WHERE ID = @ID;
        `, (err) => {
            if (err) {
                console.error("Error executing update query:", err.message);
                throw err;
            }

            getDevices();
            res.redirect('/');
        });

        updateRequest.addParameter('ID', TYPES.Int, newDeviceData.ID);
        updateRequest.addParameter('Name_d', TYPES.NVarChar, newDeviceData.Name_d);
        updateRequest.addParameter('Category', TYPES.NVarChar, newDeviceData.Category);
        updateRequest.addParameter('KWh', TYPES.Int, newDeviceData.KWh);
        updateRequest.addParameter('KgCO2h', TYPES.Float, newDeviceData.KgCO2h);
        updateRequest.addParameter('Status_d', TYPES.NVarChar, newDeviceData.Status_d);
        updateRequest.addParameter('Room_ID', TYPES.Int, newDeviceData.Room_ID);

        connection.execSql(updateRequest);
    } else {
        console.error("Invalid device data");
        res.redirect('/error');
    }
});


function getDevices() {
    console.log("Connected to the database")
    const request = new Request("SELECT * FROM DEVICE", (err, rowCount) => {
        if (err) {
            console.log("Error executing query:", err.message);
            throw err;
        }
    });

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
        console.log("All rows:", resultRows);
        io.emit('queryResult', resultRows);
    });

    request.on('done', (rowCount, more, rows) => {
        connection.close();
    });

    connection.execSql(request);
}*/


function getDevicesCount() {
    console.log("Connected to the database")
    const request = new Request("SELECT COUNT(*) AS TotalDevices FROM DEVICE", (err, rowCount) => {
        if (err) {
            console.log("Error executing query:", err.message);
            throw err;
        }
    });

    request.on('row', (columns) => {
        totalDevices = columns[0].value;
    });

    request.on('doneInProc', (rowCount, more, rows) => {
        console.log("Total Devices:", totalDevices);
        io.emit('totalDevices', totalDevices); // Envía el total de dispositivos al cliente
    });

    request.on('done', (rowCount, more, rows) => {
        connection.close();
    });

    connection.execSql(request);
}

function saveDynamicDevicesToFile() {
    const filePath = path.join(__dirname, 'dynamicDevices.json');
    const jsonData = JSON.stringify(dynamicDevices, null, 2);

    fs.writeFileSync(filePath, jsonData, 'utf-8');

    console.log(`Dynamic devices saved to ${filePath}`);
}


function generateDynamicDevices() {
    const request = new Request("SELECT Category, COUNT(*) AS DeviceCount FROM DEVICE GROUP BY Category", (err, rowCount) => {
        if (err) {
            console.log("Error executing query:", err.message);
            throw err;
        }
    });

    request.on('row', (columns) => {
        const category = columns[0].value;
        const deviceCount = columns[1].value;

        dynamicDevices[category] = {
            icon: `icon-${category.charAt(0).toUpperCase()}${category.slice(1)}.png`,
            title: category.charAt(0).toUpperCase() + category.slice(1),
            value: deviceCount.toString(),  // Establece el valor como la cuenta real de dispositivos
        };

        // Log the dynamically generated device for each category
        console.log(`Generated device for category '${category}':`, dynamicDevices[category]);
    });

    request.on('doneInProc', (rowCount, more, rows) => {
        io.emit('dynamicDevices', dynamicDevices); // Envía las categorías generadas dinámicamente al cliente
        saveDynamicDevicesToFile(); // Guarda dynamicDevices en un archivo
    });

    connection.execSql(request);
}
