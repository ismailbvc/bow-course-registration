import React from 'react'
import Loading from './../misc/Loading'

import { getProgramById, getProgramLearners } from './../../appdata'

export default class Students extends React.Component
{
  async componentDidMount()
  {
    document.title = 'Enrolled Students'
    this.MOUNTED = true

    const program_id = +this.props.match.params.id
        , program = program_id > 0 ? await getProgramById( program_id ) : null
        , students = program && program.id ? await getProgramLearners( program.id ) : []

    this.MOUNTED && this.setState({ program, students })

    if ( program && program.name ) {
      document.title = `Enrolled Students - ${program.name}`
    } else {
      this.props.setAlerts([{ text: `Error: program not found.` }])
    }
  }

  componentWillUnmount()
  {
    this.MOUNTED = false
  }

  render()
  {
    const { students, program } = this.state || {}
    
    return (
      <div className="pt-1 p-4">
        <h2 className="text-grey-darkest mb-6">Enrolled Students</h2>

        { undefined === students ? <div className="flex items-center h-full">
          <Loading className="table m-auto" />
        </div> : <table className="table-fixed w-full text-base leading-normal mb-4" id="dash-table">
          <thead>
            <tr className="bg-grey-light font-bold select-none text-grey-darker text-left tracking-wide uppercase text-xs break-words">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone No</th>
              <th className="p-2">DOB</th>
            </tr>
          </thead>
          <tbody>
            { students.length ? students.sort((a,b) => a.id - b.id).map((student,i) => <tr key={i} className={`text-xs break-words px-4 py-4 ${i%2 ? 'bg-grey-lightest' : 'bg-grey-lighter'}`}>
              <td className="p-2">{ [student.first_name, student.last_name].filter(Boolean).join(' ') }</td>
              <td className="p-2">{ student.email }</td>
              <td className="p-2">{ student.phone }</td>
              <td className="p-2">{ student.dob }</td>
            </tr>) : <tr>
              <td colSpan={4} className="p-2">
                <small className="table m-auto italic">No learners found.</small>
              </td>
            </tr> }
          </tbody>
        </table> }
      </div>
    )
  }
}