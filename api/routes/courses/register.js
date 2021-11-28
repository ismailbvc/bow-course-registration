module.exports = async (req, res) =>
{
  if ( ! res.locals.learner.user )
    return res.status(401).json(null)

  const Courses = require('./../../model/Courses')
      , CourseReg = require('./../../model/CourseReg')
      , course = await Courses.getOneBy('courseId', +req.params.id)
      , reg = course ? ((await CourseReg.getBy('studentID', res.locals.learner.user.studentID)) || []) : null

  if ( ! course || ! Array.isArray(reg) )
    return res.status(400).json(null)

  // verify program
  if ( course.program_id != res.locals.learner.user.program_id )
    return res.status(400).json(null)

  if ( -1 != reg.indexOf(course.courseId) )
    return res.json({ success: true })

  if ( ! await CourseReg.register( course.courseId, res.locals.learner.user.studentID ) )
    return res.status(500).json(null)

  return res.json({ success: true })
}