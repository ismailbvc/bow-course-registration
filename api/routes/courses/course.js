module.exports = async (req, res) =>
{
  const Courses = require('./../../model/Courses')
  return res.json((await Courses.getOneBy('courseId', req.params.id)) || null)
}