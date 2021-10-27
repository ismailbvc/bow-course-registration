import React from 'react'
import { Link } from 'react-router-dom'

export default class Home extends React.Component
{
  componentDidMount()
  {
    document.title = 'Home'
  }

  render()
  {
    const { user: learner } = this.props.authLearner
        , { user: admin } = this.props.authAdmin

    return (
      <div className="pt-1 p-4">
        <h2 className="text-grey-darkest mb-6">Welcome to Bow Online Course Registration!</h2>

        <h4 className="text-grey-dark mt-4 text-sm tracking-wide uppercase select-none">Learners</h4>
        <ul className="my-2 text-sm pl-6">
          { ! learner && <li><Link to='/learner/login' className="text-teal-dark table">Login</Link></li> }
          { ! learner && <li><Link to='/learner/signup' className="text-teal-dark table">Sign Up</Link></li> }
          { !! learner && <li><Link to='/learner/programs' className="text-teal-dark table">Programs & Courses</Link></li> }
          { !! learner && <li><Link to='/learner/inquiries' className="text-teal-dark table">Inquiries</Link></li> }
        </ul>

        <h4 className="text-grey-dark mt-4 text-sm tracking-wide uppercase select-none">administrators</h4>
        <ul className="my-2 text-sm pl-6">
          { ! admin && <li><Link to='/admin/login' className="text-teal-dark table">Login</Link></li> }
          { !! admin && <li><Link to='/admin/programs' className="text-teal-dark table">Programs & Courses</Link></li> }
          { !! admin && <li><Link to='/admin/inquiries' className="text-teal-dark table">Inquiries</Link></li> }
        </ul>
      </div>
    )
  }
}