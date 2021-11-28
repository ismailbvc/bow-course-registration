module.exports = async (req, res) =>
{
  if ( ! res.locals.admin.user )
    return res.status(401).json(null)

  const Courses = require('./../../model/Courses')
      , course = await Courses.getOneBy('courseId', +req.params.id)

  if ( ! course )
    return res.status(404).json(null)

  // the following cannot be updated
  delete req.body.courseId
  delete req.body.program_id

  // data integrity enforced in sql server, so validation takes place there
  return res.json({ success: await Courses.update(course.courseId, req.body) })
}