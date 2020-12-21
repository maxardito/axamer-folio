import React from "react"
import {
    Polygon,
    Polyline
} from "@react-google-maps/api"
import Movements from "../Movements.json";

/**
 * Journey
 * 
 * Represents a path taken by a given ensemble. Ensemble path
 * data is located in Journeys.json
 * //TODO: Look up how to do params
 * 
 * @param {*} sequence The sequence 
 */
const Journey = ({ visible, drumSequence, saxSequence, strokeColor, fillColor, drumVector, saxVector, duoVector, polygonOpacity }) => {
    const drumPolygonOption = {
        strokeColor: "orange",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: fillColor,
        fillOpacity: polygonOpacity,
        clickable: false,
        draggable: false,
        editable: false,
        visible: visible,
        radius: 30000,
        zIndex: 0
    };

    const saxPolygonOption = {
        strokeColor: "yellow",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: fillColor,
        fillOpacity: polygonOpacity,
        clickable: false,
        draggable: false,
        editable: false,
        visible: visible,
        radius: 30000,
        zIndex: 0
    };

    const drumPolyline = {
        geodesic: true,
        strokeColor: "blue",
        visible: visible,
        strokeOpacity: 1,
        strokeWeight: 6,
    };

    const saxPolyline = {
        geodesic: true,
        strokeColor: "red",
        visible: visible,
        strokeOpacity: 1,
        strokeWeight: 6,
    };

    const duoPolyline = {
        geodesic: true,
        strokeColor: "purple",
        visible: visible,
        strokeOpacity: 1,
        strokeWeight: 6,
    };

    function getCoordinates(vector) {
        if (vector === null) {
            return false;
        }
        else {
            let coordinatePath = vector.map((path, key) => {
                return { lat: Movements.metadata[path].lat, lng: Movements.metadata[path].lng }
            })

            return coordinatePath
        }
    }

    let drumPolygon, saxPolygon;
    if (drumSequence) {
        drumPolygon = drumSequence.map((town, key) => {
            return ({
                lat: Movements.metadata[town].lat,
                lng: Movements.metadata[town].lng
            })
        });
    } else {
        drumPolygon = "Loading...";
    }

    if (saxSequence) {
        saxPolygon = saxSequence.map((town, key) => {
            return ({
                lat: Movements.metadata[town].lat,
                lng: Movements.metadata[town].lng
            })
        });
    } else {
        saxPolygon = "Loading...";
    }



    return (
        <>
            <Polygon
                paths={drumPolygon}
                options={drumPolygonOption}
            />

            <Polygon
                paths={saxPolygon}
                options={saxPolygonOption}
            />


            {

                Array.isArray(drumVector) === true ?
                    <Polyline
                        path={getCoordinates(drumVector)}
                        options={drumPolyline}

                    /> : null

            }
            {

                Array.isArray(saxVector) === true ?
                    <Polyline
                        path={getCoordinates(saxVector)}
                        options={saxPolyline}

                    /> : null

            }
            {
                Array.isArray(duoVector) === true ?
                    <Polyline
                        path={getCoordinates(duoVector)}
                        options={duoPolyline}
                    />
                    : null
            }
        </>
    )
}

export default Journey
