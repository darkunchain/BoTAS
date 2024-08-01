
///////////////// Recibir el nombre de usuario desde el proceso principal
window.electron.receiveUserData((data) => {
    mensajeBienvenida(data.username);
});

function askIfUserIsCorrect(username) {
    const messagesContainer = document.getElementById('bot-messages');
    const welcomeMessage = `Segun veo su nombre de usuario es: ${username}. esto es correcto?`;
    typeEffect(welcomeMessage, messagesContainer, () => {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        
        const yesButton = document.createElement('button');
        yesButton.textContent = 'Si';
        yesButton.addEventListener('click', () => {
            buttonContainer.remove();
            handleUserConfirmation(username);
        });
        
        const noButton = document.createElement('button');
        noButton.textContent = 'No';
        noButton.addEventListener('click', () => {
            buttonContainer.remove();
            typeEffect('Por favor indiqueme cual es su nombre de usuario:', messagesContainer);
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
    typeEffect(welcomeMessage, messagesContainer, () => {
        askIfUserIsCorrect(username);
    });
}

function handleUserConfirmation(username) {
    const messagesContainer = document.getElementById('bot-messages');
    const thankYouMessage = `Muchas gracias, ${username}.`;
    typeEffect(thankYouMessage, messagesContainer, () => {
        askForProblem();
    });
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
    
    if (message) {
      const messagesContainer = document.getElementById('bot-messages');
      const messageElement = document.createElement('div');
      messageElement.textContent = message;
      messageElement.classList.add('message');
      messagesContainer.appendChild(messageElement);
      input.value = ''; // Clear the input field
      messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
    }
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
  