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
  function hideForm() {
    document.getElementById('crudForm').style.display = 'none'; // Hide the form
  }

  function submitForm() {
    // Perform form submission logic here
    var operation = document.getElementById('deviceForm').innerText;
    document.getElementById('crudResult').innerText = operation + ' clicked';
    hideForm();
  }
  
  function submitForm() {
    var operation = document.getElementById('deviceForm').innerText;

    switch (operation.trim().toLowerCase()) {
        case 'create device':
            createDevice();
            break;
        case 'update device':
            updateDevice();
            break;
        case 'delete device':
            deleteDevice();
            break;
        default:
            document.getElementById('crudResult').innerText = 'Unknown operation clicked';
            break;
    }

    hideForm();
}

function createDevice() {
    // Lógica para crear un dispositivo
    console.log('Create Device clicked'); // Agrega este mensaje a la consola
    document.getElementById('crudResult').innerText = 'Create Device clicked';
    function createDevice() {
      const deviceId = document.getElementById('deviceId').value;
      const deviceCategory = document.getElementById('deviceCategory').value;
      const deviceName = document.getElementById('deviceName').value;
      const deviceConsumption = document.getElementById('deviceConsumption').value;
      const deviceEmissions = document.getElementById('deviceEmissions').value;
      const deviceStatus = document.getElementById('deviceStatus').value;
      const deviceRoomNumber = document.getElementById('deviceRoomNumber').value;
  
      const deviceData = {
          ID: deviceId,
          Category: deviceCategory,
          Name_d: deviceName,
          KWh: deviceConsumption,
          KgCO2h: deviceEmissions,
          Status_d: deviceStatus,
          Room_ID: deviceRoomNumber
      };
  
      fetch('/createDevice', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(deviceData),
      })
      .then(response => response.json())
      .then(result => {
          console.log('Device created successfully:', result);
          document.getElementById('crudResult').innerText = 'Device created successfully';
      })
      .catch(error => {
          console.error('Error creating device:', error);
          document.getElementById('crudResult').innerText = 'Error creating device';
      });
  
      hideForm(); // Oculta el formulario después de la operación
  }
  
  }

function updateDevice() {
    // Lógica para actualizar un dispositivo
    console.log('Update Device clicked'); // Agrega este mensaje a la consola
    document.getElementById('crudResult').innerText = 'Update Device clicked';
}

function deleteDevice() {
    // Lógica para eliminar un dispositivo
    console.log('Delete Device clicked'); // Agrega este mensaje a la consola
    document.getElementById('crudResult').innerText = 'Delete Device clicked';
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