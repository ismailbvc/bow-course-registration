module.exports = async (req, res) =>
{
  if ( ! res.locals.admin.user )
    return res.status(401).json(null)

  const Courses = require('./../../model/Courses')
      , name = String(req.body.name || '').trim()
      , code = String(req.body.code || '').trim()
      , term = Number(req.body.term || '')
      , start_date = String(req.body.start_date || '').trim()
      , end_date = String(req.body.end_date || '').trim()
      , program_id = Number(req.body.program_id || '')

  if ( ! await require('./../../model/Programs').getOneBy('id', program_id) )
    return res.status(400).json(null)

  // data integrity enforced in sql server, so validation takes place there
  return res.json({ success: await Courses.insert(name, code, term, start_date, end_date, program_id) })
}