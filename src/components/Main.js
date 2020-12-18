import React, { useState, createRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Style from "./main.module.scss";
import ReactPlayer from "react-player/lazy";
import Maps from "./Maps/Maps.js"
import Journeys from "./Journey/Journeys.json";
import Checkbox from "react-checkbox-component"
import Movements from "./Movements.json";

//import Rendering from "./Rendering.js";


const Main = () => {
    const videoRef = createRef()

    const [visible, setVisible] = useState([true, false, false])
    const [docMode] = useState(true);
    const [currentJourney, setCurrentJourney] = useState(Journeys.metadata[0]);

    const [tabIndex, setTabIndex] = useState(0);
    const [tabColor, setTabColor] = useState(['blue', 'white', 'white']);

    const [videoVisibility, setVideoVisibility] = useState('visible')

    const [polygonOpacity, setPolygonOpacity] = useState(0.7)

    const [currentSaxVector, setCurrentSaxVector] = useState([" ", " "])
    const [currentDrumVector, setCurrentDrumVector] = useState([" ", " "])

    function handleTownChange(saxVector, drumVector) {
        setCurrentSaxVector(saxVector === null ? [" ", " "] : [Movements.metadata[saxVector[0]].name, Movements.metadata[saxVector[1]].name]);
        setCurrentDrumVector(drumVector === null ? [" ", " "] : [Movements.metadata[drumVector[0]].name, Movements.metadata[drumVector[1]].name]);
    }

    function handleTabChange(index) {
        setTabIndex(index)
        setVideoVisibility(index === 0 ? 'visible' : 'hidden')

        let tabColors;

        if (index === 0) {
            tabColors = ['blue', 'white', 'white']
        } else if (index === 1) {
            tabColors = ['white', 'yellow', 'white']
        } else {
            tabColors = ['white', 'white', 'red']
        }
        setTabColor(tabColors)
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
                        alt={"Rainbow Cube"}
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
            <div className={Style.controlPanel} style={{
                width: docMode ? "50vw" : "33.3vw"
            }}>
                <Tabs selectedIndex={tabIndex} onSelect={index => handleTabChange(index)}>
                    <TabList>
                        <Tab className={Style.tab} style={{ float: 'left', left: '0vw', backgroundColor: tabColor[0], paddingLeft: "10px", border: "1px solid black", fontFamily: "Roboto" }}><i>FOLIO</i></Tab>
                        <Tab className={Style.tab} style={{ float: 'right', left: '33%', backgroundColor: tabColor[1], paddingLeft: "10px", border: "1px solid black", fontFamily: "Roboto" }}><i>NOTES</i></Tab>
                        <Tab className={Style.tab} style={{ float: 'right', left: '66%', backgroundColor: tabColor[2], paddingLeft: "10px", border: "1px solid black", fontFamily: "Roboto" }}><i>ENSEMBLES</i></Tab>
                    </TabList>

                    <TabPanel forceRender={true}>
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
                            <center>
                                <span style={{ backgroundColor: "red", color: "white" }}>Saxophone</span>: {currentSaxVector[0]} {"->"} <img src={"/pin.png"} width={"18px"} height={"auto"} alt={"Map Icon"} />  <i>{currentSaxVector[1]}</i><br />
                                <span style={{ backgroundColor: "blue", color: "white" }}>Drums</span>: {currentDrumVector[0]} {"->"} <img src={"/pin.png"} width={"18px"} height={"auto"} alt={"Map Icon"} />  <i>{currentDrumVector[1]}</i>
                            </center>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        Notes
          </TabPanel>

                    <TabPanel>
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
                    </TabPanel>
                </Tabs>
            </div>
        </>
    );
};

export default Main;
