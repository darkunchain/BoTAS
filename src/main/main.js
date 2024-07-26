const { app, BrowserWindow } = require('electron');
const path = require('path');
const os = require('os');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 580,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js')
    },
    icon: path.join(__dirname, '../assets/bot-logo.png') // Ruta al ícono
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Enviar el nombre del usuario al renderer
  mainWindow.webContents.on('did-finish-load', () => {
    const username = os.userInfo().username;
    mainWindow.webContents.send('user-data', { username });
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
