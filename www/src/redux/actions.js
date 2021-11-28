export const setAuthLearner = user => ({
  type: 'AUTH_USER',
  payload: { user }
})

export const setAuthAdmin = user => ({
  type: 'AUTH_USER_2',
  payload: { user }
})

export const setAlerts = (alerts, append=true) => ({
  type: 'SET_ALERTS',
  payload: { alerts, append }
})
