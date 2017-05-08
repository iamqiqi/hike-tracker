import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { setUser } from '../actions/actions';

const initialState = {
  errors: [],
};

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.emailInput;
    this.passwordInput;
  }

  validateInputs(email, password) {
    let errors = [];

    if (!(email && password)) {
      errors.push('all fields are required!');
      return errors;
    }

    if (!/@/.test(email)) {
      errors.push('email address is invalid');
    }
    if (password.length < 6) {
      errors.push('minimum password is 6');
    }

    if (errors.length > 0) {
      this.setState({ errors });
      return errors;
    }
    return null;
  }

  signinUserServer(email, password) {
    fetch(`/sessions`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          email,
          password,
        },
      }),
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      this.props.setUser(data.user);
    })
    .catch((e) => {
      console.log(e.message);
      this.setState({ errors: e.message });
    });
  }

  signinUser() {
    let email = this.emailInput.value;
    let password = this.passwordInput.value;

    let inputErrs = this.validateInputs(email, password);
    if (!inputErrs) {
      this.signinUserServer(email, password);
    } else {
      console.log('error here');
    }
  }

  render () {
    if (this.props.currentUser) {
      return <Redirect to={{ pathname: '/' }} />;
    }

    return (
      <div>
        <form onSubmit={ (e) => {
            e.preventDefault();
            this.signinUser();
          }
        }>
          <label>
            email:
            <input
              name="email"
              ref={ input => { this.emailInput = input; } }
            />
          </label>
          <label>
            password:
            <input
              name="password"
              ref={ input => { this.passwordInput = input; } }
            />
          </label>
          <input type="submit" value="Signin" />
        </form>

        <Link to="/">back</Link>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({ setUser }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
