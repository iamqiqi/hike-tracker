// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Root from '../containers/Root';
import configureStore from '../store/configureStore';

const store = configureStore();

window.store = store;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Root store={store} />,
    document.body.appendChild(document.createElement('div')),
  )
});
