module.exports = async (req, res) =>
{
  const programs = require('./../../model/programs')
  return res.json((await programs.getOneBy('id', req.params.id)) || null)
}