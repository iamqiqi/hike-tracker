import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import { setUser } from '../actions/actions';

import mapboxgl from 'mapbox-gl';
import { MAPBOXGL_ACCESS_TOKEN } from '../config';

const token = process.env.MAPBOX_ACCESS_TOKEN;

const initialState = {
  editingStatus: false,
  editingPointId: null,
  editingDescription: "",
  points: [],
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      viewport: {
        lng: -122.4376,
        lat: 37.7577,
        zoom: 12,
      },
    };
    this.map = null;
    this.mapDom = null;
    this.descriptitonInput = null;
    this.openPopups = [];
  }

  componentDidMount() {
    mapboxgl.accessToken = MAPBOXGL_ACCESS_TOKEN;

    this.getPoints();

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

  getPoints() {
    fetch(`hiking_routes?token=${this.props.currentUser.token}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let points = data.routes.map((hiking_record, index) => {
        return {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [hiking_record.lng, hiking_record.lat]
          },
          "properties": {
            "record_id": hiking_record.id,
            "title": "Test",
            "icon": "monument",
            "description": hiking_record.description
          }
        };
      });
      this.setState({
        ...initialState,
        points,
      }, () => this.updateLayerWithPoints());
    })
    .catch((e) => {
      console.log(e.message);
    });
  }

  updateLayerWithPoints() {
    this.map.getSource('points').setData({
      "type": "FeatureCollection",
      "features": this.state.points,
    });

    this.openPopups.forEach((popup) => {
      if (popup && popup.remove) {
        popup.remove();
      }
    });
    this.openPopups = [];
  }

  setMap() {
    this.map = new mapboxgl.Map({
      container: this.mapDom,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [this.state.viewport.lng, this.state.viewport.lat],
      zoom: this.state.viewport.zoom,
    });

    this.map.on('load', () => {
      this.map.addLayer({
        "id": "points",
        "type": "symbol",
        "source": {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": this.state.points
          }
        },
        "layout": {
          "icon-image": "rocket-15",
        }
      });

      this.map.on('click', 'points', (e) => {
        let popupEl = document.createElement('div');
        popupEl.innerHTML = e.features[0].properties.description;
        let editButton = document.createElement('button');
        editButton.innerHTML = 'edit';
        editButton.addEventListener('click', () => {
          this.setState({
            editingStatus: true,
            editingDescription: e.features[0].properties.description,
            editingPointId: e.features[0].properties.record_id,
          })
        });
        popupEl.appendChild(editButton);

        const newPopup = new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates)
            .setDOMContent(popupEl)
            .addTo(this.map);

        this.openPopups.push(newPopup);
      });
    });
  }

  dropPin() {
    navigator.geolocation.getCurrentPosition((position) => {
      let points = [
        ...this.state.points,
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [position.coords.longitude, position.coords.latitude]
          },
          "properties": {
            "title": "Test",
            "icon": "monument",
            "description": "Add description below"
          }
        }
      ];

      this.setState({
        editingStatus: true,
        editingDescription: "",
        viewport: {
          ...this.state.viewport,
          lng: position.coords.longitude,
          lat: position.coords.latitude,
        },
        points,
      }, () => this.updateLayerWithPoints());
    });
  }

  savePin(e, description) {
    e.preventDefault();
    if (!this.state.editingPointId) {
      fetch('hiking_routes', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: this.props.currentUser.token,
          lat: this.state.viewport.lat,
          lng: this.state.viewport.lng,
          description,
        }),
      })
      .then(() => {
        this.getPoints();
      })
      .catch((e) => {
        console.log(e.message);
      });
    } else {
      fetch(`hiking_routes/${this.state.editingPointId}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: this.props.currentUser.token,
          description,
        }),
      })
      .then(() => {
        this.getPoints();
      })
      .catch((e) => {
        console.log(e.message);
      });
    }

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
            <div style={{ position: 'relative', width: '300px' }}>
              <input
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', opacity: 0.3 }}
                type="file"
                onChange={e => this.onFilePick(e)}
              />
              <div style={{ padding: '12px', background: 'green', color: 'white' }}>
                This is my cooler button {!!this.state.imageFile && this.state.imageFile.name}
              </div>
            </div>

            <form onSubmit={ e => this.savePin(e, this.descriptitonInput.value) }>
              <label>
                Descriptiton:
                <input
                  defaultValue={this.state.editingDescription}
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
