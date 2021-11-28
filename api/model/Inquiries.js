module.exports = new class Inquiries
{
  COLUMNS = [ 'id', 'studentID', 'subject', 'message', 'date' ]

  async getBy(field, value, limit=null)
  {
    if ( -1 == this.COLUMNS.indexOf(field) && field != 1 ) // also allow 1=1
      return []

    const conn = await Util.dbConn()

    try {
      const sql = require('mssql'), req = new sql.Request(conn)      
      req.input('value', value)

      const results = await req.query(`select ${limit ? `top ${limit} ` : ''}i.*, l.first_name, l.last_name, l.email from Inquiries i
        join Learners l on l.studentID = i.studentID
       where ${ 1 != field ? 'i.'.concat(field) : field } = @value`)
      conn.close()

      return results.recordset.map(this.parse.bind(this))
    } catch (err) {
      return void console.log(`query error: ${err}`)
    }
  }

  async getOneBy(...args)
  {
    return ((await this.getBy(...args, 1)) || []).shift()
  }

  parse(entry)
  {
    entry.id = +entry.id
    entry.studentID = +entry.studentID

    entry.student = {
      studentID: entry.studentID,
      first_name: entry.first_name,
      last_name: entry.last_name,
      email: entry.email,
    }

    delete entry.first_name
    delete entry.last_name
    delete entry.email

    return entry
  }

  async insert( studentID, subject, message, date )
  {
    const conn = await Util.dbConn()

    try {
      const sql = require('mssql'), req = new sql.Request(conn)
      req.input('studentID', studentID)
      req.input('subject', subject)
      req.input('message', message)
      req.input('date', date)

      const status = await req.query(`insert into Inquiries (studentID, subject, message, date)
        values (@studentID, @subject, @message, @date)`)
      conn.close()

      return !! status.rowsAffected
    } catch (err) {
      return void console.log(`query error: ${err}`)
    }
  }
}