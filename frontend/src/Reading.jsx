import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Reading(){

    const [reading, setReading] = useState(null);

    const fetchReading = () => {
        fetch('/readings/recentReading')
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
            <div className="separator"></div>
            <span className="projectDemoDesc">IoT project I made to learn Spring Boot, PostgreSQL and Docker, to play around with the ESP32 IDF<br />
            and the basis for this website's existence as a reason to deploy a website on AWS. <br /></span>

            <span><br/ >This reading will automatically update every 60 seconds if I've remembered to power the ESP32. <br /></span>
            <h3>Most Recent Reading</h3>
            {reading ? (
                <div>
                    <p>Temperature: <strong>{reading.temperature} °C</strong></p>  
                    <p>Humidity: <strong>{reading.humidity}%</strong></p>  
                    <p>Pressure: <strong>{reading.pressure} hPa</strong></p>
                    <p>Taken at: <strong>{new Date(reading.timestamp + "Z").toLocaleString("en-GB", {
                        timeZone: "Europe/London",
                        hour12: false
                    })}</strong></p>  
                    <span> <br /> </span>
                    <a href="https://www.linkedin.com/in/tomferguson404/" target="_blank" rel="noopener noreferrer">LinkedIn</a> 
                </div>
            ) : (
                <div>
                    <p>
                        Loading...
                    </p>
                    <p><Link to="./history">View Reading History</Link></p>
                </div>
                
            )}
            <div className="separator"></div>
        </div>
    );
}

export default Reading