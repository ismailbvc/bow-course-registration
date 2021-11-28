module.exports = async (req, res) =>
{
  if ( ! res.locals.admin.user )
    return res.status(401).json(null)

  const programs = require('./../../model/Programs')
      , program = await programs.getOneBy('id', req.params.id)
      , learner = require('./../../model/Learner')

  if ( ! program || ! program.id )
    return res.status(404).json(null)

  const learners = await learner.getBy('program_id', program.id)

  return res.json(learners.map(student =>
  {
    delete student.password
    delete student.sessions
    return student
  }))
}