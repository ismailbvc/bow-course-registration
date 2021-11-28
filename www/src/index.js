import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reducers from './redux/reducers'
import App from './components/'

const createStoreWithMiddleware = applyMiddleware()(createStore)
    , store = createStoreWithMiddleware(reducers)

ReactDOM.render(
  <Provider store={store}><App/></Provider>,
  document.body.children[0]
)
