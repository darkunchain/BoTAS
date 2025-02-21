# BoTAS

Bot TIGO para Asistencia y Soporte

Instrucciones de inicio:

Se utiliza el gestor de versiones de node.js fnm, en caso que no se tenga instalada una version especifica.

Se configura el entorno fnm

fnm env --use-on-cd | Out-String | Invoke-Expression

se utiliza la version de node.js para el proyecto, inicialmente se programo en la version v20.15.1

fnm use 20 --fnm-dir "C:\Path\instalador\nodejs\nodejs20"

Instalacion Inicial:

el proyecto frontEnd esta programado en electron.js y el backend utiliza Llama 3.1 a traves de un backend python

instalar electron.js
npm install electron --save-dev

Crear el archivo main.js
Crear el archivo preload.js
Crear el archivo index.html

la estructura del proyecto es:

BoTAS/
├── src/
│   ├── main/
│   │   └── main.js
│   ├── preload/
│   │   └── preload.js
│   ├── renderer/
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── renderer.js
├── assets/
│   ├── bot-logo.png
├── node_modules/
├── .gitignore
├── package.json
└── README.md

## para iniciar el front

npm start

## para iniciar en modo desarrollo

npm test
