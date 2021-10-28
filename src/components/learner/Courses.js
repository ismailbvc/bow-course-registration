import React from 'react'
import { Link } from 'react-router-dom'
import Loading from './../misc/Loading'

import { getProgramById, getProgramCourses, registerCourse, getCurrentTerm } from './../../appdata'

let search_timeout

export default class Courses extends React.Component
{
  async componentDidMount()
  {
    document.title = 'Courses'
    this.MOUNTED = true

    const program_id = +this.props.match.params.id
        , program = program_id > 0 ? await getProgramById( program_id ) : null
        , courses = program && program.code ? await getProgramCourses( program.id ) : []
        , current_term = await getCurrentTerm()

    this.MOUNTED && this.setState({ program, courses, current_term,
      my_program: this.props.authLearner.user.program_id == (program || {}).id })

    if ( program && program.name ) {
      document.title = `Courses - ${program.name}`
    } else {
      this.props.setAlerts([{ text: `Error: program not found.` }])
    }
  }

  componentWillUnmount()
  {
    this.MOUNTED = false
  }

  search()
  {
    const { search, program } = this.state

    if ( ! program || ! program.code )
      return

    let keyword = search.trim()

    search_timeout && clearTimeout(search_timeout)

    search_timeout = setTimeout(() =>
    {
      this.setState({ courses: undefined }, async () =>
        this.setState({ courses: await getProgramCourses( program.id, keyword ) }))
    }, 1000)
  }

  async register(e, { id: course_id, term })
  {
    e.preventDefault()

    const { loading, my_program, current_term } = this.state || {}
        , { user } = this.props.authLearner

    if ( ! my_program || current_term != term || -1 != user.courses.indexOf(course_id) )
      return

    if ( loading || ! confirm('Are you sure you want to register this course?') )
      return

    this.MOUNTED && this.setState({ loading: true })

    const ok = await registerCourse(user.studentID, course_id)

    if ( ok ) {
      user.courses.push(course_id)
      this.props.setAuthLearner({ user })
    } else {
      this.props.setAlerts([{ text: `Error occurred, could not insert register course.` }])
      this.setState({ loading: undefined })
    }

    this.MOUNTED && this.setState({ loading: undefined })
  }

  render()
  {
    const { courses, program, search='', current_term, my_program, loading } = this.state || {}
        , { user } = this.props.authLearner
    
    return (
      <div className="pt-1 p-4">
        <div className="flex items-center justify-between flex-wrap mb-6">
          <h2 className="text-grey-darkest">
            Program Courses
            <Link to={`/admin/programs/${this.props.match.params.id}/courses/create`}
              className="bg-teal-dark leading-normal ml-4 no-underline px-3 py-0 rounded select-none text-lg text-white"
              dangerouslySetInnerHTML={{ __html: '&plus;' }}></Link>
          </h2>
          <input className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker text-xs"
            type="text"
            placeholder="Filter courses"
            value={search}
            onChange={e => this.setState({ search: e.target.value }, this.search.bind(this))} />
        </div>

        { undefined === courses ? <div className="flex items-center h-full">
          <Loading className="table m-auto" />
        </div> : <table className="table-fixed w-full text-base leading-normal mb-4" id="dash-table">
          <thead>
            <tr className="bg-grey-light font-bold select-none text-grey-darker text-left tracking-wide uppercase text-xs break-words">
              <th className="p-2">Name</th>
              <th className="p-2">Term</th>
              <th className="p-2">Date Period</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            { courses.length ? courses.sort((a,b) => a.id - b.id).map((course,i) => <tr key={i} className={`text-xs break-words px-4 py-4 ${i%2 ? 'bg-grey-lightest' : 'bg-grey-lighter'}`}>
              <td className="p-2">{ `${course.name} - ${course.code}` }</td>
              <td className="p-2">{ `Term ${course.term}` }</td>
              <td className="p-2">
                <small className="table"><strong>From: </strong>{ new Date(course.start_date).toLocaleString().replace(/\,.+/g, '') }</small>
                <small className="table"><strong>To: </strong>{ new Date(course.end_date).toLocaleString().replace(/\,.+/g, '') }</small>
              </td>
              <td className="p-2">
                { !! my_program && course.term == current_term && -1 == user.courses.indexOf(course.id) && <button 
                  className={`border border-transparent cursor-pointer leading-tight px-4 py-2 rounded text-grey-darker text-white focus:border-teal-dark focus:bg-white focus:text-teal-dark ${loading ? 'bg-grey' : 'bg-teal hover:border-teal-dark hover:bg-white hover:text-teal-dark'}`}
                  onClick={e => this.register(e, course)}>Register Course</button> }
                { !! my_program && -1 != user.courses.indexOf(course.id) && <span>Registered</span> }
              </td>
            </tr>) : <tr>
              <td colSpan={4} className="p-2">
                <small className="table m-auto italic">No courses found.</small>
              </td>
            </tr> }
          </tbody>
        </table> }
      </div>
    )
  }
}