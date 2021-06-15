import React from 'react'
import { initialReducer } from './reducers'
import { initialState } from './initialState'

// Exports Providers -> <Provider> <children> </Provider>
// passes down state to children. They re render on change
const InitContext = React.createContext()
export function InitProvider({ children }) {
    const [ state, dispatch ] = React.useReducer(initialReducer, initialState)

    const value = { state, dispatch }
    return <InitContext.Provider value={value}>{children}</InitContext.Provider>
  }

export function useInitProvider() {
    const context = React.useContext(InitContext)
    if (context === undefined) {
        throw new Error('useInitProvider must be used within a InitProvider')
    }
    return context
}