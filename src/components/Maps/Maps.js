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

const Maps = ({ videoRef, currentJourney, onTownChange, journeyVisibility, docMode, polygonOpacity }) => {

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const mapContainerStyle = {
        width: "99vw",
        height: "86.5vh",
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

    const [pinPng, setPinPng] = useState('/pin.png')
    const [center, setCenter] = useState(DEFAULT_CENTER);

    function getPinIcon(pin) {
        if (docMode) {
            if ((drumVector && (drumPin !== null) ? Movements.metadata[drumPin].id : false) === pin.id) {
                return pinPng;
            } else if ((saxVector && (saxPin !== null) ? Movements.metadata[saxPin].id : false) === pin.id) {
                return pinPng
            } else {
                return '/dot.png'
            }
        } else {
            return '/pin.png'
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
            onTownChange(currentJourney.redLine[currentIndex],
                currentJourney.blueLine[currentIndex],
                currentJourney.purpleLine[currentIndex]);
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

                        onTownChange(currentJourney.redLine[i],
                            currentJourney.blueLine[i],
                            currentJourney.purpleLine[i]);
                        setCenter(DEFAULT_CENTER)
                    }

                    // If journey changes
                    if (journeyRef !== currentJourney) {
                        setDrumVector(currentJourney.blueLine[i])
                        setSaxVector(currentJourney.redLine[i])
                        setDuoVector(currentJourney.purpleLine[i]);
                        setDrumPin(currentJourney.drumPins[i])
                        setSaxPin(currentJourney.saxPins[i])

                        onTownChange(currentJourney.redLine[i],
                            currentJourney.blueLine[i],
                            currentJourney.purpleLine[i]);
                        setJourneyRef(currentJourney)
                        setCenter(DEFAULT_CENTER)
                    }
                }
            }

            /**
             *  telnet towel blinkenpin.nl
             * */
            setPinPng(pinGate ? '/pin.png' : '/dot.png')
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
                        visible={journeyVisibility[key]}
                        polygon={journey.polygon}
                        strokeColor={journey.strokeColor}
                        fillColor={docMode ? "2A2321" : journey.fillColor}
                        key={key}
                        drumVector={drumVector}
                        saxVector={saxVector}
                        duoVector={duoVector}
                        polygonOpacity={polygonOpacity}
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
                                let drumIndex = currentJourney.blueLine.findIndex(function (e) { return e ? e[0] === pin.id : false });
                                let saxIndex = currentJourney.redLine.findIndex(function (e) { return e ? e[0] === pin.id : false })
                                let duoIndex = currentJourney.purpleLine.findIndex(function (e) { return e ? e[0] === pin.id : false })
                                if (drumIndex) {
                                    videoRef.current.seekTo(currentJourney.timeStamps[drumIndex])
                                } else if (saxIndex) {
                                    videoRef.current.seekTo(currentJourney.timeStamps[saxIndex])
                                } else if (duoIndex) {
                                    videoRef.current.seekTo(currentJourney.timeStamps[duoIndex])
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