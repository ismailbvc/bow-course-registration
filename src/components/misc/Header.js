import React from 'react'
import { Link } from 'react-router-dom'

export default (props) => <div className="py-5 text-white w-full bg-teal-dark">
  <div className="flex flex-wrap items-center justify-between m-auto max-w-xl px-2 w-full">
    <Link to='/' className="logo-link hover:underline logo-link no-underline text-white my-2">
      <span className="text-lg">Bow Course Registration</span>
    </Link>

    <nav id="main" className="text-sm -my-2">
      { !! props.authAdmin.user && <UserIcon user={props.authAdmin.user} data_key='Admin' setAuthUser={props.setAuthAdmin} /> }
      { !! props.authLearner.user && <UserIcon user={props.authLearner.user} data_key='Learner' setAuthUser={props.setAuthLearner} /> }
    </nav>
  </div>
</div>

const UserIcon = ( { user, data_key, setAuthUser } ) => <React.Fragment>
  <small className="table ml-auto uppercase tracking-wide my-2">
    { [ user.first_name, user.last_name ].filter(Boolean).join(' ') }
    <span className="mr-2"> / {data_key}</span>
    <a onClick={e => setAuthUser({ user: null })} className="border cursor-pointer hover:bg-white hover:text-black px-2 rounded-sm text-white">Log out</a>
  </small>
</React.Fragment>