// Función para abrir la ventana flotante
function openChat() {
    var modal = document.getElementById('chatModal');
    modal.style.display = 'block';
  }
  
  // Función para cerrar la ventana flotante
  function closeChatModal() {
    var modal = document.getElementById('chatModal');
    modal.style.display = 'none';
  }
  
  // Cierra la ventana flotante si se hace clic fuera de ella
  window.onclick = function(event) {
    var modal = document.getElementById('chatModal');
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
  