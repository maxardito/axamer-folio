import React, { useState } from "react";
import {
    GoogleMap,
    useLoadScript,
    Polygon,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import mapStyles from "./MapStyles.js";
import Movements from "../Movements.json";

import Style from "./maps.module.scss";

function sortModules(sequence) {
    return Object.keys(Movements.metadata)
        .map(a => ({ [a]: Movements.metadata[a] }))
        .sort((a, b) => (sequence.indexOf(Object.keys(a)[0]) + 1) - (sequence.indexOf(Object.keys(b)[0]) + 1));
}

const Maps = ({ videoRef }) => {
    const PATCHWORK_SEQ = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18,
        19, 20, 21, 22, 23, 24
    ];

    const PATCHWORK_PATH = sortModules(PATCHWORK_SEQ);

    const libraries = [null];

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const mapContainerStyle = {
        width: "99vw",
        height: "81.5vh",
    };

    const center = {
        lat: 47.18037,
        lng: 11.4516,
    };

    const options = {
        styles: mapStyles,
        disableDefaultUI: true,
        mapTypeId: "hybrid",
    };

    const route1 = {
        strokeColor: 'blue',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        radius: 30000,
        zIndex: 1
    }

    /*const route2 = {
        strokeColor: 'yellow',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'green',
        fillOpacity: 0.35,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        radius: 30000,
        zIndex: 1
    }*/

    const [selected, setSelected] = useState(null);


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
                <Polygon
                    paths={PATCHWORK_PATH.map((module, key) => {
                        return {
                            lat: module[key].lat,
                            lng: module[key].lng
                        }
                    })}
                    options={route1}
                />
                {/*
                TODO: Polygons should eventually be mapped
                <Polygon
                    paths={TEST_PATH.map((module, key) => {
                        return {
                            lat: module[key].lat,
                            lng: module[key].lng
                        }
                    })}
                    options={route2}
                />*/}
                {Movements.metadata.map((module) => (
                    <Marker key={module.id} position={{ lat: module.lat, lng: module.lng }} icon={{
                        url: '/pin.png',
                        scaledSize: new window.google.maps.Size(30, 30),
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(15, 15)
                    }}
                        onClick={() => {
                            setSelected(module)
                            videoRef.current.seekTo(Math.floor(Math.random() * Math.floor(1161)))
                        }}
                    />
                ))}
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