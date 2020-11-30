import React, { useState, createRef } from "react";

import Style from "./main.module.scss";
import ReactPlayer from "react-player/lazy";
import Maps from "./Maps/Maps.js"
import Journeys from "./Journey/Journeys.json";
import Checkbox from "react-checkbox-component"
//import Rendering from "./Rendering.js";


const Main = () => {
  const videoRef = createRef()

  const [visible, setVisible] = useState([true, false, false])
  const [dropDown, setDropDown] = useState(false);
  const [docMode, setDocMode] = useState(true);
  const [currentJourney, setCurrentJourney] = useState(Journeys.metadata[0]);

  const [videoVisibility, setVideoVisibility] = useState('visible')

  const [polygonOpacity, setPolygonOpacity] = useState(0.7)
  const [currentMovement, setCurrentMovement] = useState(null)
  const [nextMovement, setNextMovement] = useState(null)
  const [previousMovement, setPreviousMovement] = useState(null)

  function handleTownChange(selectedTown, nextTown, previousTown) {
    setCurrentMovement(selectedTown === undefined ? null : selectedTown.name)
    setNextMovement(nextTown === undefined ? null : nextTown.name);
    setPreviousMovement(previousTown === undefined ? null : previousTown.name);
  }


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
        <Maps videoRef={videoRef}
          currentJourney={currentJourney}
          onTownChange={handleTownChange}
          journeyVisibility={visible}
          docMode={docMode}
          polygonOpacity={polygonOpacity}
        />
      </div>
      <div className={Style.reactPlayerOpacityOverride}
        style={{ visibility: videoVisibility }}
      />
      <div className={Style.controlPanelBg} style={{
        width: docMode ? "50vw" : "33.3vw"
      }} />
      <div className={Style.aboutButton}>
        <i>ABOUT AXAMER FOLIO</i>
      </div>
      <div className={Style.controlPanel} style={{
        width: docMode ? "50vw" : "33.3vw"
      }}>
        <div className={Style.reactPlayerContainer} style={{
          width: docMode ? "46vw" : "30vw",
          height: docMode ? "25.85vw" : "17vw",
          visibility: videoVisibility
        }}>
          <ReactPlayer
            ref={videoRef}
            url={currentJourney.videoURL}
            playing={true}
            controls={true}
            width="100%"
            height="100%"
            onPlay={() => { setPolygonOpacity(0) }}
            onPause={() => { setPolygonOpacity(0.7) }}
          />
          <br />
          Ensemble:<br />
          Venue:<br />
          Date:<br /><br />
          <hr /><br />
          <b><img src={"/pin.png"} width={"18px"} height={"auto"} alt={"Map Icon"} /> Current Movement:</b> <i>{currentMovement}</i><br />
          <b><span style={{ backgroundColor: "red" }}>Next Movement</span>:</b>  <i>{nextMovement}</i><br />
          <b><span style={{ backgroundColor: "blue" }}>Previous Movement</span>:</b>  <i>{previousMovement}</i>
        </div>
      </div>

      {/*<div className={Style.pinTitle}>
        <img
          alt={"Title"}
          src={"popups/" + scoreID + ".jpg"}
          style={{ width: '100%', height: '100%' }}
        />
      </div>*/}


      {/** Dropdown ensemble menu logic */}
      {
        dropDown ? (
          <div className={Style.ensembleMenuPanel}>
            {Journeys.metadata.map((journey, key) => {
              return (
                <>
                  <Checkbox
                    size="big"
                    isChecked={visible[key]}
                    onChange={() => {
                      if (docMode) {
                        let nextArray = visible.slice();

                        for (var i = 0; i < visible.length; i++) {
                          if (i !== key)
                            nextArray[i] = false;
                          else
                            nextArray[i] = true;
                        }
                        setCurrentJourney(Journeys.metadata[key]);
                        setVisible(nextArray);
                        setDropDown(false)
                      } else {
                        let v = visible[key];

                        let nextArray = visible.slice();
                        nextArray[key] = !v;

                        setVisible(nextArray);
                      }

                    }}
                    color={journey.fillColor} />
                  {" "}{journey.name.toLowerCase()} :: {journey.venue.toLowerCase()} :: {journey.date}
                  <hr />
                </>
              )
            })}
          </div>
        ) : null
      }
    </>
  );
};

export default Main;
