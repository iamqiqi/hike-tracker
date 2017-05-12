import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { setUser } from '../actions/actions';

import mapboxgl from 'mapbox-gl';
import { MAPBOXGL_ACCESS_TOKEN } from '../config';

const token = process.env.MAPBOX_ACCESS_TOKEN;

const initialState = {
  viewport: {
    lng: -122.4376,
    lat: 37.7577,
    zoom: 12,
  },
  editingStatus: false,
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.map = null;
    this.mapDom = null;
    this.descriptitonInput = null;
  }

  componentDidMount() {
    mapboxgl.accessToken = MAPBOXGL_ACCESS_TOKEN;

    navigator.geolocation.getCurrentPosition(position => {
      this.setState(
        {
          viewport: {
            ...this.state.viewport,
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          }
        },
        () => this.setMap(),
      );
    });
  }

  setMap() {
    this.map = new mapboxgl.Map({
      container: this.mapDom,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [this.state.viewport.lng, this.state.viewport.lat],
      zoom: this.state.viewport.zoom,
    });
  }

  centerMap() {

  }

  dropPin() {
    navigator.geolocation.getCurrentPosition((position) => {
      const el = document.createElement('div');
      el.innerText = 'hi';
      el.style.backgroundColor = 'red';
      el.style.color = 'green';
      el.style.padding = '10px';
      let marker = new mapboxgl.Marker(el)
                  .setLngLat([position.coords.longitude, position.coords.latitude])
                  .addTo(this.map);
      this.setState({
        editingStatus: true,
        viewport: {
          ...this.state.viewport,
          lng: position.coords.longitude,
          lat: position.coords.latitude,
        },
      });
    });
  }

  savePin(e, description) {
    e.preventDefault();
    fetch(`hiking_routes`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: this.state.viewport.lat,
        lng: this.state.viewport.lng,
        description,
      }),
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      this.setState({ editingStatus: false });
    })
    .catch((e) => {
      console.log(e.message);
    });
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
        <button onClick={() => this.dropPin()}>
          drop pin
        </button>
        <div id="map" style={{width: '400px', height: '400px',}} ref={ dom => this.mapDom = dom }></div>
        { this.state.editingStatus &&
          <div>
            <form onSubmit={ e => this.savePin(e, this.descriptitonInput.value) }>
              <label>
                Descriptiton:
                <input
                  name="descriptiton"
                  ref={ input => { this.descriptitonInput = input; } }
                />
              </label>
              <input type="submit" value="Save" />
            </form>
            <button onClick={() => this.setState({ editingStatus: false })}>Cancel</button>
          </div>
        }
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
