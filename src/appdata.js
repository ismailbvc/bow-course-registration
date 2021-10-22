// this module is used for fake data and will be replaced with actual data exchange
// calls to the API on the backend stage.
export const LEARNERS = [
  {
    first_name: 'Ismail',
    last_name: 'El',
    email: 'elhardoum@outlook.com',
    phone: '5870000000',
    dob: 'Oct 10, 1993',
    department: 'Information Technology Services',
    program: 'IT',
    username: 'user',
    password: 'pass',
  }
]

export const ADMINS = [
  {
    first_name: 'Ismail',
    last_name: 'El',
    email: 'elhardoum@outlook.com',
    username: 'user',
    password: 'pass',
  }
]

export const COURSES = [
  
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