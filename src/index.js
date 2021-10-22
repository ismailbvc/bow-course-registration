import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reducers from './redux/reducers'
import App from './components/'

const createStoreWithMiddleware = applyMiddleware()(createStore)
    , preloadState = ((state) => 
    {
      delete state['alerts']
      return state
    })( JSON.parse(localStorage.getItem('_REDUX_STATE') || '{}') )
    , store = createStoreWithMiddleware(reducers, preloadState)

// temporarily persist state to localstorage until API is implemented
store.subscribe(() => localStorage.setItem('_REDUX_STATE', JSON.stringify(store.getState())))

ReactDOM.render(
  <Provider store={store}><App/></Provider>,
  document.body.children[0]
)
