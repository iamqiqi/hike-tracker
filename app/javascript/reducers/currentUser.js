import { SET_USER } from '../actions/ActionTypes';

export default function currentUser(state = null, action) {
  switch (action.type) {
    case SET_USER:
      return action.currentUser;
    default:
      return state;
  }
}
