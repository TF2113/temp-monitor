import LineChart from "./components/LineChart.jsx";
import { useEffect, useState } from "react";
import Select from "react-select";

function History() {
  const options = [
    { value: "day", label: "Daily" },
    { value: "week", label: "Weekly" },
    { value: "month", label: "Monthly" },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [tempData, setTempData] = useState(null);
  const [humData, setHumData] = useState(null);
  const [paData, setPaData] = useState(null);

  const fetchReading = async (period) => {
    try {
      const res = await fetch(
        `https://tombuilds.tech/readings/readingsSince?period=${period}`
      );
      const data = await res.json();

      const temps = data.map((r) => r.temperature);

      let times;

      switch (period) {
        case "day":
          times = data.map((r) =>
            new Date(r.timestamp + "Z").toLocaleTimeString("en-GB", {
              timeZone: "Europe/London",
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            })
          );
          break;

        case "week":
          const weekdays = data.map((r) =>
            new Date(r.timestamp + "Z").toLocaleDateString("en-GB", {
              weekday: "long",
            })
          );
          let lastDay = null;
          times = weekdays.map((day) => {
            if (day === lastDay) return "";
            lastDay = day;
            return day;
          });
          
        case "month":
          const days = data.map((r) => new Date(r.timestamp + "Z").getDate());
          let lastDate = null;
          times = days.map((day) => {
            if (day === lastDate) return "";
            lastDate = day;
            return day;
          });
          break;
      }
      const humidity = data.map((r) => r.humidity);
      const pressure = data.map((r) => r.pressure);

      setTempData({
        labels: times,
        datasets: [
          {
            label: "Temperature (C)",
            data: temps,
            borderColor: "red",
          },
        ],
      });

      setHumData({
        labels: times,
        datasets: [
          {
            label: "Humidity (%)",
            data: humidity,
            borderColor: "blue",
          },
        ],
      });

      setPaData({
        labels: times,
        datasets: [
          {
            label: "Pressure (hPa)",
            data: pressure,
            borderColor: "yellow",
          },
        ],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onChange = (userOption) => {
    setSelectedOption(userOption);
    fetchReading(userOption.value);
  };

  useEffect(() => {
    fetchReading(selectedOption.value);
  }, []);

  return (
    <div>
      <div className="separator"></div>
      <h2 className="pageTitle">Reading History</h2>
      <Select value={selectedOption} onChange={onChange} options={options} />
      <LineChart chartTitle={"Temp History"} chartData={tempData} />
      <LineChart chartTitle={"Humidity History"} chartData={humData} />
      <LineChart chartTitle={"Pressure History"} chartData={paData} />
      <div className="separator"></div>
    </div>
  );
}

export default History;
