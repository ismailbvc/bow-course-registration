module.exports = async (req, res) =>
{
  if ( ! res.locals.learner.user )
    return res.json([])

  const Courses = require('./../../model/Courses')
      , CourseReg = require('./../../model/CourseReg')
      , reg = (await CourseReg.getBy('studentID', res.locals.learner.user.studentID)) || []

  return res.json(await Courses.getBy('courseId', reg.map(c => c.courseId), null, null, 'in'))
}