
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import Search from "@arcgis/core/widgets/Search";
import Feature from "@arcgis/core/widgets/Feature";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import esriConfig from "@arcgis/core/config";
// import { useDispatch, useSelector } from 'react-redux'
import TimeSlider from "@arcgis/core/widgets/TimeSlider";
import TimeExtent from "@arcgis/core/TimeExtent";

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
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/California_fires_since_2014/FeatureServer/"
});




console.log("layer", layer)

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
        content: "<div>I am a Hydrophone</div>",
        actions: [measureThisAction]
    }
    const attributes = {
        Name: element.location,
        Description: "I am a hydrophone"
    }

    const pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol,
        attributes: attributes,
        popupTemplate: popupTemplate
    });
    view.graphics.add(pointGraphic);
    // graphicsLayer.add(pointGraphic);
});

// export const search = new Search({ view });
// view.ui.add(search, "top-right");

export const initialize = (container, setCurrentLocation, handleOpenDialog) => {
    // const { graphList = [] } = useSelector((state) => state.graph)

    view.popup.on("trigger-action", (event) => {
        // Execute the measureThis() function if the measure-this action is clicked
        if (event.action.id === "show_popup")
        {
            setCurrentLocation(event.action.location)
            handleOpenDialog(true, event.action.location)
        }
    });

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
                    start: new Date(2000, 5, 1),
                    end: new Date(2020, 0, 1)
                },
            });

            view.whenLayerView(layer).then((lv) => {
                // around up the full time extent to full hour
                // timeSlider.fullTimeExtent =
                //     layer.timeInfo.fullTimeExtent.expandTo("hours");
                // timeSlider.stops = {
                //     interval: layer.timeInfo.interval
                // };
            });



            view.ui.add(timeSlider, "bottom-left");
        }
    );

    view.container = container;
    view
        .when()
        .then(_ => {
            console.log("Map and View are ready");
        })
        .catch(noop);
    return () => {
        view.container = null;
    };
};
