
///////////////// Recibir el nombre de usuario desde el proceso principal
(function() {
    let username; // Variable local

window.electron.receiveUserData((data) => {
    username = data.username; // Asignar el valor a la variable local
    mensajeBienvenida(data.username);
});

function askIfUserIsCorrect(username) {
    const messagesContainer = document.getElementById('bot-messages');

    // Crear un elemento <div> para el mensaje
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    // Crear un elemento <strong> para el nombre de usuario en negrita
    const boldUsername = document.createElement('strong');
    boldUsername.textContent = username;

    // Crear el mensaje completo
    const welcomeMessage = document.createTextNode(`Según veo, su nombre de usuario es: `);
    const questionMessage = document.createTextNode(`. ¿Esto es correcto?`);

    // Combinar los elementos
    messageElement.appendChild(welcomeMessage);
    messageElement.appendChild(boldUsername);
    messageElement.appendChild(questionMessage);

    // Agregar el mensaje al contenedor
    messagesContainer.appendChild(messageElement);
    //messagesContainer.appendChild(`como voy hasta aqui`);

    // Llamar a la función typeEffect para mostrar el mensaje con el efecto de escritura
    typeEffect(messageElement.textContent, messagesContainer, () => {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const yesButton = document.createElement('button');
        yesButton.textContent = 'Sí';
        yesButton.addEventListener('click', () => {
            buttonContainer.remove();
            handleUserConfirmation(username);
        });

        const noButton = document.createElement('button');
        noButton.textContent = 'No';
        noButton.addEventListener('click', () => {
            buttonContainer.remove();
            typeEffect('Por favor indíqueme cuál es su nombre de usuario:', messagesContainer);
            showUserInputForm();
        });

        buttonContainer.appendChild(yesButton);
        buttonContainer.appendChild(noButton);
        messagesContainer.appendChild(buttonContainer);
    });
}

function mensajeBienvenida(username) {
    const messagesContainer = document.getElementById('bot-messages');
    const welcomeMessage = `Bienvenido a la mesa de servicio TIGO, es un gusto para mi saludarlo el dia de hoy.`;
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Crear un elemento <span> para el nombre de usuario en negrita
    const boldUsername = document.createElement('strong');
    boldUsername.textContent = username;
    
    // Construir el mensaje completo
    messageElement.innerHTML = `Bienvenido a la mesa de servicio TIGO, es un gusto para mi saludarlo el día de hoy, <strong>${username}</strong>.`;
    
    // Agregar el mensaje al contenedor
    messagesContainer.appendChild(messageElement);
    
    // Llamar a la siguiente función después de mostrar el mensaje
    askIfUserIsCorrect(username);
}

function handleUserConfirmation(username) {
    const messagesContainer = document.getElementById('bot-messages');
    const thankYouMessage = `Muchas gracias, <strong>${username}</strong>.`;
    // Crear un elemento <div> para el mensaje
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = thankYouMessage; // Usar innerHTML para interpretar las etiquetas
    
    // Agregar el mensaje al contenedor
    messagesContainer.appendChild(messageElement);
    
    // Llamar a la siguiente función después de mostrar el mensaje
    askForProblem();
}

function askForProblem() {
    const messagesContainer = document.getElementById('bot-messages');
    const problemMessage = 'Ahora cuenteme, como puedo ayudarle, que inconveniente tiene?';
    typeEffect(problemMessage, messagesContainer, () => {
        showInputForm();
    });
}


function showInputForm() {
    const formContainer = document.querySelector('.input-container');
    formContainer.style.display = 'flex';
}

function showUserInputForm() {
    const messagesContainer = document.getElementById('bot-messages');
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');
    inputContainer.style.display = 'flex';

    const userInput = document.createElement('input');
    userInput.setAttribute('type', 'quest');
    userInput.setAttribute('placeholder', 'Escriba su nombre de usuario');
    userInput.id = 'correct-user-input';

    const submitButton = document.createElement('buttonquest');
    submitButton.textContent = 'Enviar';
    submitButton.addEventListener('click', () => {
        const correctUser = userInput.value.trim();
        if (correctUser) {
            inputContainer.remove();
            handleUserConfirmation(correctUser);
        }
    });

    inputContainer.appendChild(userInput);
    inputContainer.appendChild(submitButton);
    messagesContainer.appendChild(inputContainer);
}


//////////////////////// Boton de enviar ////////////////////////////
document.getElementById('send-button').addEventListener('click', () => {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    console.log('input: ', input, 'message: ', message)

    if (message) {
      const messagesContainer = document.getElementById('bot-messages');
      // Mostrar el mensaje del usuario
      const userMessageElement = document.createElement('div');
      userMessageElement.classList.add('message', 'user-message');
      // Crear un elemento <strong> para el nombre de usuario en negrita
      const boldUsername = document.createElement('strong');
      boldUsername.textContent = username; // Usar la variable local `username`

      // Crear un nodo de texto para el mensaje
      const messageText = document.createTextNode(`: ${message}`);

      // Combinar los elementos
      userMessageElement.appendChild(boldUsername);
      userMessageElement.appendChild(messageText);

      // Agregar el mensaje al contenedor
      messagesContainer.appendChild(userMessageElement);

      // Limpiar el campo de entrada
      input.value = '';

      // Enviar el mensaje al backend
      fetch('http://localhost:5000/verify_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: 'nombre_de_usuario',  // Reemplaza con el nombre de usuario real
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Mostrar la respuesta del modelo
        const botMessageElement = document.createElement('div');
        botMessageElement.textContent = `Bot: ${data.model_response}`;
        botMessageElement.classList.add('message', 'bot-message');
        messagesContainer.appendChild(botMessageElement);
        
        // Desplazarse al final del contenedor de mensajes
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessageElement = document.createElement('div');
        errorMessageElement.textContent = `Error: ${error.message}`;
        errorMessageElement.classList.add('message', 'error-message');
        messagesContainer.appendChild(errorMessageElement);
    });
}
      //messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
    
  });

//////////////////////// Funcion type effect ////////////////////////////
  function typeEffect(text, container, callback) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    container.appendChild(messageElement);
    let index = 0;

    function type() {
        if (index < text.length) {
            messageElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 25);
        } else if (callback) {
            callback();
        }
    }

    type();
}
})();
