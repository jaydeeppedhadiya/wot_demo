const electron = require('electron')

const { app, BrowserWindow, autoUpdater,ipcMain  } = require('electron')
const server = 'https://jaydeepwot@bitbucket.org/jaydeepwot/wot_electron.git'
const url = `${server}/update/${process.platform}/${app.getVersion()}`
console.log(url)
autoUpdater.setFeedURL({ url })
function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadFile('index.html')
}

app.whenReady().then(createWindow)



app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
  });
setInterval(() => {

    autoUpdater.checkForUpdates()
}, 10000)
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
})
autoUpdater.on('error', message => {
    console.error('There was a problem updating the application')
    console.error(message)
})