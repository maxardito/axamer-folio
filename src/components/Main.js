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

  const [scoreID, setScoreID] = useState(Journeys.metadata[0].sequence[0]);

  function handleTownChange(selectedTown) {

    setScoreID(selectedTown.id ? selectedTown.id : 0)
  }
  return (
    <>
      {/*<div className={Style.rendering}>
        <Rendering />
      </div>*/}
      <div style={{ position: "relative" }}>
        <div className={Style.title}>
          AXAMER FOLIO
           <Checkbox
            size="big"
            isChecked={docMode}
            onChange={() => { setDocMode(!docMode) }}
            color={"black"} />
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
        />
      </div>
      <div className={Style.controlPanel} style={{
        width: docMode ? "50vw" : "33.3vw"
      }}>
        <div className={Style.reactPlayerContainer} style={{
          width: docMode ? "32vw" : "30vw",
          height: docMode ? "18vw" : "17vw"
        }}>
          <ReactPlayer
            ref={videoRef}
            url={currentJourney.videoURL}
            playing={true}
            controls={true}
            width="100%"
            height="100%"
          />
        </div>
        <div className={Style.scoreWrapper}>
          <iframe
            title={"score"}
            src={"score/" + scoreID + ".pdf#toolbar=0&navpanes=0"}
            style={{ width: "44vw", height: "60vh" }}
          />
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
      ) : null}
    </>
  );
};

export default Main;
