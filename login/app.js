// 1 - Invocamos a Express
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');

// Configuración de nodemailer para enviar correos electrónicos
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'deyvidcdv@gmail.com',
        pass: '02062000'
    }
});

//2 - Para poder capturar los datos del formulario (sin urlencoded nos devuelve "undefined")
app.use(express.urlencoded({extended:false}));
app.use(express.json());//además le decimos a express que vamos a usar json

//3- Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env'});

//4 -seteamos el directorio de assets
app.use('/resources',express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5 - Establecemos el motor de plantillas
app.set('view engine','ejs');

//6 -Invocamos a bcrypt
const bcrypt = require('bcryptjs');

//7- variables de session
const session = require('express-session');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


// 8 - Invocamos a la conexion de la DB
const connection = require('./database/db');

//9 - establecemos las rutas
	app.get('/login',(req, res)=>{
		res.render('login');
	})

	app.get('/register',(req, res)=>{
		res.render('register');
	})

	app.get('/recuperar', (req, res) => {
		res.render('recuperar');
	});
    app.get('/reset', (req, res) => {
        const token = req.query.token; // Puedes obtener el token de la URL
        res.render('reset', { token });
    });

//10 - Método para la REGISTRACIÓN
app.post('/register', async (req, res)=>{
	const user = req.body.user;
	const name = req.body.name;
    const rol = req.body.rol;
	const pass = req.body.pass;
	let passwordHash = await bcrypt.hash(pass, 8);
    connection.query('INSERT INTO users SET ?',{user:user, name:name, rol:rol, pass:passwordHash}, async (error, results)=>{
        if(error){
            console.log(error);
        }else{            
			res.render('register', {
				alert: true,
				alertTitle: "Registration",
				alertMessage: "¡Successful Registration!",
				alertIcon:'success',
				showConfirmButton: false,
				timer: 1500,
				ruta: ''
			});
            //res.redirect('/');         
        }
	});
})

// Ruta para manejar el formulario de recuperación de contraseña
app.post('/recuperar', (req, res) => {
    const userEmail = req.body.email;

    // Lógica para generar un token único y almacenarlo en la base de datos junto con el correo electrónico
    // Enviar un correo electrónico con un enlace que incluya el token

    // Configuración de nodemailer para enviar correos electrónicos
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'deyvidcdv@gmail.com',
            pass: '02062000'
        }
    });

    const mailOptions = {
        from: 'deyvidcdv@gmail.com',
        to: userEmail,
        subject: 'Recuperación de Contraseña',
        text: `Haz clic en este enlace para restablecer tu contraseña: http://localhost:3000/reset?token=tuToken`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.render('error', {
                message: 'Error al enviar el correo electrónico.'
            });
        } else {
            console.log('Email sent: ' + info.response);
            res.render('recuperar', {
                message: 'Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.'
            });
        }
    });
});

//11 - Metodo para la autenticacion
app.post('/auth', async (req, res)=> {
	const user = req.body.user;
	const pass = req.body.pass;    
    let passwordHash = await bcrypt.hash(pass, 8);
	if (user && pass) {
		connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results, fields)=> {
			if( results.length == 0 || !(await bcrypt.compare(pass, results[0].pass)) ) {    
				res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "USUARIO y/o PASSWORD incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    });
				
				//Mensaje simple y poco vistoso
                //res.send('Incorrect Username and/or Password!');				
			} else {         
				//creamos una var de session y le asignamos true si INICIO SESSION       
				req.session.loggedin = true;                
				req.session.name = results[0].name;
				res.render('login', {
					alert: true,
					alertTitle: "Conexión exitosa",
					alertMessage: "¡LOGIN CORRECTO!",
					alertIcon:'success',
					showConfirmButton: false,
					timer: 1500,
					ruta: 'recuperar'
				});        			
			}			
			res.end();
		});
	} else {	
		res.send('Please enter user and Password!');
		res.end();
	}

	if (user && pass) {
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results, fields) => {
            if (results.length === 0 || !(await bcrypt.compare(pass, results[0].pass))) {
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o contraseña incorrectas",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            } else {
                // Si el usuario y la contraseña son correctos, redirige a la página de restablecimiento de contraseña
                res.render('reset-password', {
                    email: results[0].user // Puedes usar results[0].email si el campo es 'email'
                });
            }
            res.end();
        });
    } else {
        res.send('Por favor, ingresa usuario y contraseña');
        res.end();
    }
});


//nueva contraseña
app.post('/reset-password', async (req, res) => {
    const userEmail = req.body.email;
    const newPassword = req.body.newPassword;

    // Verificar si el correo electrónico existe en la base de datos
    connection.query('SELECT * FROM users WHERE user = ?', [userEmail], async (error, results) => {
        if (results.length === 0) {
            // Usuario no encontrado, puedes redirigir a una página de error o manejar de otra manera
            res.render('error', {
                message: "Usuario no encontrado."
            });
        } else {
            // Actualizar la contraseña en la base de datos
            const hashedPassword = await bcrypt.hash(newPassword, 8);
            connection.query('UPDATE users SET pass = ? WHERE user = ?', [hashedPassword, userEmail], (error, results) => {
                if (error) {
                    console.log(error);
                    // Manejar el error, puedes redirigir a una página de error o manejar de otra manera
                    res.render('error', {
                        message: "Error al actualizar la contraseña."
                    });
                } else {
                    // Contraseña actualizada exitosamente, puedes redirigir a la página de inicio de sesión u otra página
                    res.render('login', {
                        alert: true,
                        alertTitle: "Contraseña Actualizada",
                        alertMessage: "Tu contraseña ha sido actualizada exitosamente.",
                        alertIcon: 'success',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                }
            });
        }
    });
});
//12 - Método para controlar que está auth en todas las páginas
app.get('/', (req, res)=> {
	if (req.session.loggedin) {
		res.render('index',{
			login: true,
			name: req.session.name			
		});		
	} else {
		res.render('index',{
			login:false,
			name:'Debe iniciar sesión',			
		});				
	}
	res.end();
});
//recuperar contraseña


//función para limpiar la caché luego del logout
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

 //Logout
//Destruye la sesión.
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
	})
});


app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
});