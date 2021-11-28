import React from 'react'
import { Link } from 'react-router-dom'
import Loading from './../misc/Loading'

import { getProgramById, getProgramCourses, deleteCourse } from './../../appdata'

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

    this.MOUNTED && this.setState({ program, courses })

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

  async deleteCourse(e, course)
  {
    e.preventDefault()

    if ( ! confirm('Are you sure?') )
      return

    this.props.setAlerts(this.props.alerts.filter(err => 'delete_course' !== err.type), false)

    const deleted = await deleteCourse(course.courseId)
        , { search, program } = this.state

    if ( deleted ) {
      this.setState({ courses: undefined }, async () =>
        this.setState({ courses: await getProgramCourses( program.id, (search || '').trim() ) }))
    } else {
      this.props.setAlerts([{
        text: `Error: course could not be deleted. Are any learners signed up for this course?`,
        type: 'delete_course',
      }])
    }
  }

  render()
  {
    const { courses, program, search='' } = this.state || {}
    
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
              <th className="p-2">Actions</th>
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
                <Link to={`/admin/programs/${program.id}/courses/edit/${course.courseId}`} className="text-teal-dark cursor-pointer table">Edit Course</Link>
                <span onClick={e => this.deleteCourse(e, course)} className="text-teal-dark cursor-pointer table underline">Delete Course</span>
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