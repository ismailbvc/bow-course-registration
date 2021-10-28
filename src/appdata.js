// this module is used for fake data and will be replaced with actual data exchange
// calls to the API on the backend stage.
export const LEARNERS = [
  {
    studentID: 1,
    first_name: 'Ismail',
    last_name: 'El',
    email: 'i@example.com',
    phone: '5870000000',
    dob: 'Oct 19, 1993',
    department: 'Information Technology Services',
    program_id: 1,
    courses: [],
    username: 'user',
    password: 'pass',
  }
]

export const ADMINS = [
  {
    first_name: 'Ismail',
    last_name: 'El',
    email: 'i@example.com',
    username: 'user',
    password: 'pass',
  }
]

export const PROGRAMS = [
  {
    id: 1,
    code: 'IT',
    name: 'Information Technology',
  },
  {
    id: 2,
    code: 'MGMT',
    name: 'Project Management',
  }
]

export const COURSES = [
  {
    id: 1,
    name: 'Project management1',
    code: 'Pr111',
    term: 1,
    start_date: '2021-09-01',
    end_date: '2021-12-24',
    program_id: 1,
  },
  {
    id: 2,
    name: 'C++ Programming Fundamentals',
    code: 'C++111',
    term: 1,
    start_date: '2021-09-01',
    end_date: '2021-12-24',
    program_id: 1,
  },
  {
    id: 3,
    name: 'Computer Maintenance',
    code: 'CompM1111',
    term: 1,
    start_date: '2021-09-01',
    end_date: '2021-12-24',
    program_id: 1,
  },
  {
    id: 4,
    name: 'Information Security1',
    code: 'IS1111',
    term: 1,
    start_date: '2021-09-01',
    end_date: '2021-12-24',
    program_id: 1,
  },
  {
    id: 5,
    name: 'Networking',
    code: 'Net222',
    term: 2,
    start_date: '2022-01-01',
    end_date: '2022-04-24',
    program_id: 1,
  },
  {
    id: 6,
    name: 'Web technology',
    code: 'Web222',
    term: 2,
    start_date: '2022-01-01',
    end_date: '2022-04-24',
    program_id: 1,
  },
  {
    id: 7,
    name: 'Project Management',
    code: 'Pro222',
    term: 2,
    start_date: '2022-01-01',
    end_date: '2022-04-24',
    program_id: 1,
  },
  {
    id: 8,
    name: 'Advanced Project management1',
    code: 'Pr333',
    term: 3,
    start_date: '2022-09-01',
    end_date: '2022-12-24',
    program_id: 1,
  },
  {
    id: 9,
    name: 'Advanced C++ Programming Fundamentals',
    code: 'C++333',
    term: 3,
    start_date: '2022-09-01',
    end_date: '2022-12-24',
    program_id: 1,
  },
  {
    id: 10,
    name: 'Advanced Computer Maintenance',
    code: 'CompM333',
    term: 3,
    start_date: '2022-09-01',
    end_date: '2022-12-24',
    program_id: 1,
  },
  {
    id: 11,
    name: 'Advanced Information Security1',
    code: 'IS333',
    term: 3,
    start_date: '2022-09-01',
    end_date: '2022-12-24',
    program_id: 1,
  },
  {
    id: 12,
    name: 'Advanced Networking',
    code: 'Net222',
    term: 4,
    start_date: '2023-01-01',
    end_date: '2023-04-24',
    program_id: 1,
  },
  {
    id: 13,
    name: 'Advanced Web technology',
    code: 'Web222',
    term: 4,
    start_date: '2023-01-01',
    end_date: '2023-04-24',
    program_id: 1,
  },
  {
    id: 14,
    name: 'Advanced Project Management',
    code: 'Pro222',
    term: 4,
    start_date: '2023-01-01',
    end_date: '2023-04-24',
    program_id: 1,
  },
]

export const INQUIRIES = [
  {
    id: 1,
    studentID: 1,
    subject: 'Test Inquiry',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    date: '10/27/2021, 3:33:02 PM',
  },
  {
    id: 2,
    studentID: 1,
    subject: 'Test Inquiry 2',
    message: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
    date: '10/27/2021, 4:33:02 PM',
  }
]

// fake latency for api calls
const latency = ( ms, ...args ) => new Promise(resolve => setTimeout(resolve, ms, ...args))

export const getAuthLearner = () => latency(200, null)
export const getAuthAdmin = () => latency(200, null)

export const verifyLogin = async ( username, password, data_key ) =>
{
  const users = 'Learner' == data_key ? LEARNERS : ( 'Admin' == data_key ? ADMINS : [] )
  return latency(1000, users.find( u => u.username == username && u.password == password ))
}

export const getProgramsList = () => latency(500, PROGRAMS)

export const getProgramById = (id) => latency(500, PROGRAMS.find(p => p.id == id))

export const getProgramCourses = ( program_id, search ) =>  latency(500, COURSES
  .filter(c => c.program_id == program_id)
  .filter(c => search ? -1 != [c.name, c.code].join(' ').toLowerCase().indexOf(search.toLowerCase()) : true))

export const deleteCourse = async (id) =>
{
  await latency(500)
  const index = COURSES.findIndex(c => c.id == id)

  return index != -1 ? (COURSES.splice(index, 1), true) : false
}

export const insertCourse = async (name, code, term, start_date, end_date, program_id) =>
{
  COURSES.push({
    id: COURSES.length ? Math.max(...COURSES.map(x => x.id)) +1 : 1,
    name, code, term, start_date, end_date, program_id,
  })

  return await latency(500, true)
}

export const getCourseById = (id) => latency(500, COURSES.find(c => c.id == id))

export const updateCourse = async (id, name, code, term, start_date, end_date, program_id) =>
{
  const course = await getCourseById(id)

  if ( ! course )
    return false

  COURSES[COURSES.findIndex(c => c.id == id)] = Object.assign(course, {
    name, code, term, start_date, end_date, program_id,
  })

  return true
}

export const getProgramLearners = program_id => latency(500, LEARNERS.filter(u => u.program_id == program_id))

export const getInquiriesList = (user_id=0) => latency(500, ( user_id
  ? INQUIRIES.filter(i => i.studentID == user_id)
  : INQUIRIES ).map(form => ({
  ...form,
  student: LEARNERS.find(l => l.studentID == form.studentID) || {}
})))

export const insertInquiry = async (studentID, subject, message, date) =>
{
  INQUIRIES.push({
    id: INQUIRIES.length ? Math.max(...INQUIRIES.map(x => x.id)) +1 : 1,
    subject, message, date, studentID,
  })

  return await latency(500, true)
}

export const setLearnerProgramId = async ( user_id, program_id ) =>
{
  const index = LEARNERS.findIndex(u => u.studentID == user_id)

  if ( -1 != index ) {
    LEARNERS[index].program_id = program_id
    return await latency(500, true)
  }

  return await latency(500, false)
}

// course registration active term
export const getCurrentTerm = () => 1

export const registerCourse = async ( user_id, course_id ) =>
{
  const index = LEARNERS.findIndex(u => u.studentID == user_id)

  if ( -1 != index ) {
    LEARNERS[index].courses.push(course_id)
    return await latency(500, true)
  }

  return await latency(500, false)
}

export const getDepartments = () => latency(500, [
  'Information Technology Services',
  'Community Studies',
  'Health & Wellness'
])

export const signupLearner = async ( learner ) =>
{
  const { username, pass, email } = learner

  await latency(500)

  if ( LEARNERS.find( u => u.email == email ) )
    return [ false, 'Email already in use.' ]

  if ( LEARNERS.find( u => u.username == username ) )
    return [ false, 'Username already in use.' ]

  learner.studentID = LEARNERS.length ? Math.max(...LEARNERS.map(x => x.studentID)) +1 : 1
  learner.courses = []
  delete learner.program_id
  learner.courses = []

  LEARNERS.push(learner)

  return [ learner, null ]
}
