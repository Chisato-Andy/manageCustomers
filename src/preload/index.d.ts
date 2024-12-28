import { ElectronAPI } from '@electron-toolkit/preload'
import { CustomerType, SongType } from '../lib/type'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      registerCustomer: (customer: CustomerType) => Promise<boolean>
      selectCustomerWithBlacklist: (judge: boolean) => Promise<CustomerType[]>
      updateCustomerWithBlacklist: (id: number) => Promise<void>
      registerSong: (song: SongType) => Promise<boolean>
    }
  }
}
