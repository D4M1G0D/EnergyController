// generatedCards.js

// Lista de dispositivos categorizados
var devices = {
    cameras: { icon: 'icon-cameras.png', title: 'Cameras', value: '2' },
    switches: { icon: 'icon-switches.png', title: 'Switches', value: '5' },
    lights: { icon: 'icon-Lights.png', title: 'Lights Iot', value: '10' },
    // Agrega más categorías y dispositivos según sea necesario
};

// Función para generar tarjetas
function generateCards() {
    var dashboardContainer = document.getElementById('dashboardContainer');
    
    // Crea una nueva fila al principio
    var row;

    for (var category in devices) {
        if (devices.hasOwnProperty(category)) {
            var device = devices[category];

            // Si la fila no está creada o ya tiene 2 tarjetas, crea una nueva fila
            if (!row || row.children.length === 2) {
                row = document.createElement('div');
                row.className = 'row';
                dashboardContainer.appendChild(row);
            }

            var cardHtml = `
                <div class="col-md-6">
                    <a href="../pages/detailsDevicesPage.html?category=${category}" class="card dashboard-container" style="text-decoration: none; margin-top: 20px;">
                        <div class="card-body">
                            <div class="row">
                                <img src="../../img/${device.icon}" alt="${category}" width="100px">
                                <div>
                                    <h3 class="card-title">${device.title}</h3>
                                    <div class="row" style="text-align: center"></div>
                                    <h4 class="text" style="text-align: center; font-weight: 100;">${device.value}</h4>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            `;

            row.innerHTML += cardHtml;
        }
    }
}

// Llama a la función para generar las tarjetas al cargar la página
window.onload = function() {
    generateCards();
};
