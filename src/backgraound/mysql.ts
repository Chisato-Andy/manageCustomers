import * as mysql from 'mysql2/promise'
import { CustomerType } from './type'

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'managecustomer'
}

// 登録
export async function registerCustomer(customer: CustomerType): Promise<boolean> {
  console.log('A')

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
