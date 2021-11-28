module.exports = async (req, res) =>
{
  if ( ! res.locals.learner.user )
    return res.status(401).json(null)

  const programs = require('./../../model/programs')
      , program = await programs.getOneBy('id', req.params.id)
      , learner = res.locals.learner.user

  if ( ! program || ! program.id )
    return res.status(404).json(null)

  if ( learner.program_id )
    return res.status(400).json(null) // already have a program

  if ( ! await require('./../../model/Learner').update(learner.studentID, { program_id: program.id }) )
    return res.status(500).json(null) // internal error

  return res.json({ success: true })
}