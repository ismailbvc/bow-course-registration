import React from 'react'
import { Link } from 'react-router-dom'
import Loading from './../misc/Loading'

import { getProgramsList } from './../../appdata'

export default class Programs extends React.Component
{
  async componentDidMount()
  {
    document.title = 'Programs'
    this.setState({ programs: await getProgramsList() })
  }

  render()
  {
    const { programs } = this.state || {}
    
    return (
      <div className="pt-1 p-4">
        <h2 className="text-grey-darkest mb-6">Programs</h2>

        { undefined === programs ? <div className="flex items-center h-full">
          <Loading className="table m-auto" />
        </div> : <table className="table-fixed w-full text-base leading-normal mb-4" id="dash-table">
          <thead>
            <tr className="bg-grey-light font-bold select-none text-grey-darker text-left tracking-wide uppercase text-xs break-words">
              <th className="p-2">Name</th>
              <th className="p-2">Code</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            { programs.sort((a,b) => a.id - b.id).map((program,i) => <tr key={i} className={`text-xs break-words px-4 py-4 ${i%2 ? 'bg-grey-lightest' : 'bg-grey-lighter'}`}>
              <td className="p-2">{ program.name }</td>
              <td className="p-2">{ program.name }</td>
              <td className="p-2">
                <Link to={`/admin/programs/${program.id}/courses`} className="text-teal-dark cursor-pointer table">Manage Courses</Link>
                <Link to={`/admin/programs/${program.id}/students`} className="text-teal-dark cursor-pointer table">Enrolled Students</Link>
              </td>
            </tr>) }
          </tbody>
        </table> }
      </div>
    )
  }
}