import { combineReducers } from 'redux'

const authLearner = (state={user: undefined}, action) =>
{
  if ( 'AUTH_USER' == action.type )
    return action.payload.user

  return state
}

const authAdmin = (state={user: undefined}, action) =>
{
  if ( 'AUTH_USER_2' == action.type )
    return action.payload.user

  return state
}

const alerts = (state=[], action) =>
{
  if ( 'SET_ALERTS' == action.type ) {
    return action.payload.append
      ? state.concat(action.payload.alerts)
      : [].concat(action.payload.alerts)
  }

  return state
}

export default combineReducers({
  authLearner,
  authAdmin,
  alerts,
})
