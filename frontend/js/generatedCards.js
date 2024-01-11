var socket = io('http://localhost:3000');
console.log('Socket connected:', socket.connected);

var devices = {};

// Fetch dynamicDevices from the server
fetch('/getDynamicDevices')
    .then(response => response.json())
    .then(data => {
        devices = data;
        generateCards();
    })
    .catch(error => console.error('Error fetching dynamicDevices:', error));

// Function to generate cards
function generateCards() {
    var dashboardContainer = document.getElementById('dashboardContainer');
    // Create a new row at the beginning
    dashboardContainer.innerHTML = '';
    var row;

    for (var category in devices) {
        if (devices.hasOwnProperty(category)) {
            var device = devices[category];

            // If the row is not created or already has 2 cards, create a new row
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
    console.log('Devices:', devices);
}

// Call the function to generate cards when the page loads
window.onload = function() {
     generateCards();
};