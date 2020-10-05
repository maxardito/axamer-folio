import React from "react"
import {
    Polygon
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
const Journey = ({ sequence, strokeColor, fillColor, visible }) => {
    const option = {
        strokeColor: strokeColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: fillColor,
        fillOpacity: 0.35,
        clickable: false,
        draggable: false,
        editable: false,
        visible: visible,
        radius: 30000,
        zIndex: 1
    }

    return (
        <Polygon
            paths={sequence.map((num, key) => {
                return {
                    lat: Movements.metadata[num].lat,
                    lng: Movements.metadata[num].lng
                }
            })}
            options={option}
        />
    )
}

export default Journey
