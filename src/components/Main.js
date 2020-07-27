import React from "react";
import Style from "./main.module.scss";
import ReactPlayer from "react-player/lazy";
/*import {
  GoogleMaps,
  useLoadScript,
  Marker,
  InfoWindow,
} from "react-google-maps";*/

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
  return (
    <>
      <div className={Style.viewBox}>
        <ReactPlayer
          url="https://vimeo.com/320352457"
          playing={true}
          width="70vw"
          height="40vw"
        />
      </div>
      <div className={Style.title}>
        {moduleNames[Math.floor(Math.random() * moduleNames.length)]}
      </div>
    </>
  );
};

export default Main;
