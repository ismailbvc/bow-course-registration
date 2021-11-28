module.exports = (req, res) =>
{
  if ( res.locals.admin.user ) {
    const cookie = Util.getCookie(req, 'uid.admin')
        , sessions = res.locals.admin.user.sessions || []
        , index = sessions.indexOf(cookie.replace(/d\d+$/, ''))

    if ( -1 != index ) {
      const User = require('./../../model/Admin')
      sessions.splice(index, 1)
      User.update(res.locals.admin.user.id, { sessions })
    }
  }

  Util.setCookie( req, res, 'uid.admin', null, { signed: true, delete: true } )

  return res.json(true)
}
