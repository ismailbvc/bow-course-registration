module.exports = async (req, res) =>
{
  const programs = require('./../../model/Programs')
  return res.json(await programs.getBy('1', 1))
}