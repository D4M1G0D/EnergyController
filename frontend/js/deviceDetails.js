// Obtén la categoría seleccionada de la URL
function getCategoryFromURL() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category');
}

// Función para generar dinámicamente las filas de la tabla
function generateTableRows(category) {
  var deviceDetailsTableBody = document.getElementById('deviceDetailsTableBody');

  // Obtén la lista de dispositivos de la categoría seleccionada
  var devicesInCategory = devices[category];

  // Validar si la categoría está definida
  if (devicesInCategory) {
    console.log(`Generando filas para la categoría: ${category}`);

    // Genera filas de tabla para cada dispositivo
    for (var key in devicesInCategory) {
      if (devicesInCategory.hasOwnProperty(key)) {
        var device = devicesInCategory[key];
        var row = document.createElement('tr');
        row.innerHTML = `
          <td>${device.id}</td>
          <td>${device.consumption}</td>
          <td>${device.emissions}</td>
          <td>${device.status}</td>
          <td>${device.roomNumber}</td>
        `;
        deviceDetailsTableBody.appendChild(row);
      }
    }
  } else {
    console.error(`La categoría "${category}" no está definida en los dispositivos.`);
  }
}

// Datos ficticios para dispositivos en diferentes categorías
var devices = {
  cameras: {
    'device1': { id: 1, consumption: '10W', emissions: '5kg', status: 'Active', roomNumber: '101' },
    'device2': { id: 2, consumption: '8W', emissions: '4kg', status: 'Inactive', roomNumber: '102' },
  },
  switches: {
    'device3': { id: 3, consumption: '15W', emissions: '7kg', status: 'Active', roomNumber: '201' },
    'device4': { id: 4, consumption: '12W', emissions: '6kg', status: 'Inactive', roomNumber: '202' },
  },
  lights: {
    'device5': { id: 5, consumption: '5W', emissions: '3kg', status: 'Active', roomNumber: '301' },
    'device6': { id: 6, consumption: '4W', emissions: '2kg', status: 'Inactive', roomNumber: '302' },
  },
  // Agrega más categorías y datos ficticios según sea necesario
};

// Llama a la función para generar las filas de la tabla al cargar la página
window.onload = function () {
  var category = getCategoryFromURL();
  if (category) {
    // Cambia el título de la página con el nombre de la categoría
    document.getElementById('categoryTitle').innerText = category.toUpperCase(); // Puedes cambiar a mayúsculas si lo deseas

    // Cambia el icono de la página con el icono de la categoría
    var iconElement = document.getElementById('categoryIcon');
    if (iconElement) {
      // Actualiza la ruta del icono según la categoría
      iconElement.src = `../../img/icon-${category.toLowerCase()}.png`;
    }

    generateTableRows(category);
  } else {
    console.error("La categoría no está definida en la URL.");
  }
};

