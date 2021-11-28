module.exports = new class Learner
{
  COLUMNS = [ 'studentID', 'first_name', 'last_name', 'email', 'phone', 'dob', 'department', 'program_id', 'username', 'password', 'sessions' ]

  async getBy(field, value, limit=null)
  {
    if ( -1 == this.COLUMNS.indexOf(field) )
      return []

    const conn = await Util.dbConn()

    try {
      const sql = require('mssql'), req = new sql.Request(conn)
      req.input('value', value)

      const results = await req.query(`select ${limit ? `top ${limit} ` : ''}* from Learners where ${field} = @value`)
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

  parse(user)
  {
    if ( ! Array.isArray(user.sessions) )
      user.sessions = (user.sessions||'').split(',').map(x => x.trim()).filter(Boolean)

    user.studentID = +user.studentID
    user.program_id = +user.program_id > 0 ? +user.program_id : user.program_id
    user.dob = Util.fmtDate(user.dob)

    return user
  }

  async comparePasswords( plaintext_password, password )
  {
    return await require('bcryptjs').compare( plaintext_password, password )
  }

  async login(req, res, user)
  {
    const session = await Util.random(20)
    user.sessions.push(session)
    user.sessions = user.sessions.reverse().slice(0,10).reverse() // keep last 10
    
    if ( ! await this.update(user.studentID, { sessions: user.sessions }) )
      return false

    Util.setCookie( req, res, 'uid.learner', `${session}d${user.studentID}`, { signed: true, expires_seconds: 86400 *7 } )

    return true
  }

  async hashPassword(password)
  {
    return await require('bcryptjs').hash(password, 10)
  }

  async register( first_name, last_name, email, phone, dob, department, program_id, username, password )
  {
    const conn = await Util.dbConn()

    try {
      const sql = require('mssql'), req = new sql.Request(conn)
      req.input('first_name', first_name)
      req.input('last_name', last_name)
      req.input('email', email)
      req.input('phone', phone)
      req.input('dob', dob)
      req.input('department', department)
      req.input('program_id', program_id)
      req.input('username', username)
      req.input('password', await this.hashPassword(password))

      const status = await req.query(`insert into Learners (first_name, last_name, email, phone, dob, department, program_id, username, password)
        values (@first_name, @last_name, @email, @phone, @dob, @department, @program_id, @username, @password)`)
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
      let stmt = 'update Learners set '

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
      stmt += ` where studentID = ${Number(id)}`

      const status = await req.query(stmt)
      conn.close()

      return !! status.rowsAffected
    } catch (err) {
      return void console.log(`query error: ${err}`)
    }
  }

  async authMiddleware(req, res, next)
  {
    Object.assign(res.locals, { learner: { logged_in: false, user: null } })

    const cookie = Util.getCookie(req, 'uid.learner')

    if ( ! cookie || ! cookie.match(/d\d+$/) )
      return next()

    const id = parseInt( (cookie.match(/d\d+$/)[0]||'').substr(1) )
    
    if ( id <= 0 )
      return next()

    const user = await this.getOneBy('studentID', id)

    if ( user && -1 != (user.sessions||[]).indexOf(cookie.replace(/d\d+$/, '')) )
      Object.assign(res.locals, { learner: { logged_in: true, user } })

    return next()
  }

  async authRedirectMiddleware(req, res, next)
  {
    if ( ! res.locals.learner.logged_in )
      return res.redirect('/login')

    return next()
  }
}