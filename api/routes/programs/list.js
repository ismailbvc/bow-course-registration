module.exports = async (req, res) =>
{
  const programs = require('./../../model/programs')
  return res.json(await programs.getBy('1', 1))
}