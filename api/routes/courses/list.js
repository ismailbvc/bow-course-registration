module.exports = async (req, res) =>
{
  const Courses = require('./../../model/Courses')
      , args = []

  if ( +req.query.program_id > 0 ) {
    args.push('program_id', +req.query.program_id)
  } else {
    args.push('1', 1) // select all courses (where 1=1)
  }

  if ( String(req.query.search || '').trim() ) {
    // pagination, search
    args.push(null, String(req.query.search).trim())
  }

  const items = await Courses.getBy(...args)

  return res.json(items)
}