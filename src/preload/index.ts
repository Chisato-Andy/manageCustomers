import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { CustomerType } from '../lib/type'

// Custom APIs for renderer
const api = {
  registerCustomer: (customer: CustomerType) => ipcRenderer.invoke('register-customer', customer),
  selectCustomerWithBlacklist: (judge: boolean) => ipcRenderer.invoke('select-customer', judge),
  updateCustomerWithBlacklist: (id: number) =>
    ipcRenderer.invoke('update-customer-with-blacklist', id)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
