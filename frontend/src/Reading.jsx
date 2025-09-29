import axios from "axios";
import React, { useState, useEffect } from "react";

function Reading(){

    const [reading, setReading] = useState(null);

    const fetchReading = () => {
        fetch('http://localhost:8080/readings/recentReading')
        .then((response) => response.json())
        .then((data) => {setReading(data);
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

    useEffect(() => {
        fetchReading();
        const interval = setInterval(fetchReading, 60_000);
        return () => clearInterval(interval);
    }, []);

    return(
        <div>
            <h2>Most Recent Reading</h2>
            {reading ? (
                <div>
                    <p>Temperature: {reading.temperature}</p>  
                    <p>Humidity: {reading.humidity}</p>  
                    <p>Pressure: {reading.pressure}</p>   
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Reading