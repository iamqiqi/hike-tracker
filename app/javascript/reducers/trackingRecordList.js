import { UPDATE_TRACKING_RECORD_LIST } from '../actions/ActionTypes';

export default function trackingRecordList(state = [], action) {
  switch (action.type) {
    case UPDATE_TRACKING_RECORD_LIST:
      return action.trackingRecordList;
    default:
      return state;
  }
}
