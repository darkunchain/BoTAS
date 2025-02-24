
///////////////// Recibir el nombre de usuario desde el proceso principal
(function () {
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


    // Función para mostrar el mensaje de "procesando"
    function showProcessingMessage() {
        const messagesContainer = document.getElementById('bot-messages');
        const processingMessageElement = document.createElement('div');
        processingMessageElement.classList.add('message', 'processing-message');
        processingMessageElement.innerHTML = `
        Regálame un momento, estoy procesando tu solicitud
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
    `;
        messagesContainer.appendChild(processingMessageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Función para eliminar el mensaje de "procesando"
    function removeProcessingMessage() {
        const processingMessage = document.querySelector('.processing-message');
        if (processingMessage) {
            processingMessage.remove();
        }
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

            showProcessingMessage();
            // Enviar el mensaje al backend
            fetch('http://localhost:5000/verify_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,  // Reemplaza con el nombre de usuario real
                    message: message,
                }),
            })
                .then((response) => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

                    // Crear un elemento para la respuesta del bot
                    const botMessageElement = document.createElement('div');
                    botMessageElement.classList.add('message', 'bot-message');
                    messagesContainer.appendChild(botMessageElement);

                    // Eliminar el mensaje de "procesando"
                    removeProcessingMessage();

                    // Función para leer los fragmentos de la respuesta
                    function read() {
                        return reader.read().then(({ done, value }) => {
                            if (done) {
                                return; // Finalizar cuando se complete la respuesta
                            }

                            // Decodificar el fragmento
                            const chunk = decoder.decode(value);
                            console.log('Fragmento recibido:', chunk);

                            // Dividir el flujo en líneas (cada línea es un fragmento JSON)
                            const lines = chunk.split('\n');
                            console.log('Líneas:', lines);
                            for (const line of lines) {
                                if (line.startsWith('data: ')) {

                                    // Procesar el fragmento como JSON
                                    try {
                                        // Eliminar el prefijo "data: " y parsear como JSON
                                        const jsonData = JSON.parse(line.replace('data: ', ''));
                                        console.log('JSON parseado:', jsonData);

                                        // Extraer el contenido del fragmento
                                        if (jsonData.content) {
                                            const content = jsonData.content;
                                            console.log('Contenido extraído:', content);  // <-- Log 4

                                            // Agregar el contenido al mensaje del bot
                                            botMessageElement.innerHTML += content;

                                            // Desplazarse al final del contenedor de mensajes
                                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                                        }
                                    } catch (error) {
                                        console.error('Error al parsear JSON:', error);
                                    }
                                }
                            }
                            // Desplazarse al final del contenedor de mensajes
                            messagesContainer.scrollTop = messagesContainer.scrollHeight;
                            // Leer el siguiente fragmento
                            return read();
                        });
                    }
                    // Iniciar la lectura de la respuesta
                    return read();
                })
                .catch((error) => {
                    console.error('Error:', error);
                    removeProcessingMessage();
                    const errorMessageElement = document.createElement('div');
                    errorMessageElement.textContent = `Error: ${error.message}`;
                    errorMessageElement.classList.add('message', 'error-message');
                    messagesContainer.appendChild(errorMessageElement);
                });
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
})();
