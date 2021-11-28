module.exports = (req, res) => ('POST' == req.method ? post : get)(req, res)

const post = async (req, res) =>
{
  const { username, password } = req.body

  if ( ! username || ! username.trim() )
    return res.json({ success: false, error: 'Username cannot be empty.' })

  if ( ! password || ! password.length )
    return res.json({ success: false, error: 'Password cannot be empty.' })

  const Learner = require('./../../model/Learner')
      , user = await Learner.getOneBy('username', username)

  if ( ! user )
    return res.json({ success: false, error: 'Invalid credentials.' })

  if ( ! await Learner.comparePasswords(password, user.password) )
    return res.json({ success: false, error: 'Incorrect password entered' })

  if ( await Learner.login(req, res, user) )
    return res.json({ success: true })

  return res.json({ success: false, error: 'Internal server error, please try again' })
}

const get = async (req, res) =>
{
  const user = JSON.parse( JSON.stringify(res.locals.learner.user) )

  if ( user ) {
    delete user.password
    delete user.sessions
  }

  return res.json(user)
}