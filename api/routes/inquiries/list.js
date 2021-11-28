module.exports = async (req, res, type) =>
{
  const Inquiries = require('./../../model/Inquiries')
      , args = []

  if ( 'learner' == type && ! res.locals.learner.user )
    return res.status(401).json(null)

  if ( 'admin' == type && ! res.locals.admin.user )
    return res.status(401).json(null)

  if ( 'admin' == type ) {
    args.push('1', 1) // select all inquiries (where 1=1)
  } else if ( 'learner' == type ) {
    args.push('studentID', res.locals.learner.user.studentID)
  } else {
    args.push('1', 0) // select none (where 1=0)
  }

  return res.json(await Inquiries.getBy(...args))
}