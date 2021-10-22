import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Loading from './misc/Loading'
import { setAuthLearner, setAuthAdmin, setAlerts } from '../redux/actions'
import { Link } from 'react-router-dom'
import { getAuthLearner, getAuthAdmin, verifyLogin } from './../appdata'

const [usernameRef, passwordRef] = [React.createRef(), React.createRef()]

class Login extends React.Component
{
  componentDidMount()
  {
    document.title = `${this.props.data_key} Login`
  
    // check if user logged in    
    const { user } = this.props[`auth${this.props.data_key}`]
    user && this.redirect()
  }

  redirect()
  {
    const next_url = new URLSearchParams(this.props.location.search).get('next')
    return this.props.history.push(next_url || '/')
  }

  async submit(e)
  {
    e.preventDefault()

    const { username, password, loading } = this.state || {}

    if ( loading )
      return

    this.props.setAlerts(this.props.alerts.filter(err => 'login' !== err.type), false)

    if ( ! username )
      return usernameRef.current.focus()

    if ( ! password )
      return passwordRef.current.focus()

    this.setState({ loading: 1 })

    const user = await verifyLogin( username, password, this.props.data_key )

    if ( user ) {
      this.props[`setAuth${this.props.data_key}`]({ user })
      return this.redirect()
    } else {
      this.setState({ loading: undefined })
      this.props.setAlerts([{
        text: `Error: invalid credentials.`,
        type: 'login',
      }])
    }
  }

  render()
  {
    const { username, password, loading } = this.state || {}

    return (
      <div className="flex flex-1 items-center w-full h-full pt-1">
        <div className="w-full">
          <form className="w-full" onSubmit={this.submit.bind(this)}>
            <p className="w-full">
              <label className="table text-sm w-full px-4 mb-3">
                <span className="mb-1 table text-grey-darkest">Username</span>
                <input className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full" type="text" value={username||''} onChange={e => this.setState({ username: e.target.value })} ref={usernameRef} disabled={!!loading} />
              </label>

              <label className="table text-sm w-full px-4 mb-3">
                <span className="mb-1 table text-grey-darkest">Password</span>
                <input className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full" type="password" value={password||''} onChange={e => this.setState({ password: e.target.value })} ref={passwordRef} disabled={!!loading} />
              </label>

              <label className="table text-sm w-full px-4 mb-2">
                <input className={`border border-transparent cursor-pointer leading-tight px-3 py-2 rounded text-grey-darker text-white w-full focus:border-teal-dark focus:bg-white focus:text-teal-dark ${loading ? 'bg-grey' : 'bg-teal hover:border-teal-dark hover:bg-white hover:text-teal-dark'}`}
                  type="submit" value="Sign In" disabled={!!loading} />
              </label>
            </p>
          </form>
          
          { 'Learner' == this.props.data_key && <p className="text-center mb-2 mt-6 mx-auto table text-grey-dark text-sm">
            Don't have a student account? <Link to='/learner/signup' className="text-teal-dark cursor-pointer">Sign up</Link>
          </p> }
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
}, dispatch))(Login)