module.exports = async (req, res) =>
{
  if ( ! res.locals.learner.user )
    return res.status(401).json(null)

  const Inquiries = require('./../../model/Inquiries')
      , subject = String(req.body.subject || '').trim()
      , message = String(req.body.message || '').trim()

  if ( ! subject || subject.trim().length < 3 )
    return res.status(400).json(null)

  if ( ! message || message.trim().length < 10 )
    return res.status(400).json(null)

  // data integrity enforced in sql server, so validation takes place there
  return res.json({ success: await Inquiries.insert(res.locals.learner.user.studentID, subject, message, new Date().toISOString()) })
}