import React from 'react'
import { Link } from 'react-router-dom'

export default class Home extends React.Component
{
  componentDidMount()
  {
    document.title = 'Home'
    // @todo maybe render content based on session
  }

  render()
  {
    return (
      <div className="pt-1 p-4">
        <h2 className="text-grey-darkest mb-6">Welcome to Bow Online Course Registration!</h2>

        <h4 className="text-grey-dark mt-4 text-sm tracking-wide uppercase">Learners</h4>
        <ul className="my-2 text-sm pl-6">
          <li><Link to='/learner/login' className="text-teal-dark table">Login</Link></li>
          <li><Link to='/learner/programs' className="text-teal-dark table">Programs & Courses</Link></li>
          <li><Link to='/learner/signup' className="text-teal-dark table">Sign Up</Link></li>
        </ul>

        <h4 className="text-grey-dark mt-4 text-sm tracking-wide uppercase">administrators</h4>
        <ul className="my-2 text-sm pl-6">
          <li><Link to='/admin/login' className="text-teal-dark table">Login</Link></li>
        </ul>
      </div>
    )
  }
}