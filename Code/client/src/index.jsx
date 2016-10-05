import { render } from 'react/react-dom';
import React, { Component } from "react";
import { Router, Route, Link, browserHistory } from 'react-router';
import MapView from "esri/views/MapView";
import Map from "esri/Map";
import Locate from "esri/widgets/Locate";
import Search from "esri/widgets/Search";
import DonorPopup from "app/donor/popup";
import Donors from "app/patient/donors";
import "dojo/domReady!";

/**************************************************
 * Create the map and view
 **************************************************/

let map = new Map({
    basemap: "streets-navigation-vector"
});

// Create MapView
let view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-116.3031, 43.6088],
    zoom: 12
});

let locateWidget = new Locate({ view: view });
locateWidget.startup();
view.ui.add(locateWidget, "top-left");

let searchWidget = new Search({ view: view });
searchWidget.startup();
view.ui.add(searchWidget, "top-right");

class App extends Component {
    render() {
        document.title = 'Are you Donor or Patient?';

        return (
            <div>
                <div>Are you <Link to={'/donor'}>{'Donor'}</Link> or <Link to={'/patient'}>{'Patient'}</Link>?</div>
                {this.props.children}
            </div>
        )
    }
}

render((
   <Router history={browserHistory}>
       <Route path="/" component={App}>
           <Route path="donor" component={props => <DonorPopup {...props} view={view}/>}/>
           <Route path="patient" component={props => <Donors {...props} view={view} map={map} wsHost="http://localhost:3000"/>}/>
       </Route>
   </Router>
), document.getElementById('appDiv'));