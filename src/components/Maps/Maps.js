import React, { useContext, useEffect } from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";

import { SelectedTownContext } from "../../contexts/SelectedTown.js"

import mapStyles from "./MapStyles.js";
import Journey from "../Journey/Journey.js";
import Journeys from "../Journey/Journeys.json";
import Movements from "../Movements.json";
import Style from "./maps.module.scss";

const libraries = [null];

const Maps = ({ videoRef, currentJourney, journeyVisibility, docMode }) => {

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const mapContainerStyle = {
        width: "99vw",
        height: "86.5vh",
    };

    const CENTER = {
        lat: 47.38037,
        lng: 11.3516,
    };

    const DOCMODE_CENTER = {
        lat: 47.38037,
        lng: 11.6516,
    };

    const MAP_BOUNDARIES = {
        north: 47.3827,
        south: 47.000580,
        east: 12.8588,
        west: 10.900
    }

    const options = {
        styles: mapStyles,
        disableDefaultUI: true,
        mapTypeId: "hybrid",
        minZoom: 11,
        restriction: {
            latLngBounds: MAP_BOUNDARIES,
            strictBounds: false
        }
    };


    function getPinIcon(pin) {
        if (docMode) {
            if (selectedTown.id === pin.id) {
                return '/pin.png'
            } else if (currentJourney.sequence.findIndex(function (e) { return e === pin.id }) === selectedTown.id + 1) {
                return '/nextPin.png'
            } else {
                return '/dot.png'
            }
        } else {
            return '/pin.png'
        }
    }

    const [selectedTown, setSelectedTown] = useContext(SelectedTownContext);

    useEffect(() => {
        let counter = 0;
        let currentJourney = Journeys.metadata[0]
        setSelectedTown(Movements.metadata[currentJourney.sequence[counter]])
        const interval = setInterval(() => {
            if (Math.trunc(videoRef.current.getCurrentTime()) === currentJourney.timeStamps[counter]) {
                setSelectedTown(Movements.metadata[currentJourney.sequence[counter]])
                counter++;
            }
        }, 500);
        return () => clearInterval(interval);
    }, [videoRef, setSelectedTown]);



    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading maps";

    return (
        <div className={Style.viewBox}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={11}
                options={options}
                center={docMode ? DOCMODE_CENTER : CENTER}
            >
                {/** Journeys (renditions) by different ensembles */}
                {Journeys.metadata.map((journey, key) => {
                    return <Journey
                        visible={journeyVisibility[key]}
                        sequence={journey.sequence}
                        strokeColor={journey.strokeColor}
                        fillColor={docMode ? "gray" : journey.fillColor}
                        key={key}
                        selectedTown={selectedTown}
                        nextTown={Movements.metadata[currentJourney.sequence[selectedTown.id + 1]]}
                    />
                })}

                {/** Pins, text bubbles, markers */}
                {Movements.metadata.map((pin) => (
                    <div className={Style.blinkingMarker}>
                        <Marker
                            key={pin.id}
                            position={{ lat: pin.lat, lng: pin.lng }}
                            icon={{
                                url: getPinIcon(pin),
                                scaledSize: new window.google.maps.Size(30, 30),
                                origin: new window.google.maps.Point(0, 0),
                                anchor: new window.google.maps.Point(15, 15),
                            }}
                            onClick={() => {
                                //setSelectedTown(pin)
                                //let index = currentJourney.sequence.findIndex(function (e) { return e === pin.id })
                                //videoRef.current.seekTo(currentJourney.timeStamps[index])
                            }}
                        />
                    </div>
                ))}

                {/** Pin bubble pop-up logic */}
                {selectedTown ? (
                    <InfoWindow position={{ lat: selectedTown.lat, lng: selectedTown.lng }}>
                        <div style={{ width: "30vw" }}>
                            <iframe src={"popups/11.pdf#toolbar=0&navpanes=0&zoom=50"} style={{ width: "100%" }} />
                        </div>
                    </InfoWindow>
                ) : null}
            </GoogleMap>
        </div>
    )
}

export default Maps