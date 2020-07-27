import React from "react";
import Style from "./main.module.scss";
//import ReactPlayer from "react-player/lazy";
import {
  GoogleMap,
  useLoadScript,
  //Marker,
  //InfoWindow,
} from "@react-google-maps/api";
import mapStyles from "../mapStyles.js";

const Main = () => {
  const moduleNames = [
    "AMPASS",
    "KREITH",
    "PATSCH",
    "IGLS",
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

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  return (
    <div style={{ position: "relative" }}>
      <div className={Style.viewBox}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          options={options}
          center={center}
        />
      </div>
      <div className={Style.title}>
        {moduleNames[Math.floor(Math.random() * moduleNames.length)]}
      </div>
    </div>
  );
};

export default Main;
