import { ElectronAPI } from '@electron-toolkit/preload'
import { CustomerType } from '../backgraound/type'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      registerCustomer: (customer: CustomerType) => Promise<boolean>
    }
  }
}
