module.exports = new class Admin
{
  COLUMNS = [ 'id', 'first_name', 'last_name', 'email', 'username', 'password', 'sessions' ]

  async getBy(field, value, limit=null)
  {
    if ( -1 == this.COLUMNS.indexOf(field) )
      return []

    const conn = await Util.dbConn()

    try {
      const sql = require('mssql'), req = new sql.Request(conn)
      req.input('value', value)

      const results = await req.query(`select ${limit ? `top ${limit} ` : ''}* from Admins where ${field} = @value`)
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

    user.id = +user.id

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
    
    if ( ! await this.update(user.id, { sessions: user.sessions }) )
      return false

    Util.setCookie( req, res, 'uid.admin', `${session}d${user.id}`, { signed: true, expires_seconds: 86400 *7 } )

    return true
  }

  async hashPassword(password)
  {
    return await require('bcryptjs').hash(password, 10)
  }

  async update(id, update)
  {
    const conn = await Util.dbConn()

    try {
      const sql = require('mssql'), req = new sql.Request(conn)
      let stmt = 'update Admins set '

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
      stmt += ` where id = ${Number(id)}`

      const status = await req.query(stmt)
      conn.close()

      return !! status.rowsAffected
    } catch (err) {
      return void console.log(`query error: ${err}`)
    }
  }

  async authMiddleware(req, res, next)
  {
    Object.assign(res.locals, { admin: { logged_in: false, user: null } })

    const cookie = Util.getCookie(req, 'uid.admin')

    if ( ! cookie || ! cookie.match(/d\d+$/) )
      return next()

    const id = parseInt( (cookie.match(/d\d+$/)[0]||'').substr(1) )
    
    if ( id <= 0 )
      return next()

    const user = await this.getOneBy('id', id)

    if ( user && -1 != (user.sessions||[]).indexOf(cookie.replace(/d\d+$/, '')) )
      Object.assign(res.locals, { admin: { logged_in: true, user } })

    return next()
  }

  async authRedirectMiddleware(req, res, next)
  {
    if ( ! res.locals.admin.logged_in )
      return res.redirect('/admin/login')

    return next()
  }
}