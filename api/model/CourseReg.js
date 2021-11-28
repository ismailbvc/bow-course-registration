module.exports = new class CourseReg
{
  COLUMNS = [ 'studentID', 'courseId' ]

  async getBy(field, value, limit=null, search='')
  {
    if ( -1 == this.COLUMNS.indexOf(field) && field != 1 ) // also allow 1=1
      return []

    const conn = await Util.dbConn()

    try {
      const sql = require('mssql'), req = new sql.Request(conn)
      req.input('value', value)
      req.input('search', `%${search}%`)

      const results = await req.query(`select ${limit ? `top ${limit} ` : ''}* from StudentCourses where ${field} = @value${
        search ? ' and (name like @search or code like @search)' : ''
      }`)
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

  parse(course)
  {
    course.courseId = +course.courseId
    course.studentID = +course.studentID
    return course
  }

  async register( courseId, studentID )
  {
    const conn = await Util.dbConn()

    try {
      const sql = require('mssql'), req = new sql.Request(conn)
      req.input('courseId', courseId)
      req.input('studentID', studentID)

      const status = await req.query(`insert into StudentCourses (courseId, studentID)
        values (@courseId, @studentID)`)
      conn.close()

      return !! status.rowsAffected
    } catch (err) {
      return void console.log(`query error: ${err}`)
    }
  }
}