import Point from "esri/geometry/Point";
import esriRequest from "esri/request";
import donorsLayer from "app/patient/donorsLayer";
import webMercatorUtils from "esri/geometry/support/webMercatorUtils";
import watchUtils from "esri/core/watchUtils";
import React, { Component } from "react";

let donors;

export default class Donors extends Component {
    constructor(props) {
        super(props);
        this.socket = null;
        this.lyr = null;
        this.mapHandler = null;
        this.rootElement = document.getElementById('viewDiv');
    }

    createLayer(graphics) {
        this.lyr = donorsLayer(graphics);
        this.props.map.add(this.lyr);
        return this.lyr;
    }

    subscribeOnDonors(lyr) {
        this.socket = io.connect(`${this.props.wsHost}/donors`);

        this.socket.on('newDonor', function (donor) {
            donors.push(donor);
            lyr.source.add(createGraphic(donor));
        });

        this.mapHandler = watchUtils.whenTrue(this.props.view, "stationary", () => {
            // Get the new extent of the view only when view is stationary.
            if (this.props.view.extent) {
                esriRequest("/donors", { query: this.geographicExtent().toJSON() })
                    .then(createGraphics)
                    .then(graphics => {
                        lyr.source.removeAll();
                        lyr.source.addMany(graphics);
                    });
            }
        });
    }

    geographicExtent() {
        return webMercatorUtils.webMercatorToGeographic(this.props.view.extent);
    }

    componentDidMount() {
        this.rootElement.addEventListener('click', showHidden, false);

        this.props.view.then((view) => {
            esriRequest("/donors", { query: this.geographicExtent().toJSON() })
                .then(createGraphics) // then send it to the createGraphics() method
                .then(this.createLayer.bind(this)) // when graphics are created, create the layer
                .then(this.subscribeOnDonors.bind(this))
                .otherwise(errback);
        });
    }

    componentWillUnmount() {
        this.rootElement.removeEventListener('click', showHidden);

        this.props.map.remove(this.lyr);
        this.mapHandler.remove();
        this.socket.disconnect();

        this.props.view.popup.close();
        this.props.view.popup.content = '';
    }

    render() {
        document.title = 'Patients\'s page';
        return (<div>Patients's page</div>);
    }
}

function showHidden(e) {
    let el = e.target;

    if (el.className == 'app-show-hidden') {
        let donor = donors.find(donor => donor._id == el.dataset.id);
        el.parentElement.textContent = donor[el.dataset.type];
    }
}

function createGraphics(response) {
    donors = response.data;
    return response.data.map(createGraphic);
}

function createGraphic(donor) {
    return {
        geometry: new Point({
            x: donor.lon,
            y: donor.lat
        }),
        attributes: {
            id: donor._id,
            address: donor.address,
            firstName: donor.firstName,
            lastName: donor.lastName,
            contactNumber: showHiddenFieldLink('contactNumber', donor._id),
            email: showHiddenFieldLink('email', donor._id),
            bloodGroup: donor.bloodGroup
        }
    };
}

function showHiddenFieldLink(type, id) {
    return `<a href="javascript:void(0)" data-type="${type}" data-id="${id}" class="app-show-hidden">show</a>`;
}

// Executes if data retrevial was unsuccessful.
function errback(error) {
    console.error("Creating legend failed. ", error);
}