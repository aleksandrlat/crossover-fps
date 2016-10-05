import FeatureLayer from "esri/layers/FeatureLayer";
import SimpleRenderer from "esri/renderers/SimpleRenderer";
import SimpleMarkerSymbol from "esri/symbols/SimpleMarkerSymbol";

/**************************************************
 * Define the specification for each field to create
 * in the layer
 **************************************************/

var fields = [
    {
        name: "id",
        alias: "id",
        type: "oid"
    },
    {
        name: "address",
        alias: "address",
        type: "string"
    },
    {
        name: "firstName",
        alias: "firstName",
        type: "string"
    },
    {
        name: "lastName",
        alias: "lastName",
        type: "string"
    },
    {
        name: "contactNumber",
        alias: "contactNumber",
        type: "string"
    },
    {
        name: "email",
        alias: "email",
        type: "string"
    },
    {
        name: "bloodGroup",
        alias: "bloodGroup",
        type: "integer"
    }
];

// Set up popup template for the layer
var pTemplate = {
    title: "{firstName} {lastName}",
    content: [{
        type: "fields",
        fieldInfos: [
            {
                fieldName: "address",
                label: "Address",
                visible: true
            },
            {
                fieldName: "firstName",
                label: "First Name",
                visible: true
            },
            {
                fieldName: "lastName",
                label: "Last Name",
                visible: true
            },
            {
                fieldName: "contactNumber",
                label: "Contact Number",
                visible: true
            },
            {
                fieldName: "email",
                label: "Email",
                visible: true
            },
            {
                fieldName: "bloodGroup",
                label: "Blood Group",
                visible: true
            }
        ]
    }]
};

var donorRenderer = new SimpleRenderer({
    symbol: new SimpleMarkerSymbol({
        size: 8,
        color: '#FF4000',
        declaredClass: 'donorMarker'
    })
});

export default function (graphics) {
    return new FeatureLayer({
        source: graphics, // autocast as an array of esri/Graphic
        // create an instance of esri/layers/support/Field for each field object
        fields: fields, // This is required when creating a layer from Graphics
        objectIdField: "id", // This must be defined when creating a layer from Graphics
        renderer: donorRenderer, // set the visualization on the layer
        spatialReference: { wkid: 4326 },
        geometryType: "point", // Must be set when creating a layer from Graphics
        popupTemplate: pTemplate
    });
}