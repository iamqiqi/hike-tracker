import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { setUser } from '../actions/actions';

import SignIn from './SignIn';

const initialState = {
  errors: [],
};

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.usernameInput;
    this.emailInput;
    this.passwordInput;
    this.passwordConfirmationInput;
  }

  validateInputs(username, email, password, passwordConfirmation) {
    let errors = [];

    if (!(username && email && password && passwordConfirmation)) {
      errors.push('all fields are required!');
      return errors;
    }

    if (!/@/.test(email)) {
      errors.push('email address is invalid');
    }
    if (password.length < 6) {
      errors.push('minimum password is 6');
    } else if (password !== passwordConfirmation) {
      errors.push('please confirm your password');
    }

    if (errors.length > 0) {
      this.setState({ errors });
      return errors;
    }
    return null;
  }

  registerUserServer(username, email, password) {
    fetch(`/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          username,
          email,
          password,
        },
      }),
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      this.props.setUser(data.user);
    })
    .catch((e) => {
      this.setState({ errors: e.message });
    });
  }

  registerUser() {
    let username = this.usernameInput.value;
    let email = this.emailInput.value;
    let password = this.passwordInput.value;
    let passwordConfirmation = this.passwordConfirmationInput.value;

    let inputErrs = this.validateInputs(username, email, password, passwordConfirmation);
    if (!inputErrs) {
      this.registerUserServer(username, email, password);
    } else {
      console.log('error here');
    }
  }

  render () {
    return (
      <div>
        <form onSubmit={ (e) => {
            e.preventDefault();
            this.registerUser();
          }
        }>
          <label>
            username:
            <input
              name="userName"
              ref={ input => { this.usernameInput = input; } }
            />
          </label>
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
          <label>
            passwordConfirmation:
            <input
              name="passwordConfirmation"
              ref={ input => { this.passwordConfirmationInput = input; } }
            />
          </label>
          <input type="submit" value="Signup" />
        </form>

        <Link to="/signin">Signin</Link>
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({ setUser }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
