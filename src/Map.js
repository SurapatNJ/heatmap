import React, { Component } from "react";
import { Map, HeatMap, GoogleApiWrapper } from "google-maps-react";
import axios from "axios";

const mapStyles = {
  width: '45%',
  height: '54%'
};

const gradient = [
  "rgba(0, 255, 255, 0)",
  "rgba(0, 255, 255, 1)",
  "rgba(0, 191, 255, 1)",
  "rgba(0, 127, 255, 1)",
  "rgba(0, 63, 255, 1)",
  "rgba(0, 0, 255, 1)",
  "rgba(0, 0, 223, 1)",
  "rgba(0, 0, 191, 1)",
  "rgba(0, 0, 159, 1)",
  "rgba(0, 0, 127, 1)",
  "rgba(63, 0, 91, 1)",
  "rgba(127, 0, 63, 1)",
  "rgba(191, 0, 31, 1)",
  "rgba(255, 0, 0, 1)"
];

class MapContainer extends React.Component {

  handleMapMount(mapProps, map) {
    this.map = map;
    //setTimeout(() =>{console.log(this.map.getBounds());},10)
    this.bounds = this.map.getBounds();
    console.log(this.bounds,this.bounds.getNorthEast().lat(),this.bounds.getNorthEast().lng(),this.bounds.getSouthWest().lat(),this.bounds.getSouthWest().lng())
    axios
      .post("http://localhost:8000/api/heatMap/",{
       lat_en:this.bounds.getNorthEast().lat(),
       lng_en:this.bounds.getNorthEast().lng(),
       lat_ws:this.bounds.getSouthWest().lat(),
       lng_ws:this.bounds.getSouthWest().lng(),
       datetime_start: null,
       datetime_end: null
    },{
        headers: {
          'Content-Type': 'application/json'
    }})
      .then(function (response) {
      console.log(response);
    })
      .catch(function (error) {
      console.log(error);
    });
}
  state = {
    isHeatVisible : true
  };
  toggleHeatmap = () => {
    this.setState({isHeatVisible: !this.state.isHeatVisible});
  }
  render() {
    this.handleMapMount = this.handleMapMount.bind(this);
    {this.state.isHeatVisible ? HeatMap : null}
    let heat = <HeatMap
            //gradient={gradient}
            positions={this.props.positions}
            opacity={1}
            radius={10}
            maxIntensity = {5}
          />
    return (
      <div className="map-container" >
        <Map
          style={mapStyles}
          scrollwheel = {false}
          zoomControl = {false}
          google={this.props.google}
          className={"map"}
          zoom={this.props.zoom}
          initialCenter={this.props.center}
          onReady={this.handleMapReady}
          onBounds_changed={this.handleMapMount}
        >
          <div id="floating-panel">
            <button id="toggleHeatmap"onClick={this.toggleHeatmap}>Toggle HeatMap</button>
          </div>
          {this.state.isHeatVisible ? heat: null}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAmJ92b4CXEobypIq9cuEEcl9CMpZ8HCe8",
  language: "th",
  libraries: ["visualization"]
})(MapContainer);
