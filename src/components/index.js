import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Loading from './misc/Loading'
import Header from './misc/Header'
import { setAuthUser, setAlerts } from '../redux/actions'
import { HashRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom'

class App extends React.Component
{
  componentDidMount()
  {
    this.props.setAlerts({ text: 'Test alert' })
    this.props.setAlerts({ text: 'Test alert' })
    this.props.setAlerts({ text: 'Test alert' })
    this.props.setAlerts({ text: 'Test alert' })
  }

  render()
  {
    const alerts = this.props.alerts || []
        , Mock = () => <div>some future component</div>

    return (
      <Router>
        <Header {...this.props} />

        <div className="m-auto max-w-xl w-full p-4">
          <Switch>
            <Route path='/' exact render={ props => <Mock {...props} /> } />
            <Route path='/admin/login' exact render={ props => <Mock {...props} /> } />
            <Route path='/admin/programs' exact render={ props => <Mock {...props} /> } />
            <Route path='/admin/programs/:id/courses' exact render={ props => <Mock {...props} /> } />
            <Route path='/admin/programs/:id/students' exact render={ props => <Mock {...props} /> } />
            <Route path='/admin/inquiries' exact render={ props => <Mock {...props} /> } />
            <Route path='/learner/login' exact render={ props => <Mock {...props} /> } />
            <Route path='/learner/signup' exact render={ props => <Mock {...props} /> } />
            <Route path='/learner/programs' exact render={ props => <Mock {...props} /> } />
            <Route path='/learner/programs/:id/courses' exact render={ props => <Mock {...props} /> } />
            <Route path='/learner/inquiries' exact render={ props => <Mock {...props} /> } />
            <Route render={ props => <div>404 - page not found</div> } />
          </Switch>
        </div>

        <div className="fixed w-full" style={{ left: 4, bottom: 4, marginRight: 4, zIndex: 999, paddingRight: 8 }}>
          { alerts.filter(x => !x.skip_main_ui).map((alert, i) =>
            <div style={{ background: '#403F3F' }} className="mt-1 flex items-center px-6 py-3 text-xs text-white w-full" key={Math.random()}>
              <p className="flex-1">{alert.text}</p>
              <span className="cursor-pointer px-1 text-blue text-blue-light select-none" onClick={e =>(alerts.splice(i,1), this.props.setAlerts(alerts, false))}>OK</span>
            </div>) }
        </div>
      </Router>
    )
  }
}

export default connect(state => ({
  authUser: state.authUser,
  alerts: state.alerts,
}), dispatch => bindActionCreators({
  setAuthUser,
  setAlerts,
}, dispatch))(App)