const btn = document.querySelector("#btnSubmit");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const rol = document.querySelector("#rol");
const feedback = document.querySelector("#feedback");
const alert = document.querySelector(".alert");
const fields = document.querySelectorAll(".validate");

// Función para verificar la autenticación
function isAuthenticated() {
  return sessionStorage.getItem("token") !== null;
}

// Simulated user data (replace this with your actual authentication logic)
const users = [
  { email: "user@example.com", password: "password123", rol: "user" },
  { email: "admin@example.com", password: "admin", rol: "admin" },
  // Add more user data as needed
];
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


function validate(errors) {
  fields.forEach(function (field) {
    if (field.value === "") {
      field.classList.add("errorField");
      errors.push(field.id);
    }
  });
}

function showErrorMessage(message) {
  alert.style.display = "block";
  feedback.innerHTML = message;
  setTimeout(function () {
    alert.style.display = "none";
  }, 3000);
}

// Verificar autenticación al cargar la página
window.onload = function () {
  if (isAuthenticated()) {
    // Si ya está autenticado, redirigir a la página correspondiente
    window.location = "/user.html"; // Cambia a la página que corresponda
  }
};

btn.addEventListener("click", function (event) {
  let errors = [];
  event.preventDefault();
  alert.style.display = "none";
  feedback.innerHTML = ``;
  
  // Verificar la autenticación antes de procesar el inicio de sesión
  if (isAuthenticated()) {
    // Si ya está autenticado, redirigir a la página correspondiente
    window.location = "/user.html"; // Cambia a la página que corresponda
  } else {
    // Si no está autenticado, realizar el proceso de inicio de sesión
    validate(errors);

    if (errors.length > 0) {
      showErrorMessage(`Los campos ${errors.toString()} no pueden estar vacíos`);
      return false;
    }

    // Simulated authentication logic
    const user = users.find(
      (u) => u.email === username.value && u.password === password.value
    );

    if (!user) {
      showErrorMessage("Credenciales incorrectas");
      return false;
    }

    // Simulate successful authentication
    sessionStorage.setItem("token", "dummyToken");

    // Verificar el rol y redirigir a la página correspondiente
    if (user.rol === "admin") {
      // Redirigir a la página de administrador
      window.location = "../frontend/admin/homeAdmin.html";
    } else {
      // Redirigir a la página de usuario normal
      window.location = "../frontend/client/homeClient.html";
    }
  }
});

fields.forEach(function (field) {
  field.addEventListener("keyup", function () {
    field.classList.remove("errorField");
  });
});