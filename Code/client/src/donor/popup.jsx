import Locator from "esri/tasks/Locator";
import esriRequest from "esri/request";
import React, { Component } from "react";

// Set up a locator task using the world geocoding service
let locatorTask = new Locator({
    url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
});

let saveDonorAction = {
    // This text is displayed as a tool tip
    title: "Save",
    id: "saveDonor",
    // An icon font provided by the API
    className: "esri-icon-check-mark"
};

export default class DonorPopup extends Component {
    constructor(props) {
        super(props);
        this.clickHandler = null;
        this.actionHandler = null;
    }

    componentDidMount() {
        let popup = this.props.view.popup;

        this.clickHandler = this.props.view.on("click", show(popup));

        // Adds the action to the view's default popup.
        popup.actions.push(saveDonorAction);

        this.actionHandler = popup.on("trigger-action", event => {
            // If the zoom-out action is clicked, the following code executes
            if (event.action.id === saveDonorAction.id) {
                saveDonor(popup);
            }
        });
    }

    componentWillUnmount() {
        // remove event handlers
        this.clickHandler.remove();
        this.actionHandler.remove();

        // clean up popup
        let popup = this.props.view.popup;
        popup.close();
        popup.actions.remove(saveDonorAction);
        popup.content = '';
    }

    render() {
        document.title = 'Donor\'s page';
        return (<div>Donor's page</div>);
    }
}

function show(popup) {
    return event => {
        // Get the coordinates of the click on the view
        let lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
        let lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

        popup.open({
            // Set the popup's title to the coordinates of the location
            title: "Reverse geocode: [" + lon + ", " + lat + "]",
            location: event.mapPoint, // Set the location of the popup to the clicked location
            content: 'Resolving geo coordinates. Please wait...'
        });

        // Display the popup
        // Execute a reverse geocode using the clicked location
        locatorTask.locationToAddress(event.mapPoint)
            .then(response => {
                // If an address is successfully found, print it to the popup's content
                popup.title = response.address.Match_addr;
                popup.content = template(
                    event.mapPoint.latitude, event.mapPoint.longitude, response.address.Match_addr);
            })
            .otherwise(err => {
                // If the promise fails and no result is found, print a generic message to the popup's content
                popup.content = "No address was found for this location";
            });
    }
}

function template(lat, lon, address) {
    return '' +
`<form id='donorForm'>
    <input type='hidden' name='lat' value='${lat}'>
    <input type='hidden' name='lon' value='${lon}'>
    <input type='hidden' name='address' value='${address}'>
    <ul>
        <li>
            <label for='firstName'>First Name</label> 
            <input type='text' name='firstName' id='firstName' required
                title='First Name is required'>
        </li>
        <li>
            <label for='lastName'>Last Name</label> 
            <input type='text' name='lastName' id='lastName' required
                title='Last Name is required'>
        </li>
        <li>
            <label for='contactNumber'>Contact Number</label>
            <input type='tel' pattern='[\\+]\\d{2}[\\(]\\d{2}[\\)]\\d{4}[\\-]\\d{4}' title='Contact Number (Format: +99(99)9999-9999)'
                name='contactNumber' id='contactNumber' required>
        </li>
        <li>
            <label for='email'>Email Address</label> 
            <input type='email' name='email' id='email' required
                title='Email Address (Format: somename@domain.root)'>
        </li>
        <li>
            <label for='bloodGroup'>Blood Group</label> 
            <select name='bloodGroup' id='bloodGroup' required title='Blood Group is required'>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
            </select>
        </li>
    </ul>
</form>`;
}

function saveDonor(popup) {
    let form = document.getElementById('donorForm');

    if (!form.reportValidity()) {
        return;
    }

    let fd = new FormData(form);
    let donor = {};
    for (let [key, value] of fd) {
        donor[key] = value;
    }

    esriRequest('/donors', {method: 'post', query: donor})
        .then(response => {
            popup.content =
                `Thank you! You can edit your info <a href="/edit.html?${response.data.id}">here</a>`;
        });
}