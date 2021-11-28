module.exports = new class Courses
{
  COLUMNS = [ 'courseId', 'name', 'code', 'term', 'start_date', 'end_date', 'program_id' ]

  async getBy(field, value, limit=null, search='', operator='=')
  {
    if ( -1 == this.COLUMNS.indexOf(field) && field != 1 ) // also allow 1=1
      return []

    const conn = await Util.dbConn()

    try {
      const sql = require('mssql'), req = new sql.Request(conn)      
      req.input('value', value)
      req.input('search', `%${search}%`)

      const results = await req.query(`select ${limit ? `top ${limit} ` : ''}* from Courses where ${field} ${operator} ${
        Array.isArray(value) ? `( select value from string_split(@value, ',') )` : '@value'
      }${
        search ? ' and (name like @search or code like @search)' : ''
      }`)
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

  parse(course)
  {
    course.courseId = +course.courseId
    course.term = +course.term
    course.program_id = +course.program_id
    course.start_date = Util.fmtDate(course.start_date)
    course.end_date = Util.fmtDate(course.end_date)
    return course
  }

  async insert( name, code, term, start_date, end_date, program_id )
  {
    const conn = await Util.dbConn()

    try {
      const sql = require('mssql'), req = new sql.Request(conn)
      req.input('name', name)
      req.input('code', code)
      req.input('term', term)
      req.input('start_date', start_date)
      req.input('end_date', end_date)
      req.input('program_id', program_id)

      const status = await req.query(`insert into Courses (name, code, term, start_date, end_date, program_id)
        values (@name, @code, @term, @start_date, @end_date, @program_id)`)
      conn.close()

      return !! status.rowsAffected
    } catch (err) {
      return void console.log(`query error: ${err}`)
    }
  }

  async update(id, update)
  {
    const conn = await Util.dbConn()

    try {
      const sql = require('mssql'), req = new sql.Request(conn)
      let stmt = 'update Courses set '

      for ( let prop in update ) {
        if ( -1 == this.COLUMNS.indexOf(prop) )
          continue

        if ( 'sessions' == prop.toLowerCase() && Array.isArray(update[prop]) )
          update[prop] = update[prop].filter(Boolean).join(',')

        if ( 'password' == prop.toLowerCase() )
          update[prop] = await this.hashPassword(update[prop])

        req.input(prop, update[prop])
        stmt += `${prop} = @${prop}, `
      }

      stmt = stmt.replace(/\, $/, '')
      stmt += ` where courseId = ${Number(id)}`

      const status = await req.query(stmt)
      conn.close()

      return !! status.rowsAffected
    } catch (err) {
      return void console.log(`query error: ${err}`)
    }
  }

  async delete(id)
  {
    const conn = await Util.dbConn()

    try {
      const sql = require('mssql'), req = new sql.Request(conn)      
      req.input('id', id)
      const status = await req.query('delete from Courses where courseId = @id')
      conn.close()

      return !! status.rowsAffected
    } catch (err) {
      return void console.log(`query error: ${err}`)
    }
  }
}