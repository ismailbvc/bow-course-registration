module.exports = (req, res) =>
{
  if ( res.locals.learner.user ) {
    const cookie = Util.getCookie(req, 'uid.learner')
        , sessions = res.locals.learner.sessions || []
        , index = sessions.indexOf(cookie.replace(/d\d+$/, ''))

    if ( -1 != index ) {
      const Learner = require('./../../model/Learner')
      sessions.splice(index, 1)
      Learner.update(res.locals.learner.user.studentID, { sessions })
    }
  }

  Util.setCookie( req, res, 'uid.learner', null, { signed: true, delete: true } )

  return res.json(true)
}
