import React from 'react'
import { HashRouter } from 'react-router-dom'
import IndexRouter from './router/IndexRouter'
import './App.css'
import { Provider } from 'react-redux'
import  {store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HashRouter>
          <IndexRouter />
        </HashRouter>
      </PersistGate>
    </Provider>

  )
} 