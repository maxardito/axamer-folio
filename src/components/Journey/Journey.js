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
const Journey = ({ sequence, strokeColor, fillColor, visible, selectedTown, nextTown, previousTown, isConvolved, polygonOpacity }) => {

    const polygonOption = {
        strokeColor: strokeColor,
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

    const nextTownPolyline = {
        geodesic: true,
        strokeColor: "red",
        visible: visible,
        strokeOpacity: 1,
        strokeWeight: 6,
    };

    const previousTownPolyline = {
        geodesic: true,
        strokeColor: "blue",
        visible: visible,
        strokeOpacity: 1,
        strokeWeight: 6,
    };

    const convolvedTownPolyline = {
        geodesic: true,
        strokeColor: "purple",
        visible: visible,
        strokeOpacity: 1,
        strokeWeight: 6,
    };

    return (
        <>
            <Polygon
                paths={sequence.map((num, key) => {
                    return {
                        lat: Movements.metadata[num].lat,
                        lng: Movements.metadata[num].lng
                    }
                })}
                options={polygonOption}
            />
            <Polyline
                path={[
                    { lat: selectedTown.lat, lng: selectedTown.lng },
                    { lat: nextTown.lat, lng: nextTown.lng }]
                }
                options={nextTownPolyline}

            />
            <Polyline
                path={[
                    { lat: selectedTown.lat, lng: selectedTown.lng },
                    { lat: previousTown.lat, lng: previousTown.lng }]
                }
                options={isConvolved ? convolvedTownPolyline : previousTownPolyline}

            />
        </>
    )
}

export default Journey
