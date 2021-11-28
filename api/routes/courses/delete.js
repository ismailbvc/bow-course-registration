module.exports = async (req, res) =>
{
  if ( ! res.locals.admin.user )
    return res.status(401).json(null)

  const Courses = require('./../../model/Courses')
      , course = await Courses.getOneBy('courseId', +req.params.id)

  if ( ! course ) // deleted already
    return res.json({ success: true })

  // data integrity enforced in sql server, so validation takes place there
  return res.json({ success: await Courses.delete(course.courseId) })
}