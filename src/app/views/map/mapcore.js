
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import esriConfig from "@arcgis/core/config";
import TimeSlider from "@arcgis/core/widgets/TimeSlider";

const HYDROPHONES = [
    { location: 'Slope Base', latitude: 44.5153, longitude: -125.39, products: ['OBS, Low Frequency & Broadband Hydrophones']},
    { location: 'Axial Base', latitude: 45.8168, longitude: -129.754, products: ['CTD, OBS, Low Frequency & Broadband Hydrophones']},
    { location: 'Southern Hydrate', latitude: 44.5691, longitude: -125.1479, products: ['OBS, Low Frequency Hydrophones']},
    { location: 'Central Caldera', latitude: 45.9546, longitude: -130.0089, products: ['OBS, Low Frequency Hydrophones'] },
    { location: 'Eastern Caldera', latitude: 45.9396, longitude: -129.9738, products: ['OBS, Low Frequency Hydrophones'] },
    // { location: 'Oregon Slope', latitude: 44.529, longitude: -125.3893 },
    { location: 'Oregon Offshore', latitude: 44.3695, longitude: -124.954, products: ['CTD, Broadband Hydrophones, Meteorological Data'] },
    { location: 'Oregon Shelf', latitude: 44.6371, longitude: -124.306, products: ['CTD, Broadband Hydrophones, Meteorological Data'] },
    { location: 'Axial Ashes', latitude: 45.933559, longitude: -129.999207, products: ['OBS'] },
    { location: 'Axial International', latitude: 45.925732, longitude: -129.977997, products: ['OBS'] },
]

const noop = () => { };

esriConfig.apiKey = "AAPK460c081ffc584c5090c2b383ede3366b1JA6FLMBYno7qMVVlHo12K6EOAtFnfYV_6UQH2_bUGzYM0qQIBxyfrSfrVF8mJM8";

// const AIS_extra_2015 = new FeatureLayer({
//     url: "https://services8.arcgis.com/7yPK7vytRf49nyPG/arcgis/rest/services/ais_2015_day_1/FeatureServer/0"
//   });

// ******* create timeslider ********
export const webmap = new WebMap({
    portalItem: {
        id: "aa1d3f80270146208328cf66d022e09c",
    },
    basemap: "arcgis-oceans",
    // layers: [AIS_extra_2015]
});

export const view = new MapView({
    map: webmap,
    center: [-127, 45], //Longitude, latitude
    zoom: 8
});

// AIS_extra_2015.renderer = {
//     type: "simple",  // autocasts as new SimpleRenderer()
//     symbol: {
//         type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
//         size: 2,
//         color: [113, 15, 184],
//         outline: {  // autocasts as new SimpleLineSymbol()
//             width: 0.1,
//             color: "white"
//         }
//     }
// };

// webmap.add(layer)

// ********* from here, render the major components in map *********
HYDROPHONES.forEach(element => {
    const measureThisAction = {
        title: "Explore Data",
        id: "show_popup",
        location: element.location
    };

    const point = {
        type: "point",
        longitude: element["longitude"],
        latitude: element["latitude"],
        products: element['products']
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
        content: "<div>Latitude: {Lat}, Longitude: {Lon}</div><div>Products: {Prod}</div>",
        // content: "<div>Products: {Prod}</div>",
        actions: [measureThisAction]
    }
    const attributes = {
        Name: element.location,
        Lat: element.latitude,
        Lon: element.longitude,
        Prod: element.products,
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

// const polygon = {
//     type: "polygon",
//     rings: [
//         [-132.79, 47.750],
//         [-127, 47.750],
//         [-127, 43.93],
//         [-132.79, 43.93],
//     ]
// };


// const simpleFillSymbol = {
//     type: "simple-fill",
//     color: [50,100,200,.15],
//     outline: {
//         color: [129, 9, 176],
//         width: 1
//     }
// };

// const polygonGraphic = new Graphic({
//     geometry: polygon,
//     symbol: simpleFillSymbol
// });

// view.graphics.add(polygonGraphic);



// const polygon2 = {
//     type: "polygon",
//     rings: [
//         [-128, 46.37],
//         [-122, 46.44],
//         [-122, 42.57],
//         [-128, 42.57],
//     ]
// };

// const simpleFillSymbol2 = {
//     type: "simple-fill",
//     color: [50,100,200,.15],
//     outline: {
//         color: [129, 9, 176],
//         width: 1
//     }
// };

// const polygonGraphic2 = new Graphic({
//     geometry: polygon2,
//     symbol: simpleFillSymbol2
// });

// view.graphics.add(polygonGraphic2);



export const initialize = (container, setCurrentLocation, handleOpenDialog) => {
    view.popup.on("trigger-action", (event) => {
        if (event.action.id === "show_popup")
        {
            setCurrentLocation(event.action.location)
            handleOpenDialog(true, event.action.location)
        }
    });

    let timeSlider;

    // TimeSlider.getPropertiesFromWebMap(webmap).then(
    //     (timeSliderSettings) => {
    //         const timeSliderDiv = document.createElement("div");
    //         timeSliderDiv.id = "timeSliderDiv";
    //         timeSliderDiv.style.width = "800px";
    //         timeSlider = new TimeSlider({
    //             ...timeSliderSettings, // imported settings from webmap
    //             view: view,
    //                 //     container: "timeSlider",
    //             container: 'timeSlider',
    //             fullTimeExtent: {
    //                 start: new Date(Date.UTC(2015, 0, 1, 0)),
    //                 end: new Date(Date.UTC(2015, 0, 1, 23))
    //             },
    //         });
    //         view.whenLayerView(AIS_extra_2015).then((lv) => {
    //             // around up the full time extent to full hour
    //             timeSlider.fullTimeExtent =
    //             AIS_extra_2015.timeInfo.fullTimeExtent.expandTo("hours");
    //         });
    //         // view.whenLayerView(AIS_extra_2015).then((lv) => {
    //         //     timeSlider.timeExtent = {
    //         //         start: new Date(Date.UTC(2015, 0, 1, 4)),
    //         //         end: new Date(Date.UTC(2015, 0, 1, 6))
    //         //     };

    //         //     timeSlider.stops = {
    //         //         interval: AIS_extra_2015.timeInfo.interval
    //         //     };
    //         // });
    //         view.ui.add(timeSlider, "bottom-left");
    //     }
    // );

    // const timeSlider = new TimeSlider({
    //     container: "timeSlider",
    //     view: view,
    //     timeVisible: true, // show the time stamps on the timeslider
    //     // loop: true
    // });


    // view.whenLayerView(AIS_extra_2015).then((lv) => {
    //     // around up the full time extent to full hour
    //     timeSlider.fullTimeExtent = {
    //         start: new Date(Date.UTC(2015, 0, 1, 0)),
    //         end: new Date(Date.UTC(2015, 0, 1, 23))
    //     };
    //     timeSlider.timeExtent = {
    //         start: new Date(Date.UTC(2015, 0, 1, 4)),
    //         end: new Date(Date.UTC(2015, 0, 1, 6))
    //     };

    //     timeSlider.stops = {
    //         interval: AIS_extra_2015.timeInfo.interval
    //     };
    // });


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
