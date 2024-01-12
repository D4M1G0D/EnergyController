// Obtén la categoría seleccionada de la URL
function getCategoryFromURL() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category');
}

// Función para generar dinámicamente las filas de la tabla
function generateTableRows(category, dynamicDevices) {
  var deviceDetailsTableBody = document.getElementById('deviceDetailsTableBody');

  // Obtén la lista de dispositivos de la categoría seleccionada desde dynamicDevices
  var devicesInCategory = dynamicDevices[category];

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

    // Llama a la función para generar las filas de la tabla con la información de dynamicDetailsDevices
    fetch('/getDynamicDetailsDevices')
      .then(response => response.json())
      .then(dynamicDevices => generateTableRows(category, dynamicDevices))
      .catch(error => console.error('Error fetching dynamic details devices:', error));
  } else {
    console.error("La categoría no está definida en la URL.");
  }
};
