import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Loading from './../misc/Loading'
import { setAuthLearner, setAuthAdmin, setAlerts } from '../../redux/actions'
import { Link } from 'react-router-dom'
import { getDepartments, signupLearner } from './../../appdata'

const [
  first_nameRef, last_nameRef, emailRef, phoneRef,
  dobRef, departmentRef, userRef, passRef,
] = [
  React.createRef(), React.createRef(), React.createRef(), React.createRef(),
  React.createRef(), React.createRef(), React.createRef(), React.createRef(),
]

export const is_email = email =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)

class Signup extends React.Component
{
  async componentDidMount()
  {
    document.title = 'Learner Sign Up'
    this.MOUNTED = true
  
    // check if user logged in    
    const { user } = this.props.authLearner
    user && this.redirect()

    const departments = await getDepartments()
    this.MOUNTED && this.setState({ departments })
  }

  componentWillUnmount()
  {
    this.MOUNTED = false
  }

  redirect(to)
  {
    return this.props.history.push(to || '/')
  }

  async submit(e)
  {
    e.preventDefault()

    const { first_name, last_name, email, phone, dob, department, user: username, pass, loading, departments=[] } = this.state || {}

    if ( loading )
      return

    this.props.setAlerts(this.props.alerts.filter(err => 'signup' !== err.type), false)

    if ( ! first_name || ! first_name.trim() )
      return first_nameRef.current.focus()

    if ( ! last_name || ! last_name.trim() )
      return last_nameRef.current.focus()

    if ( ! email || ! is_email(email.trim()) )
      return emailRef.current.focus()

    if ( ! phone || phone.trim().length < 10 )
      return phoneRef.current.focus()

    if ( ! dob || isNaN(Date.parse(dob)) )
      return dobRef.current.focus()

    if ( -1 == departments.indexOf(department) )
      return departmentRef.current.focus()

    if ( ! username || username.trim().length < 2 )
      return userRef.current.focus()

    if ( ! pass || pass.trim().length < 4 )
      return passRef.current.focus()

    this.setState({ loading: 1 })

    const { success, error } = await signupLearner({
      first_name, last_name, email, phone, dob, department, username, pass
    })

    if ( success ) {
      return this.redirect('/learner/programs')
    } else {
      this.setState({ loading: undefined })
      this.props.setAlerts([{
        text: error || 'Error occurred, please try again.',
        type: 'signup',
      }])
    }
  }

  render()
  {
    const { first_name, last_name, email, phone, dob, department, user, pass, loading, departments=[] } = this.state || {}

    return (
      <div className="flex flex-1 items-center w-full h-full pt-1">
        <div className="w-full">
          <form className="w-full" onSubmit={this.submit.bind(this)}>
            <p className="w-full">
              <label className="table text-sm w-full mb-3">
                <strong className="mb-1 table text-grey-darkest">First name</strong>
                <input className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
                  type="text"
                  value={first_name||''}
                  onChange={e => this.setState({ first_name: e.target.value })}
                  ref={first_nameRef}
                  disabled={!!loading} />
              </label>

              <label className="table text-sm w-full mb-3">
                <strong className="mb-1 table text-grey-darkest">Last name</strong>
                <input className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
                  type="text"
                  value={last_name||''}
                  onChange={e => this.setState({ last_name: e.target.value })}
                  ref={last_nameRef}
                  disabled={!!loading} />
              </label>

              <label className="table text-sm w-full mb-3">
                <strong className="mb-1 table text-grey-darkest">Email Address</strong>
                <input className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
                  type="email"
                  value={email||''}
                  onChange={e => this.setState({ email: e.target.value })}
                  ref={emailRef}
                  disabled={!!loading} />
              </label>

              <label className="table text-sm w-full mb-3">
                <strong className="mb-1 table text-grey-darkest">Phone</strong>
                <input className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
                  type="text"
                  value={phone||''}
                  onChange={e => this.setState({ phone: e.target.value })}
                  ref={phoneRef}
                  disabled={!!loading} />
              </label>

              <label className="table text-sm w-full mb-3">
                <strong className="mb-1 table text-grey-darkest">Date of Birth</strong>
                <input className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
                  type="date"
                  value={dob||''}
                  onChange={e => this.setState({ dob: e.target.value })}
                  ref={dobRef}
                  disabled={!!loading} />
              </label>

              <label className="table text-sm w-full mb-3">
                <strong className="mb-1 table text-grey-darkest">Department</strong>
                <span className="relative flex items-center">
                  <select className="block appearance-none w-full border border-gray-light py-2 text-xs px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-dark"
                    onChange={e => this.setState({ department: e.target.value })} value={department} disabled={!!loading} ref={departmentRef}>
                    <option value="">&mdash; Select Dept. &mdash;</option>
                    { (departments || []).map((dept, i) => <option key={i}>{dept}</option>) }
                  </select>

                  <span className="pointer-events-none absolute pin-r flex items-center px-2">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </span>
                </span>
              </label>

              <label className="table text-sm w-full mb-3">
                <strong className="mb-1 table text-grey-darkest">Username</strong>
                <input className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
                  type="text"
                  value={user||''}
                  onChange={e => this.setState({ user: e.target.value })}
                  ref={userRef}
                  disabled={!!loading} />
              </label>

              <label className="table text-sm w-full mb-3">
                <strong className="mb-1 table text-grey-darkest">Password</strong>
                <input className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
                  type="password"
                  value={pass||''}
                  onChange={e => this.setState({ pass: e.target.value })}
                  ref={passRef}
                  disabled={!!loading} />
              </label>

              <label className="table text-sm w-full mb-2">
                <input className={`border border-transparent cursor-pointer leading-tight px-3 py-2 rounded text-grey-darker text-white w-full focus:border-teal-dark focus:bg-white focus:text-teal-dark ${loading ? 'bg-grey' : 'bg-teal hover:border-teal-dark hover:bg-white hover:text-teal-dark'}`}
                  type="submit"
                  value="Sign Up"
                  disabled={!!loading} />
              </label>
            </p>
          </form>
          
          <p className="text-center mb-2 mt-6 mx-auto table text-grey-dark text-sm">
            Have a student account? <Link to='/learner/login' className="text-teal-dark cursor-pointer">Log In</Link>
          </p>
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  authLearner: state.authLearner,
  authAdmin: state.authAdmin,
  alerts: state.alerts,
}), dispatch => bindActionCreators({
  setAuthLearner,
  setAuthAdmin,
  setAlerts,
}, dispatch))(Signup)