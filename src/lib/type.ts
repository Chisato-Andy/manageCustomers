export interface CustomerType {
  id?: number
  name: string
  age: string
  birthday: string //DBではDate型
  place: string
  hobby: string
  contact: string
  isGiven: boolean
  isBlack: boolean
  songlist?: SongType[]
  canSeeSonglist?: boolean
}

export interface SongType {
  id?: number
  name: string
  customer_id: number
  memo: string
}
