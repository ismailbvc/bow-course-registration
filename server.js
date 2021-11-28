const express = require('express')
    , app = express()
    , routes = require('./api/routes/')
    , Learner = require('./api/model/Learner')
    , Admin = require('./api/model/Admin')
    , path = require('path')
    , public_dir = path.resolve(__dirname, 'www/public')

// load environment variables if not done already
undefined === process.env.HTTP_PORT && require('dotenv').config({ path: path.resolve(__dirname, '.env') })

app.use('/', express.static(public_dir))
app.use(express.json())

// auth user object parser middleware
app.use(Learner.authMiddleware.bind(Learner))
app.use(Admin.authMiddleware.bind(Admin))

app.get('/api/learner/login', routes.learner.login)
app.post('/api/learner/login', routes.learner.login)
app.delete('/api/learner/login', routes.learner.logout)
app.put('/api/learner/register', routes.learner.register)

app.get('/api/admin/login', routes.admin.login)
app.post('/api/admin/login', routes.admin.login)
app.delete('/api/admin/login', routes.admin.logout)

app.get('/api/term', (req, res) => res.json(Config.term_id))

app.get('/api/departments', routes.departments)
app.get('/api/programs', routes.programs.list)
app.get('/api/programs/:id', routes.programs.get)
app.post('/api/programs/:id/register', routes.programs.register)
app.get('/api/programs/:id/learners', routes.programs.learners)

app.get('/api/courses', routes.courses.list)
app.put('/api/courses', routes.courses.create)
app.get('/api/courses/registered', routes.courses.registered)
app.get('/api/courses/:id', routes.courses.course)
app.patch('/api/courses/:id', routes.courses.update)
app.delete('/api/courses/:id', routes.courses.delete)
app.post('/api/courses/:id/register', routes.courses.register)

app.put('/api/inquiries', routes.inquiries.create)
app.get('/api/inquiries', (req, res) => routes.inquiries.list(req, res, 'admin'))
app.get('/api/inquiries/mine', (req, res) => routes.inquiries.list(req, res, 'learner'))

app.get('/*', (req, res) => res.sendFile(path.resolve(public_dir, 'index.html')))

global.Util = require('./api/model/Util')
global.Config = require('./api/Config')

const server = app.listen(process.env.HTTP_PORT, () =>
  console.log(`Server listening on localhost:${server.address().port}`))
