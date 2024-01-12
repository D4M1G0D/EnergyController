function showForm(operation) {
    document.getElementById('crudResult').innerText = ''; // Clear previous results
    var form = document.getElementById('crudForm');
    form.style.display = 'block'; // Show the form

    // Reset form fields
    document.getElementById('deviceId').value = '';
    document.getElementById('deviceConsumption').value = '';
    document.getElementById('deviceEmissions').value = '';
    document.getElementById('deviceStatus').value = '';
    document.getElementById('deviceRoomNumber').value = '';

    // Set appropriate form title based on the operation
    document.getElementById('deviceForm').innerText = operation.toUpperCase() + ' Device';
  }

  function submitForm() {
    // Perform form submission logic here
    var operation = document.getElementById('deviceForm').innerText;
    document.getElementById('crudResult').innerText = operation + ' clicked';
    hideForm();
  }
  

  function hideForm() {
    document.getElementById('crudForm').style.display = 'none'; // Hide the form
  }

  function createDevice() {
    // Aquí puedes agregar lógica para crear un dispositivo
    document.getElementById('crudResult').innerText = 'Create Device clicked';
    hideForm(); // Cerrar el formulario después de hacer clic en el botón
  }

  function updateDevice() {
    // Aquí puedes agregar lógica para actualizar un dispositivo
    document.getElementById('crudResult').innerText = 'Update Device clicked';
    hideForm(); // Cerrar el formulario después de hacer clic en el botón
  }

  function deleteDevice() {
    // Obtén el valor del campo idDevice
    document.getElementById('crudResult').innerText = 'Update Device clicked';
    hideForm(); // Cerrar el formulario después de hacer clic en el botón
  }

function readDevices() {
    // Realiza una solicitud al servidor para obtener la lista de dispositivos
    fetch('/getDynamicDetailsDevices')
        .then(response => response.json())
        .then(devices => displayDevices(devices))
        .catch(error => console.error('Error fetching devices:', error));
}

function displayDevices(devices) {
  hideForm(); 
  // Lógica para mostrar los dispositivos en la tabla
  const tableBody = document.getElementById('deviceDetailsTableBody');
  tableBody.innerHTML = ''; // Limpia filas anteriores

  for (const category in devices) {
      const devicesInCategory = devices[category];

      for (const deviceKey in devicesInCategory) {
          const device = devicesInCategory[deviceKey];

          // Crea una nueva fila en la tabla
          const row = tableBody.insertRow();

          // Agrega celdas a la fila con la información del dispositivo
          const idCell = row.insertCell(0);
          const categoryCell = row.insertCell(1);
          const nameCell = row.insertCell(2);
          const consumptionCell = row.insertCell(3);
          const emissionsCell = row.insertCell(4);
          const statusCell = row.insertCell(5);
          const roomNumberCell = row.insertCell(6);

          // Llena las celdas con la información del dispositivo
          idCell.textContent = device.id;
          categoryCell.textContent = category;
          nameCell.textContent = device.name;
          consumptionCell.textContent = device.consumption;
          emissionsCell.textContent = device.emissions;
          statusCell.textContent = device.status;
          roomNumberCell.textContent = device.roomNumber;
      }
  }
}