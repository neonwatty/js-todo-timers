const { app, BrowserWindow, Tray, Menu, Notification } = require("electron");
const path = require("path");

let mainWindow;

// Logging utility
function log(message) {
  console.log(`[DEBUG]: ${message}`);
}

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile("index.html");

  // Handle close event
  mainWindow.on("close", (event) => {
    log("Main window close button clicked");
    log(`app.isQuiting set to ${app.isQuiting}`);
    if (!app.isQuiting) {
      event.preventDefault(); // Prevent default close behavior
      mainWindow.hide(); // Hide the app instead of closing it
      log("Main window hidden");
    }
  });

  // Handle before-quit to detect quit source
  app.on("before-quit", (event) => {
    if (app.isQuiting) {
      log("Quit action triggered externally (e.g., via Cmd+Q or Alt+F4).");
    } else {
      log("Quit action triggered from the Quit menu.");
      app.isQuiting = true;
      log("app isQuiting set to true");
    }
  });

  const iconPath = path.join(__dirname, "icon.png");
  const tray = new Tray(iconPath);
  // const win = new BrowserWindow({ icon: iconPath });
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => {
        log("Tray menu: Show App clicked");
        mainWindow.show();
      },
    },
    {
      label: "Quit",
      click: () => {
        log("Tray menu: Quit clicked");

        app.isQuiting = true; // Set flag for quit detection
        log("App isQuiting flag set to true");

        app.quit(); // Quit the app
        log("app.quit() called");
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip("Timer Todos App");

  tray.on("click", () => {
    log("Tray icon clicked");
    mainWindow.show();
  });
});

app.on("window-all-closed", (event) => {
  if (process.platform !== "darwin") {
    event.preventDefault();
    // app.quit();
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
