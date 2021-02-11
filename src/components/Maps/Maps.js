import React, { useState, useEffect } from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";

import mapStyles from "./MapStyles.js";
import Journey from "../Journey/Journey.js";
import Journeys from "../Journey/Journeys.json";
import Movements from "../Movements.json";
import Style from "./maps.module.scss";

const libraries = [null];

const Maps = ({ videoRef, currentJourney, onTownChange, docMode, polygonOpacity }) => {

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const mapContainerStyle = {
        width: "100vw",
        height: "88vh",
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

    const DEFAULT_CENTER = {
        lat: 47.38037,
        lng: 11.6516,
    }

    const infoOptions = {
        backgroundColor: 1
    };

    const [pinPng, setPinPng] = useState(true)
    const [center, setCenter] = useState(DEFAULT_CENTER);

    function getPinIcon(pin) {
        if (((drumVector && (drumPin !== null) ? Movements.metadata[drumPin].id : false) === pin.id) && pinPng) {
            return '/drum-pin.svg';
        } else if (((saxVector && (saxPin !== null) ? Movements.metadata[saxPin].id : false) === pin.id) && pinPng) {
            return '/sax-pin.svg'
        } else if (((duoVector && (saxPin && drumPin !== null) ? Movements.metadata[saxPin].id : false) === pin.id) && pinPng) {
            return '/pin.png'
        } else {
            return '/dot.png'
        }

    }

    const [drumVector, setDrumVector] = useState(null);
    const [saxVector, setSaxVector] = useState(null);
    const [duoVector, setDuoVector] = useState(null);
    const [drumPin, setDrumPin] = useState(null);
    const [saxPin, setSaxPin] = useState(null);



    const [currentIndex, setCurrentIndex] = useState(0)
    const [journeyRef, setJourneyRef] = useState(currentJourney)
    const [infoWindow, setInfoWindow] = useState(0)

    useEffect(() => {

        let pinGate = false;

        if (!isLoaded) {
            setDrumVector(currentJourney.blueLine[currentIndex]);
            setSaxVector(currentJourney.redLine[currentIndex]);
            setDuoVector(currentJourney.purpleLine[currentIndex]);
            setDrumPin(currentJourney.drumPins[currentIndex])
            setSaxPin(currentJourney.saxPins[currentIndex])

            if (currentJourney.saxPins.length === currentIndex + 1) {
                onTownChange(currentJourney.saxPins[currentIndex], null,
                    currentJourney.drumPins[currentIndex], null);
            } else {
                onTownChange(currentJourney.saxPins[currentIndex], currentJourney.saxPins[currentIndex + 1],
                    currentJourney.drumPins[currentIndex], currentJourney.drumPins[currentIndex + 1]);
            }
        }

        const interval = setInterval(() => {
            /**
             * Pathway setting logic, setting current previous and next town
             * based on video timestamps
             */
            let currentTime = Math.trunc(videoRef.current ? videoRef.current.getCurrentTime() : 0);
            for (var i = 0; i < currentJourney.timeStamps.length; i++) {
                let currentTown = currentJourney.timeStamps[i];
                let nextTown = currentJourney.timeStamps[i + 1] ? currentJourney.timeStamps[i + 1] : currentJourney.videoLength;
                if (currentTime >= currentTown && currentTime < nextTown) {

                    // If timestamp changes
                    if (currentIndex !== i) {
                        setCurrentIndex(i)
                        setDrumVector(currentJourney.blueLine[i])
                        setSaxVector(currentJourney.redLine[i])
                        setDuoVector(currentJourney.purpleLine[i]);
                        setDrumPin(currentJourney.drumPins[i])
                        setSaxPin(currentJourney.saxPins[i])

                        if (currentJourney.saxPins.length === i + 1) {
                            onTownChange(currentJourney.saxPins[i], null,
                                currentJourney.drumPins[i], null);
                        } else {
                            onTownChange(currentJourney.saxPins[i], currentJourney.saxPins[i + 1],
                                currentJourney.drumPins[i], currentJourney.drumPins[i + 1]);
                        }
                        setCenter(DEFAULT_CENTER)
                    }

                    // If journey changes
                    if (journeyRef !== currentJourney) {
                        setDrumVector(currentJourney.blueLine[i])
                        setSaxVector(currentJourney.redLine[i])
                        setDuoVector(currentJourney.purpleLine[i]);
                        setDrumPin(currentJourney.drumPins[i])
                        setSaxPin(currentJourney.saxPins[i])

                        if (currentJourney.saxPins.length === i + 1) {
                            onTownChange(currentJourney.saxPins[i], null,
                                currentJourney.drumPins[i], null);
                        } else {
                            onTownChange(currentJourney.saxPins[i], currentJourney.saxPins[i + 1],
                                currentJourney.drumPins[i], currentJourney.drumPins[i + 1]);
                        }
                        setJourneyRef(currentJourney)
                        setCenter(DEFAULT_CENTER)
                    }
                }
            }

            /**
             *  telnet towel blinkenpin.nl
             * */
            setPinPng(pinGate ? true : false)
            pinGate = !pinGate;

        }, 500);
        return () => clearInterval(interval);
    }, [videoRef, onTownChange, setDrumVector, setSaxVector,
        setDuoVector, currentJourney, journeyRef, isLoaded,
        currentIndex, drumPin, saxPin, DEFAULT_CENTER]);

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading maps";

    return (
        <div className={Style.viewBox}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={11}
                options={options}
                center={center}
            >
                {/** Journeys (renditions) by different ensembles */}
                {Journeys.metadata.map((journey, key) => {
                    return <Journey
                        visible={currentJourney.id === journey.id ? true : false}
                        drumSequence={journey.polygonDrum}
                        saxSequence={journey.polygonSax}
                        strokeColor={journey.strokeColor}
                        fillColor={docMode ? "2A2321" : journey.fillColor}
                        drumVector={drumVector}
                        saxVector={saxVector}
                        duoVector={duoVector}
                        polygonOpacity={polygonOpacity}
                        key={key}
                    />
                })}

                {/** Pins, text bubbles, markers */}
                {Movements.metadata.map((pin) => (
                    <div className={Style.blinkingMarker} key={pin.id}>
                        <Marker
                            position={{ lat: pin.lat, lng: pin.lng }}
                            icon={{
                                url: getPinIcon(pin),
                                scaledSize: new window.google.maps.Size(30, 30),
                                origin: new window.google.maps.Point(0, 0),
                                anchor: new window.google.maps.Point(15, 15),
                            }}
                            onMouseOver={() => {
                                setInfoWindow(pin.id)
                            }}
                            onMouseOut={() => {
                                setInfoWindow(null)
                            }}
                            onClick={() => {
                                let drumIndex = currentJourney.drumPins.findIndex(function (e) { return e ? e === pin.id : false })
                                let saxIndex = currentJourney.saxPins.findIndex(function (e) { return e ? e === pin.id : false })
                                if (saxIndex === -1) {
                                    videoRef.current.seekTo(currentJourney.timeStamps[drumIndex])
                                } else if (drumIndex === -1) {
                                    videoRef.current.seekTo(currentJourney.timeStamps[saxIndex])
                                } else {
                                    videoRef.current.seekTo(currentJourney.timeStamps[drumIndex])
                                }
                            }}
                        />
                    </div>
                ))}

                {/** Pin bubble pop-up logic */}
                {drumVector && (drumPin !== null) ?
                    (
                        <>
                            <InfoWindow position={{ lat: Movements.metadata[drumPin].lat, lng: Movements.metadata[drumPin].lng }}
                                options={infoOptions}
                            >
                                <div>
                                    <b>{Movements.metadata[drumPin].name}</b>
                                </div>
                            </InfoWindow>
                        </>
                    ) : null}

                {saxVector && (saxPin !== null) ?
                    (
                        <>
                            <InfoWindow position={{ lat: Movements.metadata[saxPin].lat, lng: Movements.metadata[saxPin].lng }}
                                options={infoOptions}
                            >
                                <div>
                                    <b>{Movements.metadata[saxPin].name}</b>
                                </div>
                            </InfoWindow>
                        </>
                    ) : null}

                {duoVector && (saxPin && drumPin !== null) ?
                    (
                        <>
                            <InfoWindow position={{ lat: Movements.metadata[saxPin].lat, lng: Movements.metadata[saxPin].lng }}
                                options={infoOptions}
                            >
                                <div>
                                    <b>{Movements.metadata[saxPin].name}</b>
                                </div>
                            </InfoWindow>
                        </>
                    ) : null}

                {(infoWindow ? <InfoWindow position={{ lat: Movements.metadata[infoWindow].lat, lng: Movements.metadata[infoWindow].lng }}
                    options={infoOptions}
                >
                    <div>
                        <i>{Movements.metadata[infoWindow].name}</i>
                    </div>
                </InfoWindow> : null)}
            </GoogleMap>
        </div >
    )
}

export default Maps