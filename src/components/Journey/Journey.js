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
const Journey = ({ sequence, strokeColor, fillColor, visible, selectedTown, nextTown }) => {
    const polygonOption = {
        strokeColor: strokeColor,
        strokeOpacity: 0.3,
        strokeWeight: 2,
        fillColor: fillColor,
        fillOpacity: 0.35,
        clickable: false,
        draggable: false,
        editable: false,
        visible: visible,
        radius: 30000,
        zIndex: 1
    };

    const polylineOption = {
        geodesic: true,
        strokeColor: "blue",
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
                options={polylineOption}

            />
        </>
    )
}

export default Journey
