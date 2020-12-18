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
const Journey = ({ blueLine, redLine, strokeColor, fillColor, visible, drumVector, saxVector, polygonOpacity }) => {

    const drumPolygonOption = {
        strokeColor: "orange",
        strokeOpacity: 1,
        strokeWeight: 2,
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
        strokeWeight: 2,
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

    const asyncTownPolyline = {
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
        else
            return [
                { lat: Movements.metadata[vector[0]].lat, lng: Movements.metadata[vector[0]].lng },
                { lat: Movements.metadata[vector[1]].lat, lng: Movements.metadata[vector[1]].lng }
            ]
    }

    function vectorsEqual(vector1, vector2) {
        if (vector1 === null || vector2 === null) {
            return false
        }
        if (vector1[0] === vector2[0] && vector1[1] === vector2[1]) {
            return true
        } else {
            return false
        }
    }

    return (
        <>
            <Polygon
                paths={blueLine.filter(function (path) {
                    if (path === null)
                        return false
                    else return true
                }).map((path, key) => {
                    return ({
                        lat: Movements.metadata[path[0]].lat,
                        lng: Movements.metadata[path[0]].lng
                    },
                    {
                        lat: Movements.metadata[path[1]].lat,
                        lng: Movements.metadata[path[1]].lng
                    })
                })}
                options={drumPolygonOption}
            />
            <Polygon
                paths={redLine.filter(function (path) {
                    if (path === null)
                        return false
                    else return true
                }).map((path, key) => {
                    return ({
                        lat: Movements.metadata[path[0]].lat,
                        lng: Movements.metadata[path[0]].lng
                    },
                    {
                        lat: Movements.metadata[path[1]].lat,
                        lng: Movements.metadata[path[1]].lng
                    })
                })}
                options={saxPolygonOption}
            />
            {
                vectorsEqual(drumVector, saxVector) === false ?
                    Array.isArray(drumVector) === true ?
                        <Polyline
                            path={getCoordinates(drumVector)}
                            options={drumPolyline}

                        /> : null
                    : null
            }
            {
                vectorsEqual(drumVector, saxVector) === false ?
                    Array.isArray(saxVector) === true ?
                        <Polyline
                            path={getCoordinates(saxVector)}
                            options={saxPolyline}

                        /> : null
                    : null
            }
            {
                vectorsEqual(drumVector, saxVector) === true ?
                    <Polyline
                        path={getCoordinates(saxVector)}
                        options={asyncTownPolyline}
                    />
                    : null
            }
        </>
    )
}

export default Journey
