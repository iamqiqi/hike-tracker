import * as types from './ActionTypes';

export function updateTrackingRecordList(trackingRecordList) {
  return {
    type: types.UPDATE_TRACKING_RECORD_LIST,
    trackingRecordList,
  };
}

export function setUser(currentUser) {
  localStorage.currentUser = JSON.stringify(currentUser);
  return {
    type: types.SET_USER,
    currentUser,
  };
}
