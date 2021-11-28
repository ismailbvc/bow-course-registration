module.exports = new class Programs
{
  COLUMNS = [ 'id', 'code', 'name' ]

  async getBy(field, value, limit=null)
  {
    if ( -1 == this.COLUMNS.indexOf(field) && field != 1 ) // also allow 1=1
      return []

    const conn = await Util.dbConn()

    try {
      const sql = require('mssql'), req = new sql.Request(conn)
      req.input('value', value)

      const results = await req.query(`select ${limit ? `top ${limit} ` : ''}* from Programs where ${field} = @value`)
      conn.close()

      return results.recordset.map(this.parse)
    } catch (err) {
      return void console.log(`query error: ${err}`)
    }
  }

  async getOneBy(...args)
  {
    return ((await this.getBy(...args, 1)) || []).shift()
  }

  parse(program)
  {
    program.id = +program.id
    return program
  }
}