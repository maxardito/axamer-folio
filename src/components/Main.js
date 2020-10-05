import React, { useState, createRef } from "react";
import Style from "./main.module.scss";
import ReactPlayer from "react-player/lazy";
import Maps from "./Maps/Maps.js"
import Journeys from "./Journey/Journeys.json";

import Checkbox from "react-checkbox-component"
//import Rendering from "./Rendering.js";

//import Movements from "./Movements.json"

const Main = () => {
  const ref = createRef()

  const [visible, setVisible] = useState([true, false, false])
  const [dropDown, setDropDown] = useState(false);
  return (
    <>
      {/*<div className={Style.rendering}>
        <Rendering />
      </div>*/}
      <div style={{ position: "relative" }}>
        <div className={Style.title}>
          AXAMER FOLIO
          <img
            src={"/pin.png"}
            className={Style.ensembleMenuHamburger}
            alt={"Ensemble Menu"}
            onClick={() => { setDropDown(!dropDown) }}
          />
        </div>
        <Maps videoRef={ref} journeyVisibility={visible} />
      </div>
      <div className={Style.controlPanel}>
        <div className={Style.reactPlayerContainer}>
          <ReactPlayer
            ref={ref}
            url="https://www.youtube.com/watch?v=P-rt_hj6VAk"
            playing={true}
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
      {/** Dropdown ensemble menu logic */}
      {dropDown ? (
        <div className={Style.ensembleMenuPanel}>
          {Journeys.metadata.map((journey, key) => {
            return (
              <>
                <Checkbox
                  size="big"
                  isChecked={visible[key]}
                  onChange={() => {
                    let v = visible[key];

                    let nextArray = visible.slice();
                    nextArray[key] = !v;

                    setVisible(nextArray);

                  }}
                  color={journey.fillColor} />
                {" "}{journey.name.toLowerCase()} :: {journey.venue.toLowerCase()} :: {journey.date}
                <hr />
              </>
            )
          })}
        </div>
      ) : null}
    </>
  );
};

export default Main;
