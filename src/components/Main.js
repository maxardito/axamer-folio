import React from "react";
import Style from "./main.module.scss";
//import ReactPlayer from "react-player/lazy";
import {
  GoogleMap,
  useLoadScript,
  //DirectionsRenderer,
  Polygon
  //Marker,
  //InfoWindow,
} from "@react-google-maps/api";
import mapStyles from "../mapStyles.js";

const Main = () => {
  const moduleNames = [
    "AMPASS",
    "KREITH",
    "PATSCH",
    "GÖTZENS",
    "RAITIS",
    "AXAMS",
    "AXAMER-LIZUM",
    "MEDRAZ",
    "BIRGTIZ",
    "ARZL-THAUR-RINN",
    "KÜHTAI",
    "VÖLS-LANS",
    "ALDRANS - SISTRANS",
    "INZIG - RANGGEN",
    "TULFES - TELFES",
    "NEDER - MIEDERS",
  ];

  /*const video = (
    <ReactPlayer
      url="https://vimeo.com/320352457"
      playing={true}
      width="70vw"
      height="40vw"
    />
  );*/

  const libraries = [null];

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapContainerStyle = {
    width: "100vw",
    height: "90vh",
  };

  const center = {
    lat: 47.23037,
    lng: 11.27916,
  };

  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    //mapTypeId: "hybrid",
  };

  const paths = [
    { lat: 25.774, lng: -80.19 },
    { lat: 18.466, lng: -66.118 },
    { lat: 32.321, lng: -64.757 },
    { lat: 25.774, lng: -80.19 }
  ]

  const polygonOptions = {
    fillColor: "lightblue",
    fillOpacity: 1,
    strokeColor: "red",
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1
  }

  const onLoad = polygon => {
    console.log("polygon: ", polygon);
  }

  //const [directions, setDirections] = useState(null);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  return (
    <div style={{ position: "relative" }}>
      <div className={Style.viewBox}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={11}
          options={options}
          center={center}
          onLoad={map => {
            //Directions API, just incase it'll come in handy later

            /*
            const directionsService = new window.google.maps.DirectionsService();

            const origin = { lat: 47.263070, lng: 11.465090 };
            const destination = { lat: 47.202670, lng: 11.380620 };

            directionsService.route(
              {
                origin: origin,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING
              },
              (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                  const overViewCoords = result.routes[0].overview_path;
                  setDirections(overViewCoords);
                } else {
                  console.error(`error fetching directions ${result}`);
                }
              }
            );*/
          }}
        >
          <Polygon
            onLoad={onLoad}
            paths={paths}
            options={polygonOptions}
          />
        </GoogleMap>
      </div>
      <div className={Style.title}>
        {moduleNames[Math.floor(Math.random() * moduleNames.length)]}
      </div>
    </div>
  );
};

export default Main;
