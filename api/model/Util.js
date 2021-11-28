module.exports = new class Util
{
  dsn = {
    user: 'sa',
    password: process.env.SA_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_HOST,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      trustServerCertificate: true,
      enableArithAbort: false,
    }
  }

  async dbConn()
  {
    const sql = require('mssql')
    
    try {
      return await sql.connect(this.dsn)
    } catch (err) {
      return void console.log(`db connection err: ${err}`)
    }
  }

  setCookie( req, res, name, value, settings={} )
  {
    const Cookies = require('cookies')
        , cookies = new Cookies( req, res, { keys: [ process.env.COOKIES_SECRET ] } )
        , options = { path: settings.path || '/' }

    if ( settings.delete ) {
      settings.expires_seconds = -31556926 // -1 year
      value = ' '
    }

    if ( settings.expires_seconds && 'number' == typeof settings.expires_seconds ) {
      options.expires = new Date(+new Date + settings.expires_seconds*1000)
    }

    return cookies.set( name, String(value), { ...options, signed: Boolean(settings.signed) } )
  }

  getCookie( req, name, settings={} )
  {
    const Cookies = require('cookies')
        , cookies = new Cookies( req, {}, { keys: [ process.env.COOKIES_SECRET ] } )

    return cookies.get( name, { signed: Boolean(settings.signed) } )
  }

  random( length=20, bits=32 )
  {
    return new Promise((res, rej) =>
    {
      require('crypto').randomBytes(bits, (err, buffer) =>
      {
        return err ? rej(err) : res( buffer.toString('hex').substr(0, length) )
      })
    })
  }

  is_email(email)
  {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)
  }

  fmtDate(raw)
  {
    if ( ! isNaN(Date.parse(raw)) ) {
      const d = new Date(raw)

      return [
        d.getFullYear(),
        ('0' + (d.getMonth() + 1)).slice(-2),
        ('0' + d.getDate()).slice(-2)
      ].join('-')
    }

    return raw
  }
}