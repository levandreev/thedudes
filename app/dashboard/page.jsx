"use client";
import React from "react";
import { Chart } from "react-google-charts";
import { useState, useEffect } from "react";
import axios from "axios";

const ElectricityImbalanceChart = () => {
  const [chartData, setChartData] = useState([["Time", "Imbalance"]]);
  // debugger;

  const getData = async () => {
    // Fetch initially
    const response = await axios.get("/api/last");
    const data = response.data;

    // Populate chartData
    const newChartData = [
      ["Time", "Imbalance"], // Header row
      ...data.map((item) => [item.date, parseFloat(item.value)]), // Convert each item to the desired format
    ];
    // console.log(response.data.responseData)

    // Update the chartData state
    setChartData(newChartData);
  };
  useEffect(() => {
    // Fetch initially
    getData();

    const interval = setInterval(getData, 100000); // Fetch every 10 seconds

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);


  return (
    <Chart
      width={"600px"}
      height={"450px"}
      chartType="LineChart"
      loader={<div>Loading Chart</div>}
      data={chartData}
      options={{
        title: "Electricity Imbalance",
        curveType: "line",
        hAxis: {
          title: "Time",
        },
        vAxis: {
          title: "Imbalance",
          minValue: -200,
          maxValue: 300,
        },
      }}
      rootProps={{ "data-testid": "1" }}
    />
  );
};

export default ElectricityImbalanceChart;
