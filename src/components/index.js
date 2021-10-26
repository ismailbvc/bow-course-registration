import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Loading from './misc/Loading'
import Header from './misc/Header'

import Home from './Home'
import Login from './Login'

import AdminPrograms from './admin/Programs'
import AdminCourses from './admin/Courses'
import CourseCreate from './admin/CourseCreate'

import { setAuthLearner, setAuthAdmin, setAlerts } from '../redux/actions'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { getAuthLearner, getAuthAdmin } from './../appdata'

class App extends React.Component
{
  componentDidMount()
  {
    // auth state
    this.props.authLearner.user || new Promise(async resolve =>
      this.props.setAuthLearner({ user: await getAuthLearner() }))

    this.props.authAdmin.user || new Promise(async resolve =>
      this.props.setAuthAdmin({ user: await getAuthAdmin() }))

    // add suffix to titles
    const titleSetter = document.__lookupSetter__('title'), titleGetter = document.__lookupGetter__('title')
    Object.defineProperty(document, 'title', {
      get: function () { return titleGetter.apply(document) },
      set: function () {
        arguments[0] = String(arguments[0]).trim() + ' - Bow Course Registration'
        return titleSetter.apply(document, arguments)
      },
    })
  }

  render()
  {
    const alerts = this.props.alerts || []
        , { user: authLearner } = this.props.authLearner
        , { user: authAdmin } = this.props.authAdmin
        , Mock = () => <div>some future component</div>

    if ( undefined === authLearner || undefined === authAdmin ) 
      return <div className="flex items-center h-full">
          <Loading className="table m-auto" />
        </div>

    return (
      <Router>
        <Header {...this.props} />

        <div className="m-auto max-w-md w-full p-4">
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/admin/login' exact render={ props => <Login {...this.props} {...props} data_key='Admin' /> } />
            { !! authAdmin
              ? <Route path='/admin/programs' exact render={ props => <AdminPrograms {...this.props} {...props} /> } />
              : <Redirect to='/admin/login?next=/admin/programs' from='/admin/programs' /> }
            { !! authAdmin
              ? <Route path='/admin/programs/:id/courses' exact render={ props => <AdminCourses {...this.props} {...props} /> } />
              : <Redirect to='/admin/login?next=/admin/programs/:id/courses' from='/admin/programs/:id/courses' /> }
            { !! authAdmin
              ? <Route path='/admin/programs/:id/courses/create' exact render={ props => <CourseCreate {...this.props} {...props} /> } />
              : <Redirect to='/admin/login?next=/admin/programs/:id/courses/create' from='/admin/programs/:id/courses/create' /> }
            { !! authAdmin
              ? <Route path='/admin/programs/:id/courses/edit/:cid' exact render={ props => <CourseCreate {...this.props} {...props} /> } />
              : <Redirect to='/admin/login?next=/admin/programs/:id/courses/edit/:cid' from='/admin/programs/:id/courses/edit/:cid' /> }
            { !! authAdmin
              ? <Route path='/admin/programs/:id/students' exact render={ props => <Mock {...this.props} {...props} /> } />
              : <Redirect to='/admin/login?next=/admin/programs/:id/students' from='/admin/programs/:id/students' /> }
            { !! authAdmin
              ? <Route path='/admin/inquiries' exact render={ props => <Mock {...this.props} {...props} /> } />
              : <Redirect to='/admin/login?next=/admin/inquiries' from='/admin/inquiries' /> }
            <Route path='/learner/login' exact render={ props => <Login {...this.props} {...props} data_key='Learner' /> } />
            <Route path='/learner/signup' exact render={ props => <Mock {...this.props} {...props} /> } />
            { !! authLearner
              ? <Route path='/learner/programs' exact render={ props => <Mock {...this.props} {...props} /> } />
              : <Redirect to='/learner/login?next=/learner/programs' from='/learner/programs' /> }
            { !! authLearner
              ? <Route path='/learner/programs/:id/courses' exact render={ props => <Mock {...this.props} {...props} /> } />
              : <Redirect to='/learner/login?next=/learner/programs/:id/courses' from='/learner/programs/:id/courses' /> }
            { !! authLearner
              ? <Route path='/learner/inquiries' exact render={ props => <Mock {...this.props} {...props} /> } />
              : <Redirect to='/learner/login?next=/learner/inquiries' from='/learner/inquiries' /> }
            <Route render={ props => <div>404 - page not found</div> } />
          </Switch>
        </div>

        { /* @todo readonly notice */ }

        <div className="fixed w-full" style={{ left: 4, bottom: 4, marginRight: 4, zIndex: 999, paddingRight: 8 }}>
          { alerts.filter(x => ! x.skip_main_ui).map((alert, i) =>
            <div style={{ background: '#403F3F' }} className="mt-1 flex items-center px-6 py-3 text-xs text-white w-full max-w-xl m-auto" key={Math.random()}>
              <p className="flex-1">{ alert.text }</p>
              <span className="cursor-pointer px-1 text-blue text-blue-light select-none" onClick={e =>(alerts.splice(i,1), this.props.setAlerts(alerts, false))}>
                { alert.dismiss_text || 'OK' }
              </span>
            </div>) }
        </div>
      </Router>
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
}, dispatch))(App)