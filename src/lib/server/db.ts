import * as mysql from 'mysql2/promise'
import type { CustomerType, SongType } from '../type'

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'managecustomer'
}

// 顧客登録
export async function registerCustomer(customer: CustomerType): Promise<boolean> {
  const connection = await mysql.createConnection(dbConfig)
  const now: Date = new Date()

  try {
    // 最大ID取得
    const [rows] = await connection.query('SELECT MAX(customer_id) AS maxId FROM customer')
    const maxId = rows[0].maxId || 0
    const newId: number = maxId + 1

    // string型をDate型に変更
    let birthday: Date | undefined
    if (customer.birthday) {
      birthday = new Date(customer.birthday)
    }

    // SQL
    const sql = `
      INSERT INTO customer (customer_id, customer_name, customer_age, customer_birthday, customer_place, customer_hobby, customer_contact, customer_isgiven, customer_isblack, customer_register_date, customer_updated_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const values = [
      newId, // 計算した新しいID
      customer.name,
      customer.age,
      birthday || null,
      customer.place,
      customer.hobby,
      customer.contact,
      customer.isGiven,
      customer.isBlack,
      now,
      now
    ]

    // 実行
    const [result] = await connection.execute(sql, values)
    console.log('登録成功:', result)
    return true
  } catch (error) {
    console.error('データベースエラー:', error)
    return false
  } finally {
    connection.end()
  }
}

// 曲登録
export async function registerSong(song: SongType): Promise<boolean> {
  const connection = await mysql.createConnection(dbConfig)
  const now: Date = new Date()

  try {
    // 最大ID取得
    const [rows] = await connection.query('SELECT MAX(song_id) AS maxId FROM song')
    const maxId = rows[0].maxId || 0
    const newId: number = maxId + 1

    // SQL
    const sql = `
      INSERT INTO song (song_id, song_name, customer_id, song_memo, song_register_date, song_updated_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    const values = [
      newId, // 計算した新しいID
      song.name,
      song.customer_id,
      song.memo,
      now,
      now
    ]

    // 実行
    const [result] = await connection.execute(sql, values)
    console.log('登録成功:', result)
    return true
  } catch (error) {
    console.error('データベースエラー:', error)
    return false
  } finally {
    connection.end()
  }
}

// blacklist取得
export async function selectCustomerWithBlacklist(judge: boolean): Promise<CustomerType[]> {
  const connection = await mysql.createConnection(dbConfig)

  try {
    // SQL
    const sql = `
      SELECT
        customer_id As id,
        customer_name AS name,
        customer_age AS age,
        customer_birthday AS birthday,
        customer_place AS place,
        customer_hobby AS hobby,
        customer_contact AS contact,
        customer_isgiven AS isGiven,
        customer_isblack AS isBlack
      FROM customer
      WHERE customer_isblack = ${judge};
    `

    // 実行
    const [rows] = await connection.query(sql)

    // rowsをCustomerType[]に変換
    const list: CustomerType[] = (rows as CustomerType[]).map((row) => ({
      id: row.id,
      name: row.name || '',
      age: row.age || '',
      birthday: row.birthday ? new Date(row.birthday).toLocaleDateString('ja-JP') : '',
      place: row.place || '',
      hobby: row.hobby || '',
      contact: row.contact || '',
      isGiven: row.isGiven,
      isBlack: row.isBlack
    }))

    return list
  } catch (error) {
    console.error('データベースエラー:', error)
    return []
  } finally {
    connection.end()
  }
}

// blacklistから普通のリストに戻す関数
export async function updateCustomerWithBlacklist(id: number): Promise<void> {
  const connection = await mysql.createConnection(dbConfig)

  const now: Date = new Date()

  try {
    // SQL
    const sql = `
      update customer
        set customer_isblack = false, customer_updated_date = ?
      WHERE customer_id = ?
    `

    // 実行
    const [result] = await connection.execute(sql, [now, id])
    console.log('更新成功:', result)
    return
  } catch (error) {
    console.error('データベースエラー:', error)
    return
  } finally {
    connection.end()
  }
}
