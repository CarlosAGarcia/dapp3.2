import { SET_LOADING } from './actions'

// action ->  { type: '', value: '' }
// throws err or updates the state
export function initialReducer(state, action) {
  switch (action.type) {
    // case 'increment':
    //     return {count: state.count + 1};
    case SET_LOADING:
      return { ...state, isLoading: action.value }
    default:
      throw new Error();
  }
}