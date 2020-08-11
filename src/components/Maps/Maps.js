import React, { useState } from "react";
import {
    GoogleMap,
    useLoadScript,
    Polygon,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import mapStyles from "./MapStyles.js";

import Style from "./maps.module.scss";

const Maps = () => {
    const moduleNames = [
        {
            "id": 0,
            "name": "AMPASS",
            "lat": 47.263069,
            "lng": 11.465090
        },
        {
            "id": 1,
            "name": "KREITH",
            "lat": 47.202671,
            "lng": 11.380620
        },
        {
            "id": 2,
            "name": "PATSCH",
            "lat": 47.204440,
            "lng": 11.415100
        },
        {
            "id": 4,
            "name": "GÖTZENS",
            "lat": 47.236120,
            "lng": 11.311340
        },
        {
            "id": 5,
            "name": "RAITIS",
            "lat": 47.221870,
            "lng": 11.378170
        },
        {
            "id": 6,
            "name": "AXAMS",
            "lat": 47.198635,
            "lng": 11.298606
        },
        {
            "id": 7,
            "name": "AXAMER-LIZUM",
            "lat": 47.198635,
            "lng": 11.298606
        },
        {
            "id": 8,
            "name": "MEDRAZ",
            "lat": 47.142525,
            "lng": 11.342532
        },
        {
            "id": 9,
            "name": "BIRGTIZ",
            "lat": 47.235430,
            "lng": 11.299500
        },
        {
            "id": 10,
            "name": "KÜHTAI",
            "lat": 47.213840,
            "lng": 11.024550
        },
        {
            "id": 11,
            "name": "ALDRANS",
            "lat": 47.251250,
            "lng": 11.446010
        },
        {
            "id": 12,
            "name": "ARZL",
            "lat": 47.207350,
            "lng": 10.761710
        },
        {
            "id": 13,
            "name": "GRIES AM BRENNER",
            "lat": 47.038580,
            "lng": 11.479140
        },
        {
            "id": 14,
            "name": "IGLS",
            "lat": 47.2726,
            "lng": 11.1958
        },
        {
            "id": 15,
            "name": "LANS",
            "lat": 47.2384,
            "lng": 11.4318
        },
        {
            "id": 16,
            "name": "MIEDERS",
            "lat": 47.1688,
            "lng": 11.3819
        },
        {
            "id": 17,
            "name": "NEDER",
            "lat": 47.1174,
            "lng": 11.3266
        },
        {
            "id": 18,
            "name": "PRAXMAR",
            "lat": 47.1501,
            "lng": 11.1339
        },
        {
            "id": 19,
            "name": "RANGGEN",
            "lat": 47.2574,
            "lng": 11.2106
        },
        {
            "id": 20,
            "name": "RINN",
            "lat": 47.2524,
            "lng": 11.5037
        },
        {
            "id": 21,
            "name": "SISTRANS",
            "lat": 47.2379,
            "lng": 11.4471
        },
        {
            "id": 22,
            "name": "TELFES",
            "lat": 47.1639,
            "lng": 11.3588
        },
        {
            "id": 23,
            "name": "THAUR",
            "lat": 47.2927,
            "lng": 11.4755
        },
        {
            "id": 24,
            "name": "TULFES",
            "lat": 47.2581,
            "lng": 11.5340
        },
        {
            "id": 25,
            "name": "VÖLS",
            "lat": 47.2519,
            "lng": 11.3287
        }
    ];

    const moduleNames2 = [
        {
            "id": 1,
            "name": "KREITH",
            "lat": 47.202671,
            "lng": 11.380620
        },
        {
            "id": 5,
            "name": "RAITIS",
            "lat": 47.221870,
            "lng": 11.378170
        },
        {
            "id": 2,
            "name": "PATSCH",
            "lat": 47.204440,
            "lng": 11.415100
        },
        {
            "id": 0,
            "name": "AMPASS",
            "lat": 47.263069,
            "lng": 11.465090
        },
        {
            "id": 4,
            "name": "GÖTZENS",
            "lat": 47.236120,
            "lng": 11.311340
        },
        {
            "id": 8,
            "name": "MEDRAZ",
            "lat": 47.142525,
            "lng": 11.342532
        },
        {
            "id": 6,
            "name": "AXAMS",
            "lat": 47.198635,
            "lng": 11.298606
        },
        {
            "id": 9,
            "name": "BIRGTIZ",
            "lat": 47.235430,
            "lng": 11.299500
        },
        {
            "id": 7,
            "name": "AXAMER-LIZUM",
            "lat": 47.198635,
            "lng": 11.298606
        },
        {
            "id": 10,
            "name": "KÜHTAI",
            "lat": 47.213840,
            "lng": 11.024550
        },
        {
            "id": 16,
            "name": "MIEDERS",
            "lat": 47.1688,
            "lng": 11.3819
        },
        {
            "id": 11,
            "name": "ALDRANS",
            "lat": 47.251250,
            "lng": 11.446010
        },
        {
            "id": 13,
            "name": "GRIES AM BRENNER",
            "lat": 47.038580,
            "lng": 11.479140
        },
        {
            "id": 14,
            "name": "IGLS",
            "lat": 47.2726,
            "lng": 11.1958
        },
        {
            "id": 15,
            "name": "LANS",
            "lat": 47.2384,
            "lng": 11.4318
        },
        {
            "id": 17,
            "name": "NEDER",
            "lat": 47.1174,
            "lng": 11.3266
        },
        {
            "id": 22,
            "name": "TELFES",
            "lat": 47.1639,
            "lng": 11.3588
        },
        {
            "id": 18,
            "name": "PRAXMAR",
            "lat": 47.1501,
            "lng": 11.1339
        },
        {
            "id": 21,
            "name": "SISTRANS",
            "lat": 47.2379,
            "lng": 11.4471
        },
        {
            "id": 12,
            "name": "ARZL",
            "lat": 47.207350,
            "lng": 10.761710
        },
        {
            "id": 19,
            "name": "RANGGEN",
            "lat": 47.2574,
            "lng": 11.2106
        },
        {
            "id": 23,
            "name": "THAUR",
            "lat": 47.2927,
            "lng": 11.4755
        },
        {
            "id": 20,
            "name": "RINN",
            "lat": 47.2524,
            "lng": 11.5037
        },
        {
            "id": 25,
            "name": "VÖLS",
            "lat": 47.2519,
            "lng": 11.3287
        },
        {
            "id": 24,
            "name": "TULFES",
            "lat": 47.2581,
            "lng": 11.5340
        },
    ];

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
        lat: 47.23037,
        lng: 10.98016,
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

    const route2 = {
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
    }

    const [selected, setSelected] = useState(null);


    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading maps";

    return (
        <div className={Style.viewBox}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={10}
                options={options}
                center={center}
            >
                <Polygon
                    paths={moduleNames.map((module) => (
                        {
                            lat: module.lat,
                            lng: module.lng
                        }
                    ))}
                    options={route1}
                />
                <Polygon
                    paths={moduleNames2.map((module) => (
                        {
                            lat: module.lat,
                            lng: module.lng
                        }
                    ))}
                    options={route2}
                />
                {moduleNames.map((module) => (
                    <Marker key={module.id} position={{ lat: module.lat, lng: module.lng }} icon={{
                        url: '/pin.png',
                        scaledSize: new window.google.maps.Size(30, 30),
                        origin: new window.google.maps.Point(0, 0),
                        anchor: new window.google.maps.Point(15, 15)
                    }}
                        onClick={() => {
                            setSelected(module)
                        }}
                    />
                ))}

                {selected ? (
                    <InfoWindow position={{ lat: selected.lat, lng: selected.lng }}>
                        <div style={{ width: "20vw" }}>
                            <h2>TEST</h2>
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