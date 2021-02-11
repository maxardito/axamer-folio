import React, { useState, createRef } from "react"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Link } from "react-router-dom"

import Style from "./main.module.scss"
import ReactPlayer from "react-player/lazy"
import Maps from "./Maps/Maps.js"
import Journeys from "./Journey/Journeys.json"
import Checkbox from "react-checkbox-component"
import Movements from "./Movements.json"
import ReactMarkdown from 'react-markdown'
import ProgramNotes from "./ProgramNotes"
import ScoreLinks from "./ScoreLinks"


const Main = ({ metadata }) => {
    const videoRef = createRef()

    const [docMode] = useState(true);

    const [tabIndex, setTabIndex] = useState(0);
    const [tabColor, setTabColor] = useState(['blue', 'white', 'white']);

    const [videoVisibility, setVideoVisibility] = useState('visible')

    const [polygonOpacity, setPolygonOpacity] = useState(0.7)

    const [currentSaxVector, setCurrentSaxVector] = useState([" ", " "])
    const [currentDrumVector, setCurrentDrumVector] = useState([" ", " "])

    const [ensembleMenu, setEnsembleMenu] = useState(false);

    function handleTownChange(currentSaxTown, nextSaxTown, currentDrumTown, nextDrumTown) {
        setCurrentSaxVector([currentSaxTown !== null ? Movements.metadata[currentSaxTown].name : null, nextSaxTown !== null ? Movements.metadata[nextSaxTown].name : null]);
        setCurrentDrumVector([currentDrumTown !== null ? Movements.metadata[currentDrumTown].name : null, nextDrumTown !== null ? Movements.metadata[nextDrumTown].name : null]);
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
                        onClick={() => setEnsembleMenu(!ensembleMenu)}
                    />
                </div>
                <Maps videoRef={videoRef}
                    currentJourney={metadata}
                    onTownChange={handleTownChange}
                    docMode={docMode}
                    polygonOpacity={polygonOpacity}
                />
            </div>
            <div className={Style.mobileWarning}>
                <div style={{ position: "relative", top: "15vw", padding: "1%" }}>
                    <center>
                        <h2>Axamer Folio</h2>
                        <h3>by Eric Wubbels</h3>
                            ---
                        <h4>For the full experience, please load the site on a desktop or laptop computer</h4>
                    </center>
                </div>
            </div>

            <div className={Style.controlPanelBg} style={{
                width: docMode ? "50vw" : "33.3vw"
            }} />
            <div className={Style.controlPanel}>
                <Tabs style={{ position: "static" }} selectedIndex={tabIndex} onSelect={index => handleTabChange(index)}>
                    <TabList style={{ position: "relative", right: "1px", top: 0, paddingLeft: 0, marginTop: 0, display: "flex" }}>
                        <Tab className={Style.tab} style={{ backgroundColor: tabColor[0] }}><i>VIDEO</i></Tab>
                        <Tab className={Style.tab} style={{ backgroundColor: tabColor[1] }}><i>ABOUT</i></Tab>
                        <Tab className={Style.tab} style={{ backgroundColor: tabColor[2] }}><i>SCORES</i></Tab>
                    </TabList>

                    <TabPanel forceRender={true} style={{ display: tabIndex !== 0 ? "none" : "block" }}>
                        <div className={Style.reactPlayerContainer} style={{
                            width: docMode ? "46vw" : "30vw",
                            height: docMode ? "25.85vw" : "17vw",
                            visibility: videoVisibility
                        }}>
                            <ReactPlayer
                                ref={videoRef}
                                url={metadata.videoURL}
                                playing={window.innerWidth <= 767 ? false : true}
                                controls={true}
                                width="100%"
                                height="100%"
                                onPlay={() => { setPolygonOpacity(0) }}
                                onPause={() => { setPolygonOpacity(0.7) }}
                                style={{ backgroundColor: "white" }}
                            />
                            <br />
                            <b>Ensemble</b>: {metadata.name}<br />
                            <b>Venue</b>: {metadata.venue}<br />
                            <b>Date</b>: {metadata.date}<br /><br />
                            <img src="border.svg" alt={"Border"} width={"100%"} />
                            <br />
                            <br />
                            <center>
                                <VectorDisplay name={"Saxophone"} color={"red"}
                                    currentTown={currentSaxVector[0]}
                                    nextTown={currentSaxVector[1]}
                                />
                                <br />
                                <VectorDisplay name={"Drums"} color={"blue"}
                                    currentTown={currentDrumVector[0]}
                                    nextTown={currentDrumVector[1]}
                                />
                            </center>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className={Style.programNotesContainer} style={{ display: tabIndex !== 1 ? "none" : "block" }}>
                            <ReactMarkdown source={ProgramNotes} />
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className={Style.programNotesContainer} style={{ display: tabIndex !== 2 ? "none" : "block" }}>
                            <ReactMarkdown source={ScoreLinks} />
                        </div>
                    </TabPanel>
                </Tabs>
                {/** Ensemble dropdown menu */}
                <div className={Style.ensembleMenuContainer} style={{ visibility: ensembleMenu ? "visible" : "hidden" }}>
                    {Journeys.metadata.map((journey, key) => {
                        return (
                            <div key={key}>
                                {key !== 0 ? <img src="border-white.svg" alt={"Border"} width={"100%"} /> : null}
                                <Link to={journey.slug} className={Style.ensembleLink}>
                                    <Checkbox
                                        size="big"
                                        isChecked={true}
                                        color={journey.fillColor}
                                    />
                                    {" "}{journey.name.toLowerCase()} :: {journey.venue.toLowerCase()} :: {journey.date}
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
};

const VectorDisplay = ({ name, color, currentTown, nextTown }) => {
    if (currentTown === null) {
        return (
            <>
                <br />
                <span style={{ backgroundColor: color, padding: "3px", color: "white" }}>
                    {name}
                </span>
                    :
                {" " + nextTown + " "}
                <img src={name === "Saxophone" ? '/sax-pin.svg' : '/drum-pin.svg'} width={"18px"} height={"auto"} alt={"Map Icon"} />
            </>
        )
    } else if (nextTown === null) {
        return (
            <>
                <br />
                <span style={{ backgroundColor: color, padding: "3px", color: "white" }}>
                    {name}
                </span>
                    :
                {" " + currentTown + " "}
                <img src={name === "Saxophone" ? '/sax-pin.svg' : '/drum-pin.svg'} width={"18px"} height={"auto"} alt={"Map Icon"} />
            </>
        )
    } else {
        return (
            <>
                <br />
                <span style={{ backgroundColor: color, padding: "3px", color: "white" }}>
                    {name}
                </span>
                    :
                {" " + currentTown + " "}
                <img src={name === "Saxophone" ? '/sax-pin.svg' : '/drum-pin.svg'} width={"18px"} height={"auto"} alt={"Map Icon"} />
                { "->"}
                <i>
                    {nextTown}
                </i>
            </>
        )
    }
}

export default Main;
