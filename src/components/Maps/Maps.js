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

const Maps = ({ videoRef, journeyVisibility }) => {

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
        lng: 11.8516,
    };

    const MAP_BOUNDARIES = {
        north: 47.3827,
        south: 47.000580,
        east: 12.0588,
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

    const [selected, setSelected] = useState(null);

    useEffect(() => {
        let gate = false;
        let counter = 0;
        let currentJourney = Journeys.metadata[0]
        setSelected(Movements.metadata[currentJourney.sequence[counter]])
        const interval = setInterval(() => {
            if (videoRef.current) {
                if (Math.trunc(videoRef.current.getCurrentTime()) === currentJourney.timeStamps[counter]) {
                    if (gate === false) {
                        setSelected(Movements.metadata[currentJourney.sequence[counter]])
                        counter++;
                    }
                }
            }
        }, 500);
        return () => clearInterval(interval);
    }, [videoRef]);


    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading maps";

    return (
        <div className={Style.viewBox}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={11}
                options={options}
                center={CENTER}
            >
                {/** Journeys (renditions) by different ensembles */}
                {Journeys.metadata.map((journey, key) => {
                    return <Journey
                        visible={journeyVisibility[key]}
                        sequence={journey.sequence}
                        strokeColor={journey.strokeColor}
                        fillColor={journey.fillColor}
                        key={key}
                    />
                })}

                {/** Pins, text bubbles, markers */}
                {Movements.metadata.map((pin) => (
                    <Marker
                        key={pin.id}
                        position={{ lat: pin.lat, lng: pin.lng }}
                        icon={{
                            url: '/pin.png',
                            scaledSize: new window.google.maps.Size(30, 30),
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15)
                        }}
                        onClick={() => {
                            setSelected(pin)
                            videoRef.current.seekTo(Math.floor(Math.random() * Math.floor(1161)))
                        }}
                    />
                ))}

                {/** Pin bubble pop-up logic */}
                {selected ? (
                    <InfoWindow position={{ lat: selected.lat, lng: selected.lng }}>
                        <div style={{ width: "20vw" }}>
                            <h2>{selected.name}</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                            irure dolor in reprehenderit in voluptate velit esse cillum
                            dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt
                 mollit anim id est laborum. </p>
                        </div>
                    </InfoWindow>
                ) : null}
            </GoogleMap>
        </div>
    )
}

export default Maps