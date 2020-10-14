import React, { useState, createContext } from "react"

export const SelectedTownContext = createContext()

export const SelectedTownProvider = ({ children }) => {
    const [selectedTown, setSelectedTown] = useState(null)
    return (
        <>
            <SelectedTownContext.Provider
                value={[selectedTown, setSelectedTown]}
            >
                {children}
            </SelectedTownContext.Provider>
        </>
    )
}
