import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './App';

import { setUser } from '../actions/actions';

export default class Root extends Component {

  componentDidMount() {
    if (localStorage.currentUser) {
      this.props.store.dispatch(setUser(JSON.parse(localStorage.currentUser)));
    }
  }

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
