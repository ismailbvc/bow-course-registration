export const setAuthUser = user => ({
  type: 'AUTH_USER',
  payload: { user }
})

export const setAlerts = (alerts, append=true) => ({
  type: 'SET_ALERTS',
  payload: { alerts, append }
})
