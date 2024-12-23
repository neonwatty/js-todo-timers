const { app, BrowserWindow, Tray, Menu, Notification } = require("electron");
const path = require("path");

let mainWindow;
let tray;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("close", (event) => {
    // Prevent the app from quitting when the window is closed
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  const iconPath = path.join(__dirname, "icons/icon.icns");
  const tray = new Tray(iconPath);
  const win = new BrowserWindow({ icon: iconPath });
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: "Quit",
      click: () => {
        app.isQuiting = true; // Signal to allow quitting
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("Timer App");
  tray.on("click", () => {
    mainWindow.show();
  });

  new Notification({
    title: "Timer App Ready",
    body: "Your Timer App is running in the background.",
  }).show();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    mainWindow.loadFile("index.html");
  } else {
    mainWindow.show();
  }
});
