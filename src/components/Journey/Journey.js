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
const Journey = ({ sequence, strokeColor, fillColor, visible, selectedTown, nextTown, previousTown, polygonOpacity }) => {

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

    const asyncTownPolyline = {
        geodesic: true,
        strokeColor: "purple",
        visible: visible,
        strokeOpacity: 1,
        strokeWeight: 6,
    };

    function getSelectedTownCoordinates(backwards) {
        let direction = backwards ? 0 : 1
        if (Array.isArray(selectedTown)) {
            return { lat: selectedTown[direction].lat, lng: selectedTown[direction].lng }
        } else {
            return { lat: selectedTown.lat, lng: selectedTown.lng }
        }
    }

    function getNextTownCoordinates() {
        if (Array.isArray(nextTown)) {
            return { lat: nextTown[0].lat, lng: nextTown[0].lng }
        } else {
            return { lat: nextTown.lat, lng: nextTown.lng }
        }
    }

    function getPreviousTownCoordinates() {
        if (Array.isArray(previousTown)) {
            return { lat: previousTown[1].lat, lng: previousTown[1].lng }
        } else {
            return { lat: previousTown.lat, lng: previousTown.lng }
        }
    }

    return (
        <>
            <Polygon
                paths={sequence.map((num, key) => {
                    if (Array.isArray(num)) {
                        return ({
                            lat: Movements.metadata[num[0]].lat,
                            lng: Movements.metadata[num[0]].lng
                        },
                        {
                            lat: Movements.metadata[num[1]].lat,
                            lng: Movements.metadata[num[1]].lng
                        })
                    } else {
                        return {
                            lat: Movements.metadata[num].lat,
                            lng: Movements.metadata[num].lng
                        }
                    }
                })}
                options={polygonOption}
            />
            <Polyline
                path={[
                    getSelectedTownCoordinates(false),
                    getNextTownCoordinates()]
                }
                options={nextTownPolyline}

            />
            <Polyline
                path={[
                    getSelectedTownCoordinates(true),
                    getPreviousTownCoordinates()]
                }
                options={previousTownPolyline}

            />
            {Array.isArray(selectedTown) ? <Polyline
                path={[
                    { lat: selectedTown[0].lat, lng: selectedTown[0].lng },
                    { lat: selectedTown[1].lat, lng: selectedTown[1].lng }]
                }
                options={asyncTownPolyline}

            /> : null}
        </>
    )
}

export default Journey
