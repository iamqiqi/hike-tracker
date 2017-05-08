import React from 'react';
import { connect } from 'react-redux';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import Home from '../components/Home';

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import '../scss/styles.scss';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/signin" component={SignIn} />
          {
            !this.props.currentUser ? (
              <Route exact path="/" component={SignUp} />
            ) : (
              <Route exact path="/" component={Home} />
            )
          }
          <Route render={() => <div>this page is not here</div>} />
        </Switch>
      </Router>
    )
  }
};

const mapStateToProps = state => ({
  currentUser: state.currentUser,
});

export default connect(mapStateToProps)(App);
