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
            if ((selectedTown ? selectedTown.id : 0) === pin.id) {
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
    const [currentIndex, setCurrentIndex] = useState(0)
    const [journeyRef, setJourneyRef] = useState(currentJourney)

    useEffect(() => {

        if (!isLoaded) {
            setSelectedTown(Movements.metadata[currentJourney.sequence[currentIndex]]);
            setNextTown(Movements.metadata[currentJourney.sequence[currentIndex + 1]]);
            setPreviousTown(Movements.metadata[currentJourney.sequence[currentIndex - 1]]);
            onTownChange(Movements.metadata[currentJourney.sequence[currentIndex]]);
        }

        const interval = setInterval(() => {
            /**
             * Pathway setting logic, setting current previous and next town
             * based on video timestamps
             */
            let currentTime = Math.trunc(videoRef.current.getCurrentTime());
            for (var i = 0; i < currentJourney.sequence.length; i++) {
                let currentTown = currentJourney.timeStamps[i];
                let nextTown = currentJourney.timeStamps[i + 1] ? currentJourney.timeStamps[i + 1] : currentJourney.videoLength;
                if (currentTime >= currentTown && currentTime < nextTown) {

                    // If timestamp changes
                    if (currentIndex !== i) {
                        setCurrentIndex(i)
                        setSelectedTown(Movements.metadata[currentJourney.sequence[i]])
                        setNextTown(Movements.metadata[currentJourney.sequence[i + 1]])
                        setPreviousTown(Movements.metadata[currentJourney.sequence[i - 1]]);
                        onTownChange(Movements.metadata[currentJourney.sequence[i]])
                    }

                    // If journey changes
                    if (journeyRef !== currentJourney) {
                        setSelectedTown(Movements.metadata[currentJourney.sequence[i]])
                        setNextTown(Movements.metadata[currentJourney.sequence[i + 1]])
                        setPreviousTown(Movements.metadata[currentJourney.sequence[i - 1]]);
                        onTownChange(Movements.metadata[currentJourney.sequence[i]])
                        setJourneyRef(currentJourney)
                    }
                }
            }
        }, 500);
        return () => clearInterval(interval);
    }, [videoRef, onTownChange, setSelectedTown, currentJourney, journeyRef, isLoaded, currentIndex]);



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
                        <div style={{ width: "20vw", height: "auto" }}>
                            <img src={"popups/" + selectedTown.id + ".jpg"}
                                style={{ width: "100%", height: "100%" }}
                                alt={"Town Name"}
                            />
                        </div>
                    </InfoWindow>
                ) : null}
            </GoogleMap>
        </div>
    )
}

export default Maps