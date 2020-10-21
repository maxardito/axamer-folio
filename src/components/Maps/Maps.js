import React, { useState, useContext, useEffect } from "react";
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

const Maps = ({ videoRef, selectedTownRef, currentJourney, onTownChange, journeyVisibility, docMode }) => {

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
                return '/previousPin.png'
            } else {
                return '/dot.png'
            }
        } else {
            return '/pin.png'
        }
    }

    const [selectedTown, setSelectedTown] = useContext(SelectedTownContext);
    const [nextTown, setNextTown] = useState(null)
    const [previousTown, setPreviousTown] = useState(null)

    useEffect(() => {
        let currentIndex = 0;
        let cj = currentJourney;

        setSelectedTown(Movements.metadata[cj.sequence[currentIndex]]);
        setNextTown(Movements.metadata[cj.sequence[currentIndex + 1]]);
        setPreviousTown(Movements.metadata[cj.sequence[currentIndex - 1]]);
        //onTownChange(Movements.metadata[cj.sequence[currentIndex]])

        const interval = setInterval(() => {
            /**
             * Pathway setting logic, setting current previous and next town
             * based on video timestamps
             */
            let currentTime = Math.trunc(videoRef.current.getCurrentTime());
            for (var i = 0; i < cj.sequence.length; i++) {
                let currentTown = cj.timeStamps[i];
                let nextTown = cj.timeStamps[i + 1] ? cj.timeStamps[i + 1] : cj.videoLength;
                if (currentTime >= currentTown && currentTime < nextTown) {
                    if (currentIndex !== i) {
                        currentIndex = i;
                        setSelectedTown(Movements.metadata[cj.sequence[i]])
                        setNextTown(Movements.metadata[cj.sequence[i + 1]])
                        setPreviousTown(Movements.metadata[cj.sequence[i - 1]]);
                        //onTownChange(Movements.metadata[cj.sequence[i]])
                    }
                }
            }
        }, 500);
        return () => clearInterval(interval);
    }, [videoRef, onTownChange, setSelectedTown, currentJourney]);



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
                        fillColor={docMode ? "2A2321" : journey.fillColor}
                        key={key}
                        selectedTown={selectedTown}
                        nextTown={nextTown ? nextTown : selectedTown}
                        previousTown={previousTown ? previousTown : selectedTown}

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
                        <div style={{ width: "auto" }}>
                            <h1>{selectedTown.name}</h1>
                            {/** <iframe title={"header"} src={"popups/11.pdf#toolbar=0&navpanes=0&zoom=50"} style={{ width: "100%" }} />*/}
                        </div>
                    </InfoWindow>
                ) : null}
            </GoogleMap>
        </div>
    )
}

export default Maps