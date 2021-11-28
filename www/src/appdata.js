export const getAuthLearner = async () =>
{
  const user = await fetch('/api/learner/login')
    .then(r => r.json())
    .catch(err => ({ success: false }))

  return user
}

export const getAuthAdmin = async () =>
{
  const user = await fetch('/api/admin/login')
    .then(r => r.json())
    .catch(err => ({ success: false }))

  return user
}

export const verifyLogin = async ( username, password, data_key ) =>
{
  return await fetch(`/api/${data_key.toLowerCase()}/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ username, password })
  })
    .then(r => r.json())
    .catch(err => ({ success: false }))
}

export const getProgramsList = async () =>
{
  return (await fetch('/api/programs')
    .then(r => r.json())
    .catch(err => [])) || []
}

export const getProgramById = async (id) =>
{
  return (await fetch(`/api/programs/${id}`)
    .then(r => r.json())
    .catch(err => null)) || null
}

export const getProgramCourses = async ( program_id, search='' ) =>
{
  return (await fetch(`/api/courses?${new URLSearchParams({ program_id, search })}`)
    .then(r => r.json())
    .catch(err => [])) || []
}

export const deleteCourse = async (id) =>
{
  const res = await fetch(`/api/courses/${id}`, {
    method: 'DELETE'
  })
    .then(r => r.json())
    .catch(err => ({ success: false }))

  return !! (res && res.success)
}

export const insertCourse = async (name, code, term, start_date, end_date, program_id) =>
{
  const res = await fetch('/api/courses', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ name, code, term, start_date, end_date, program_id })
  })
    .then(r => r.json())
    .catch(err => ({ success: false }))

  return !! (res && res.success)
}

export const getCourseById = async (id) =>
{
  return (await fetch(`/api/courses/${id}`)
    .then(r => r.json())
    .catch(err => null)) || null
}

export const updateCourse = async (id, name, code, term, start_date, end_date, program_id) =>
{
  const res = await fetch(`/api/courses/${id}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ name, code, term, start_date, end_date })
  })
    .then(r => r.json())
    .catch(err => ({ success: false }))

  return !! (res && res.success)
}

export const getProgramLearners = async (program_id) =>
{
  return (await fetch(`/api/programs/${program_id}/learners`)
    .then(r => r.json())
    .catch(err => null)) || []
}

export const getInquiriesList = async ( endpoint='' ) =>
{
  return (await fetch(`/api/inquiries${endpoint}`)
    .then(r => r.json())
    .catch(err => null)) || []
}

export const insertInquiry = async (subject, message) =>
{
  const res = await fetch('/api/inquiries', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ subject, message })
  })
    .then(r => r.json())
    .catch(err => ({ success: false }))

  return !! (res && res.success)
}

export const setLearnerProgramId = async ( program_id ) =>
{
  const res = await fetch(`/api/programs/${program_id}/register`, {
    method: 'POST'
  })
    .then(r => r.json())
    .catch(err => ({ success: false }))

  return !! (res && res.success)
}

// course registration active term
export const getCurrentTerm = async () =>
{
  return (await fetch('/api/term')
    .then(r => r.json())
    .catch(err => [])) || null
}

export const getMyCourses = async () =>
{
  return (await fetch('/api/courses/registered')
    .then(r => r.json())
    .catch(err => null)) || []
}

export const registerCourse = async ( course_id ) =>
{
  const res = await fetch(`/api/courses/${course_id}/register`, {
    method: 'POST',
  })
    .then(r => r.json())
    .catch(err => ({ success: false }))

  return !! (res && res.success)
}

export const getDepartments = async () =>
{
  const departments = await fetch('/api/departments')
    .then(r => r.json())
    .catch(err => [])

  return departments || []
}

export const signupLearner = async ( learner ) =>
{
  const { username, pass, email } = learner

  return await fetch('/api/learner/register', {
    method: 'PUT',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(learner)
  })
    .then(r => r.json())
    .catch(err => ({ success: false }))
}
