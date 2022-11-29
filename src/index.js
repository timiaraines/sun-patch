import React, { useState, useEffect } from "react"
import {createRoot} from "react-dom/client";
import Axios from "axios"
import CreateNewForm from "./components/createNewForm";
import PlantCard from "./components/PlantCard";
import { Footer } from "./components/Footer";
import { NavBar } from "./components/NavBar"

function App(){
    const [plants, setPlants] = useState([])

    useEffect(() => {
        async function go() {
            const response = await Axios.get("/api/plants")
            setPlants(response.data)
        }
        go()
    }, [])


    return (
        <div className="container">
            <NavBar />
            <div>
                <br></br>
                <br></br>
            <div>
            <br></br>
            </div>
            </div>
            <CreateNewForm setPlants={setPlants}/>
            <div className="animal-grid">
            {plants.map(function(plant){
                return <PlantCard  key={plant._id} name={plant.name} species={plant.species} photo={plant.photo} id={plant._id} setPlants={setPlants}/>
            })}
            </div>
            <Footer />
        </div>
    )
}

const root = createRoot(document.querySelector("#app"))
root.render(<App />)