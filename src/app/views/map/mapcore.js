
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import esriConfig from "@arcgis/core/config";
import TimeSlider from "@arcgis/core/widgets/TimeSlider";
import Field from "@arcgis/core/layers/support/Field";
import TimeInfo from "@arcgis/core/layers/support/TimeInfo";

// let temp = {"LAT": 45.98938, "LON": -130.7382, "BaseTime": "2017-07-03 13:02:36"}

const HYDROPHONES = [
    { location: 'Slope Base', latitude: 44.5153, longitude: -125.39 },
    { location: 'Axial Base', latitude: 45.8168, longitude: -129.754 },
    { location: 'Southern Hydrate', latitude: 44.5691, longitude: -125.1479 },
    { location: 'Central Caldera', latitude: 45.9546, longitude: -130.0089 },
    { location: 'Eastern Caldera', latitude: 45.9396, longitude: -129.9738 },
    { location: 'Oregon Slope', latitude: 44.529, longitude: -125.3893 },
    { location: 'Oregon Offshore', latitude: 44.3695, longitude: -124.954 },
    { location: 'Oregon Shelf', latitude: 44.6371, longitude: -124.306 },
]

const noop = () => { };

esriConfig.apiKey = "AAPK460c081ffc584c5090c2b383ede3366b1JA6FLMBYno7qMVVlHo12K6EOAtFnfYV_6UQH2_bUGzYM0qQIBxyfrSfrVF8mJM8";


const layer = new FeatureLayer({
    url: "https://services8.arcgis.com/7yPK7vytRf49nyPG/arcgis/rest/services/extra_ship_ais/FeatureServer/0"
});


// ******* create timeslider ********
export const webmap = new WebMap({
    portalItem: {
        id: "aa1d3f80270146208328cf66d022e09c",
    },
    basemap: "arcgis-oceans",
    layers: [layer]
});

export const view = new MapView({
    map: webmap,
    center: [-127, 45], //Longitude, latitude
    zoom: 8
});

// let polylineSymbol = {
//     type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
//     color: [226, 119, 40]
// };

// let sourceGraphics = [];

// for (let i = 0; i < 10; i++)
// {
//     let item = ShipData[i];

//     let polyline = {
//         type: "point",  // autocasts as new Point()
//         longitude: item["LON"],
//         latitude: item["LAT"]
//     };

//     let polylineAtt = {
//         objectId: i,
//         Name: "dot",
//         // time: new Date(2020, 1, 1).getTime()  // year, month (0-based), day
//         time: new Date(Date.parse(item["BaseTime"])).getTime()  // year, month (0-based), day
//     };

//     let polylineGraphic = new Graphic({
//         geometry: polyline,
//         symbol: polylineSymbol,
//         attributes: polylineAtt,
//     });
//     sourceGraphics.push(polylineGraphic)
// }


// const layer = new FeatureLayer({
//     apiKey: "AAPK460c081ffc584c5090c2b383ede3366b1JA6FLMBYno7qMVVlHo12K6EOAtFnfYV_6UQH2_bUGzYM0qQIBxyfrSfrVF8mJM8",
//     source: sourceGraphics,
//     fields: [
//         new Field( {
//             name: "objectId",
//             alias: "Object ID",
//             type: "oid",
//         }), new Field( {
//             name: "name",
//             alias: "Name",
//             type: "string",
//         }), new Field ({
//             name: "time",
//             alias: "Time",
//             type: "date",
//         })
//     ],
//     timeInfo: new TimeInfo({
//         startField: "time",
//         endField: "time",
//         fullTimeExtent: {
//             start: new Date(2014, 0, 1),
//             end: new Date(2020, 11, 31)
//         },
//     })
// });

layer.renderer = {
    type: "simple",  // autocasts as new SimpleRenderer()
    symbol: {
        type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
        size: 2,
        color: [113, 15, 184],
        outline: {  // autocasts as new SimpleLineSymbol()
            width: 0.1,
            color: "white"
        }
    }
};



let timeSlider;
TimeSlider.getPropertiesFromWebMap(webmap).then(
    (timeSliderSettings) => {
        const timeSliderDiv = document.createElement("div");
        timeSliderDiv.id = "timeSliderDiv";
        timeSliderDiv.style.width = "600px";
        timeSlider = new TimeSlider({
            ...timeSliderSettings, // imported settings from webmap
            view: view,
            container: timeSliderDiv,
            fullTimeExtent: {
                start: new Date(2015, 0, 1),
                end: new Date(2020, 11, 31)
            },
        });
        // view.whenLayerView(layer).then((lv) => {
        //     // around up the full time extent to full hour
        //     timeSlider.fullTimeExtent =
        //     layer.timeInfo.fullTimeExtent.expandTo("hours");
        // });
        view.ui.add(timeSlider, "bottom-left");
    }
);


// webmap.add(layer)

// ********* from here, render the major components in map *********
HYDROPHONES.forEach(element => {
    const measureThisAction = {
        title: "Get Info",
        id: "show_popup",
        location: element.location
    };

    const point = {
        type: "point",
        longitude: element["longitude"],
        latitude: element["latitude"]
    };
    const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],  // Orange
        outline: {
            color: [255, 255, 255], // White
            width: 1
        }
    };

    const popupTemplate = {
        title: "{Name}",
        content: "<div>Latitude: {Lat}, Longitude: {Lon}</div>",
        actions: [measureThisAction]
    }
    const attributes = {
        Name: element.location,
        Lat: element.latitude,
        Lon: element.longitude,
        Description: "I am a hydrophone"
    }

    const pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol,
        attributes: attributes,
        popupTemplate: popupTemplate
    });
    view.graphics.add(pointGraphic);
});

export const initialize = (container, setCurrentLocation, handleOpenDialog) => {
    view.popup.on("trigger-action", (event) => {
        if (event.action.id === "show_popup")
        {
            setCurrentLocation(event.action.location)
            handleOpenDialog(true, event.action.location)
        }
    });

    view.container = container;
    view
        .when()
        .then(_ => {
            // console.log("Map and View are ready");
        })
        .catch(noop);
    return () => {
        view.container = null;
    };
};
