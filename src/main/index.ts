import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {
  registerCustomer,
  updateCustomer,
  selectCustomerWithBlacklist,
  updateCustomerWithBlacklist,
  registerSong,
  updateSong,
  selectSongsByCustomerId,
  selectAllSongs
} from '../lib/server/db'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
// 顧客登録
ipcMain.handle('register-customer', async (_event, customer) => {
  return await registerCustomer(customer)
})

// 顧客情報更新
ipcMain.handle('update-customer', async (_event, customer) => {
  return await updateCustomer(customer)
})

// 曲情報登録
ipcMain.handle('register-song', async (_event, song) => {
  return await registerSong(song)
})

// 曲情報更新
ipcMain.handle('update-song', async (_event, song) => {
  return await updateSong(song)
})

// 顧客情報取得
ipcMain.handle('select-customer', async (_event, judge) => {
  const customers = await selectCustomerWithBlacklist(judge)
  return customers
})

// ブラックリスト情報更新
ipcMain.handle('update-customer-with-blacklist', async (_event, id) => {
  return await updateCustomerWithBlacklist(id)
})

// 顧客の客リスト取得
ipcMain.handle('select-songs-by-customer-id', async (_event, id) => {
  return await selectSongsByCustomerId(id)
})

// 全曲リスト取得
ipcMain.handle('select-all-songs', async () => {
  return await selectAllSongs()
})
