module.exports = {
  admin: {
    login: require('./admin/login'),
    logout: require('./admin/logout'),
  },

  learner: {
    login: require('./learner/login'),
    register: require('./learner/register'),
    logout: require('./learner/logout'),
  },

  departments: require('./shared/departments'),

  programs: {
    list: require('./programs/list'),
    get: require('./programs/get'),
    register: require('./programs/register'),
    learners: require('./programs/learners'),
  },

  courses: {
    list: require('./courses/list'),
    create: require('./courses/create'),
    course: require('./courses/course'),
    update: require('./courses/update'),
    delete: require('./courses/delete'),
    registered: require('./courses/registered'),
    register: require('./courses/register'),
  },

  inquiries: {
    list: require('./inquiries/list'),
    create: require('./inquiries/create'),
  },
}