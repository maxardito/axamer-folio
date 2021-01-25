import React, { useState, createRef } from "react"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import Style from "./main.module.scss"
import ReactPlayer from "react-player/lazy"
import Maps from "./Maps/Maps.js"
import Journeys from "./Journey/Journeys.json"
import Checkbox from "react-checkbox-component"
import Movements from "./Movements.json"
import ReactMarkdown from 'react-markdown'
import ProgramNotes from "./ProgramNotes"

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
            <div className={Style.controlPanel}>
                <Tabs style={{ position: "static" }} selectedIndex={tabIndex} onSelect={index => handleTabChange(index)}>
                    <TabList style={{ position: "relative", top: 0, paddingLeft: 0, marginTop: 0, display: "flex" }}>
                        <Tab className={Style.tab} style={{ backgroundColor: tabColor[0] }}><i>FOLIO</i></Tab>
                        <Tab className={Style.tab} style={{ backgroundColor: tabColor[1] }}><i>NOTES</i></Tab>
                        <Tab className={Style.tab} style={{ backgroundColor: tabColor[2] }}><i>ENSEMBLES</i></Tab>
                    </TabList>

                    <TabPanel forceRender={true} style={{ display: tabIndex !== 0 ? "none" : "block" }}>
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
                            <b>Ensemble</b>: {currentJourney.name}<br />
                            <b>Venue</b>: {currentJourney.venue}<br />
                            <b>Date</b>: {currentJourney.date}<br /><br />
                            <hr /><br />
                            <center>

                                {/* TODO: Use react context to refactor everything */}
                                <VectorDisplay name={"Saxophone"} color={"red"}
                                    currentTown={currentJourney.saxPins[currentJourney.redLine.indexOf(currentSaxVector)]}
                                    nextTown={currentJourney.saxPins[currentJourney.redLine.indexOf(currentSaxVector + 1)]}
                                />
                                <br />
                                <VectorDisplay name={"Drums"} color={"blue"}
                                    currentTown={currentJourney.saxPins[currentJourney.redLine.indexOf(currentDrumVector)]}
                                    nextTown={currentJourney.saxPins[currentJourney.redLine.indexOf(currentDrumVector + 1)]}
                                />
                            </center>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className={Style.programNotesContainer}>
                            <ReactMarkdown source={ProgramNotes} />
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className={Style.ensembleMenuContainer}>
                            {Journeys.metadata.map((journey, key) => {
                                return (
                                    <div key={key}>
                                        <Checkbox
                                            size="big"
                                            isChecked={visible[key]}
                                            onChange={() => {
                                                let nextArray = visible.slice();

                                                for (var i = 0; i < visible.length; i++) {
                                                    if (i !== key)
                                                        nextArray[i] = false;
                                                    else
                                                        nextArray[i] = true;
                                                }
                                                setCurrentJourney(Journeys.metadata[key]);
                                                setVisible(nextArray);
                                            }}
                                            color={journey.fillColor}
                                        />
                                        {" "}{journey.name.toLowerCase()} :: {journey.venue.toLowerCase()} :: {journey.date}
                                        <hr />
                                    </div>
                                )
                            })}
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </>
    );
};

const VectorDisplay = ({ name, color, currentTown, nextTown }) => {
    return (
        <>
            <br />
            <span style={{ backgroundColor: color, padding: "3px", color: "white" }}>
                {name}
            </span>
                : {currentTown} { "->"}
            <img src={"/pin.png"} width={"18px"} height={"auto"} alt={"Map Icon"} />
            <i>
                {nextTown}
            </i>
        </>
    )
}

export default Main;
