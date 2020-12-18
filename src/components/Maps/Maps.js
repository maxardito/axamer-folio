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
            if ((drumVector ? Movements.metadata[drumVector[1]].id : false) === pin.id) {
                return pinPng;
            } else if ((saxVector ? Movements.metadata[saxVector[1]].id : false) === pin.id) {
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

    const [currentIndex, setCurrentIndex] = useState(0)
    const [journeyRef, setJourneyRef] = useState(currentJourney)
    const [infoWindow, setInfoWindow] = useState(0)

    useEffect(() => {

        let pinGate = false;

        if (!isLoaded) {
            setDrumVector(currentJourney.blueLine[currentIndex]);
            setSaxVector(currentJourney.redLine[currentIndex]);
            onTownChange(currentJourney.redLine[currentIndex], currentJourney.blueLine[currentIndex]);
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
                        onTownChange(currentJourney.redLine[i], currentJourney.blueLine[i])
                        setCenter(DEFAULT_CENTER)
                    }

                    // If journey changes
                    if (journeyRef !== currentJourney) {
                        setDrumVector(currentJourney.blueLine[i])
                        setSaxVector(currentJourney.redLine[i])
                        onTownChange(currentJourney.redLine[i], currentJourney.blueLine[i])
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
    }, [videoRef, onTownChange, setDrumVector, setSaxVector, currentJourney, journeyRef, isLoaded, currentIndex, DEFAULT_CENTER]);

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
                        blueLine={journey.blueLine}
                        redLine={journey.redLine}
                        strokeColor={journey.strokeColor}
                        fillColor={docMode ? "2A2321" : journey.fillColor}
                        key={key}
                        drumVector={drumVector}
                        saxVector={saxVector}
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
                                videoRef.current.seekTo(currentJourney.timeStamps[drumIndex ? drumIndex : saxIndex])
                            }}
                        />
                    </div>
                ))}

                {/** Pin bubble pop-up logic */}
                {drumVector ?
                    (
                        <>
                            <InfoWindow position={{ lat: Movements.metadata[drumVector[0]].lat, lng: Movements.metadata[drumVector[0]].lng }}
                                options={infoOptions}
                            >
                                <div>
                                    <b>{Movements.metadata[drumVector[0]].name}</b>
                                </div>
                            </InfoWindow>
                        </>
                    ) : null}

                {saxVector ?
                    (
                        <>
                            <InfoWindow position={{ lat: Movements.metadata[saxVector[0]].lat, lng: Movements.metadata[saxVector[0]].lng }}
                                options={infoOptions}
                            >
                                <div>
                                    <b>{Movements.metadata[saxVector[0]].name}</b>
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
        </div>
    )
}

export default Maps