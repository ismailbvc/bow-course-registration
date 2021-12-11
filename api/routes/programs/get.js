module.exports = async (req, res) =>
{
  const programs = require('./../../model/Programs')
  return res.json((await programs.getOneBy('id', req.params.id)) || null)
}