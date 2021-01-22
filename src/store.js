import { createStore } from 'redux'
const initialState = {
  loading: false,
  user: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: {} };
    case "SHOW_LOADING":
      return { ...state, loading: true };
    case "HIDE_LOADING":
      return { ...state, loading: false };
    default:
      return state;
  }
};
const store = createStore(reducer)
export default store