import React from 'react'
import { Link } from 'react-router-dom'
import Loading from './../misc/Loading'

import { getProgramsList, setLearnerProgramId } from './../../appdata'

export default class Programs extends React.Component
{
  async componentDidMount()
  {
    document.title = 'Programs'
    this.MOUNTED = true
    const programs = await getProgramsList()
    this.MOUNTED && this.setState({ programs })
  }

  componentWillUnmount()
  {
    this.MOUNTED = false
  }

  async signup(e, { id: program_id })
  {
    e.preventDefault()

    const { loading } = this.state || {}
        , { user } = this.props.authLearner

    if ( user.program_id > 0 )
      return

    if ( loading || ! confirm('Are you sure you want to sign up for this program?') )
      return

    this.MOUNTED && this.setState({ loading: true })

    const ok = await setLearnerProgramId(user.studentID, program_id)

    if ( ok ) {
      user.program_id = program_id
      this.props.setAuthLearner({ user })
    } else {
      this.props.setAlerts([{ text: `Error occurred, could not sign up for this program.` }])
      this.setState({ loading: undefined })
    }

    this.MOUNTED && this.setState({ loading: undefined })
  }

  render()
  {
    const { programs, loading } = this.state || {}
        , { user } = this.props.authLearner

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
              <td className="p-2">
                <p>{ program.name }</p>
                { user.program_id == program.id && <small className="bg-green-dark inline-block items-center mt-1 no-underline px-2 py-1 rounded-sm text-white tracking-wide uppercase">
                  current</small> }
              </td>
              <td className="p-2">{ program.code }</td>
              <td className="p-2">
                { ! user.program_id && <button 
                  className={`border border-transparent cursor-pointer leading-tight px-4 py-2 rounded text-grey-darker text-white focus:border-teal-dark focus:bg-white focus:text-teal-dark ${loading ? 'bg-grey' : 'bg-teal hover:border-teal-dark hover:bg-white hover:text-teal-dark'}`}
                  onClick={e => this.signup(e, program)}>Sign Up</button> }
                <Link to={`/learner/programs/${program.id}/courses`} className="text-teal-dark cursor-pointer table">View Courses</Link>
              </td>
            </tr>) }
          </tbody>
        </table> }
      </div>
    )
  }
}