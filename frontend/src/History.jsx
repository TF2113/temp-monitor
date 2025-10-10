import LineChart from "./components/LineChart.jsx"
import { useState } from "react"

function History(){

    const [tempData, setTempData] = useState({
        labels: ["10:00", "10:05", "10:10", "10:15", "10:20"],
        datasets: [
      {
        label: "Temperature (°C)",
        data: [23.5, 23.8, 23.9, 24.1, 23.7],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3, 
      }
    ]
});
    const [humData, setHuData] = useState({
        labels: ["10:00", "10:05", "10:10", "10:15", "10:20"],
        datasets: [
      {
        label: "Humidity (%)",
        data: [64, 63, 62, 65, 64],
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.3,
      }
    ]
});
    const [paData, setPaData] = useState({
        labels: ["10:00", "10:05", "10:10", "10:15", "10:20"],
        datasets: [
      {
        label: "Pressure (hPa)",
        data: [1035, 1034, 1036, 1033, 1035],
        borderColor: "rgb(255, 205, 86)",
        backgroundColor: "rgba(255, 205, 86, 0.2)",
        tension: 0.3,
      }
    ]
  });

    return(
        <div>
            <div className="separator"></div>
            <h2 className="pageTitle">Reading History</h2>
            <LineChart chartTitle ={"Temp History"} chartData={tempData}/>
            <LineChart chartTitle ={"Humidity History"} chartData={humData}/>
            <LineChart chartTitle ={"Pressure History"}  chartData={paData}/>
            <div className="separator"></div>

        </div>
    )
}

export default History