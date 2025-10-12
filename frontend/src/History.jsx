import LineChart from "./components/LineChart.jsx"
import { useEffect, useState } from "react"

function History(){

    const [tempData, setTempData] = useState(null);
    const [humData, setHumData] = useState(null);
    const [paData, setPaData] = useState(null);

    const fetchReading = async () => {
      try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&past_days=10&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m");
        const data = await res.json();
        
        const temps = data.hourly.temperature_2m.slice(0, 24);
        const times = data.hourly.time.slice(0, 24);
        const humidity = data.hourly.relative_humidity_2m.slice(0, 24);
  
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
            <div className="separator"></div>

        </div>
    )
}

export default History