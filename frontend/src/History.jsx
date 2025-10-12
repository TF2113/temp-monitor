import LineChart from "./components/LineChart.jsx"
import { useEffect, useState } from "react"

function History(){

    const [tempData, setTempData] = useState(null);
    const [humData, setHumData] = useState(null);
    const [paData, setPaData] = useState(null);

    const fetchReading = async () => {
      try {
        const res = await fetch("https://tombuilds.tech/readings/readingsSince?period=day");
        const data = await res.json();
        
        const temps = data.map(r => r.temperature);
        const times = data.map(r => new Date(r.timestamp).toLocaleTimeString())
        const humidity = data.map(r => r.humidity);
        const pressure = data.map(r => r.pressure);
  
        setTempData({
          labels: times,
          datasets: [{
            label: "Temperature (C)",
            data: temps,              
            borderColor: "red"
          }]
        })
  
        setHumData({
          labels: times,
          datasets: [{            
            label: "Humidity (%)",
            data: humidity,
            borderColor: "blue"
          }]
        })

        setPaData({
          labels: times,
          datasets: [{            
            label: "Pressure (hPa)",
            data: pressure,
            borderColor: "yellow"
          }]
        })

      } catch (err) {
      console.log(err)
    } 
  }

    useEffect(() => {
      fetchReading();
    }, []);

    return(
        <div>
            <div className="separator"></div>
            <h2 className="pageTitle">Reading History</h2>
            <LineChart chartTitle ={"Temp History"} chartData={tempData}/>
            <LineChart chartTitle ={"Humidity History"} chartData={humData}/>
            <LineChart chartTitle ={"Pressure History"} chartData={paData}/>
            <div className="separator"></div>

        </div>
    )
}

export default History