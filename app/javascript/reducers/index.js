import { combineReducers } from 'redux';

import trackingRecordList from './trackingRecordList';
import currentUser from './currentUser';

const rootReducer = combineReducers({
  trackingRecordList,
  currentUser,
});

export default rootReducer;
