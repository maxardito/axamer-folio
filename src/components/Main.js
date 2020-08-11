import React from "react";
import Style from "./main.module.scss";
import ReactPlayer from "react-player/lazy";
import Maps from "./Maps/Maps.js"
//import Rendering from "./Rendering.js";

//import Movements from "./Movements.json"

const Main = () => {
  return (
    <>
      {/*<div className={Style.rendering}>
        <Rendering />
      </div>*/}
      <div style={{ position: "relative" }}>
        <div className={Style.title}>
          AXAMER FOLIO
        </div>
        <Maps />
      </div>
      <div className={Style.controlPanel}>
        <div className={Style.reactPlayerContainer}>
          <ReactPlayer
            url="https://vimeo.com/320352457"
            playing={false}
            width="100%"
            height="100%"
          />
        </div>
        <div className={Style.ensembleInfo}>
          <h3>Ensemble Info</h3>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
          do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat. Duis aute
          irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat
          cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </div>
      </div>
    </>
  );
};

export default Main;
