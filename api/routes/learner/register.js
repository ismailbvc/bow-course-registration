module.exports = async (req, res) =>
{
  if ( res.locals.learner.logged_in )
    return res.json({ success: false, error: 'You are already logged in as a learner.' })

  const { first_name, last_name, email, phone, dob, department, username, pass: password } = req.body

  if ( ! first_name || ! last_name || ! first_name.trim() || ! last_name.trim() )
    return res.json({ success: false, error: 'Names cannot be empty.' })

  if ( ! email || ! email.trim() )
    return res.json({ success: false, error: 'Email cannot be empty.' })

  if ( ! Util.is_email(email.trim()) )
    return res.json({ success: false, error: 'Invalid email address.' })

  if ( ! password || password.length < 6 )
    return res.json({ success: false, error: 'Password should be 6 characters at least.' })

  if ( ! phone || phone.trim().length < 10 )
    return res.json({ success: false, error: 'Invalid/empty phone number.' })

  if ( ! dob || isNaN(Date.parse(dob)) )
    return res.json({ success: false, error: 'Invalid/empty date of birth.' })

  const Learner = require('./../../model/Learner')

  if ( ! department || -1 == Config.departments.indexOf(department.trim()) )
    return res.json({ success: false, error: 'Invalid department selected.' })

  if ( ! username || username.trim().length < 2 )
    return res.json({ success: false, error: 'Invalid/empty username.' })

  if ( ! password || password.length < 4 )
    return res.json({ success: false, error: 'Invalid/empty password.' })

  // check username
  if ( await Learner.getOneBy('username', username.trim()) )
    return res.json({ success: false, error: 'This username is already in use.' })

  // check email
  if ( await Learner.getOneBy('email', email.trim()) )
    return res.json({ success: false, error: 'This email is already in use.' })

  if ( await Learner.register(first_name.trim(), last_name.trim(), email.trim(), phone.trim(), dob, department.trim(), null, username.trim(), password) )
    return res.json({ success: true })

  return res.json({ success: false, error: 'Internal server error, please try again.' })
}
