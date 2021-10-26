import React from 'react'
import { Link } from 'react-router-dom'
import Loading from './../misc/Loading'

import { getProgramById, insertCourse, getCourseById, updateCourse } from './../../appdata'

const [ nameRef, codeRef, termRef, startDateRef, endDateRef ] = [
  React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()
]

export default class CoursesCreate extends React.Component
{
  async componentDidMount()
  {
    const edit_id = this.props.match.params.cid

    document.title = edit_id ? 'Edit Course' : 'Create Course'

    const program_id = +this.props.match.params.id
        , program = program_id > 0 ? await getProgramById( program_id ) : null
        , course = edit_id && +edit_id > 0 ? await getCourseById(+edit_id) : null

    this.setState({ program, course })

    if ( program && program.name ) {
      document.title = `${edit_id ? 'Edit' : 'Create'} Course - ${program.name}`
    } else {
      this.props.setAlerts([{ text: `Error: program not found.` }])
    }

    if ( edit_id ) {
      if ( ! course ) {
        this.props.setAlerts([{ text: `Error: course not found.` }])
      } else {
        this.setState({
          name: course.name,
          code: course.code,
          term: String(course.term),
          start_date: course.start_date,
          end_date: course.end_date,
        })
      }
    }
  }

  async submit(e)
  {
    e.preventDefault()

    const { loading, name, code, term, start_date, end_date, program } = this.state || {}
        , edit_id = this.props.match.params.cid

    if ( loading )
      return

    this.props.setAlerts(this.props.alerts.filter(err => 'create_course' !== err.type), false)

    if ( ! name || name.trim().length < 3 )
      return nameRef.current.focus()

    if ( ! code || code.trim().length < 2 )
      return codeRef.current.focus()

    if ( -1 == [1,2,3,4].map(String).indexOf(term) )
      return termRef.current.focus()

    if ( isNaN(Date.parse(start_date)) )
      return startDateRef.current.focus()

    if ( isNaN(Date.parse(end_date)) )
      return endDateRef.current.focus()

    this.setState({ loading: true })

    const inserted = ! edit_id
      ? await insertCourse(name, code, +term, start_date, end_date, program.id)
      : await updateCourse(+edit_id, name, code, +term, start_date, end_date, program.id)

    if ( inserted ) {
      this.props.history.push(`/admin/programs/${program.id}/courses`)
    } else {
      this.props.setAlerts([{ text: `Error occurred, could not insert new course.`, type: 'create_course' }])
      this.setState({ loading: undefined })
    }
  }

  render()
  {
    const { program, loading, name='', code='', term='', start_date='', end_date='' } = this.state || {}
        , edit_id = this.props.match.params.cid
    
    return (
      <div className="pt-1 p-4">
        <h2 className="text-grey-darkest mb-6">{ edit_id ? 'Edit' : 'Create' } Course</h2>

        { undefined === program ? <div className="flex items-center h-full">
          <Loading className="table m-auto" />
        </div> : <form className="w-full" onSubmit={this.submit.bind(this)}>
            <p className="w-full">
              <label className="table text-sm w-full mb-3">
                <strong className="mb-1 table text-grey-darkest">Course Name</strong>
                <input className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
                  type="text"
                  value={name}
                  onChange={e => this.setState({ name: e.target.value })}
                  disabled={!!loading} ref={nameRef} />
              </label>

              <label className="table text-sm w-full mb-3">
                <strong className="mb-1 table text-grey-darkest">Course Code</strong>
                <input className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
                  type="text"
                  value={code}
                  onChange={e => this.setState({ code: e.target.value })}
                  disabled={!!loading} ref={codeRef} />
              </label>

              <label className="table text-sm w-full mb-3">
                <strong className="mb-1 table text-grey-darkest">Course Term</strong>
                <span className="relative flex items-center">
                  <select className="block appearance-none w-full border border-gray-light py-2 text-xs px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-dark"
                    onChange={e => this.setState({ term: e.target.value })} value={term} disabled={!!loading} ref={termRef}>
                    <option value="">&mdash; Select Term &mdash;</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>

                  <span className="pointer-events-none absolute pin-r flex items-center px-2">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </span>
                </span>
              </label>

              <label className="table text-sm w-full mb-3">
                <strong className="mb-1 table text-grey-darkest">Start Date</strong>
                <input className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
                  type="date"
                  value={start_date}
                  onChange={e => this.setState({ start_date: e.target.value })}
                  disabled={!!loading} ref={startDateRef} />
              </label>

              <label className="table text-sm w-full mb-3">
                <strong className="mb-1 table text-grey-darkest">End Date</strong>
                <input className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
                  type="date"
                  value={end_date}
                  onChange={e => this.setState({ end_date: e.target.value })}
                  disabled={!!loading} ref={endDateRef} />
              </label>

              <label className="table text-sm w-full mt-6">
                <input className={`border border-transparent cursor-pointer leading-tight px-4 py-2 rounded text-grey-darker text-white focus:border-teal-dark focus:bg-white focus:text-teal-dark ${loading ? 'bg-grey' : 'bg-teal hover:border-teal-dark hover:bg-white hover:text-teal-dark'}`}
                  type="submit"
                  value={`${edit_id ? 'Update' : 'Submit'} Course`}
                  disabled={!!loading} />
              </label>
            </p>
          </form> }
      </div>
    )
  }
}