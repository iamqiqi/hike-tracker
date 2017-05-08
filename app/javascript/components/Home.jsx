import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { setUser } from '../actions/actions';

const initialState = {
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
  }

  render () {
    let { currentUser } = this.props;
    return (
      <div>
        <div>{ currentUser.username }</div>
        <Link to="/" onClick={() => {
          this.props.setUser(null);
        }}>
          Signout
        </Link>
        Home test
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
