"use client";
import axios from "axios";
import xml2js from "xml2js";
import { useEffect, useState } from "react";
import "./index.css";
import ElectricityImbalanceChart from "./dashboard/page";

export default function Home() {
  const [latestImbalance, setLatestImbalance] = useState(null);

  const getData = async () => {
    // Fetch initially
    const response = await axios.get("/api/last");
    debugger;
    const data = response.data;
    console.log(data);
    // set data

    // console.log(response.data.responseData)

    setLatestImbalance(parseInt(response.data[response.data.length - 1].value));
  };

  useEffect(() => {
    // Fetch initially
    getData();

    const interval = setInterval(getData, 10000); // Fetch every 10 seconds

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (latestImbalance > 0) {
      document.getElementById("currentImbalance").classList.add("green");
    } else {
      document.getElementById("currentImbalance").classList.remove("green");
    }
  }, [latestImbalance]);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="hero">
          <div className="heroText">
            <h1>
              Follow The Grid
              <br />
              Save Energy
            </h1>
            Did you know that you can help us save energy
            <br /> just by following the grid.
            <div className="buttonContainer">
              <button
                className="secondaryButton"
                onClick={() => {
                  location.href =
                    location.protocol +
                    "//" +
                    location.host +
                    location.pathname +
                    "#infoSection";
                }}
              >
                Learn More
              </button>
              <button
                className="primaryButton"
                onClick={() => {
                  location.href =
                    location.protocol +
                    "//" +
                    location.host +
                    location.pathname +
                    "#followGridSection";
                }}
              >
                Follow The Grid
              </button>
            </div>
          </div>
          <div className="graph">
            <div className="graphContainer">
              <ElectricityImbalanceChart />
            </div>
            <div className="imbalanceShowcase">
              Current Imbalance:
              <span id="currentImbalance"> {latestImbalance}</span>
            </div>
          </div>
        </div>
      </main>

      <div className="hero hero2">
        <div className="graph">
          <div className="graphContainer"></div>
          <div className="moreImage">
            <img id="infoSection" src="/graphImage.png"></img>
          </div>
        </div>
        <div className="heroText heroText2">
          <h1>What is Imbalance?</h1>
          Grid imbalance happens when the electricity demand is either higher
          (positive imbalance) or lower (negative imbalance) than what is being
          generated. Positive imbalance means too much electricity, while
          negative imbalance means not enough electricity, and both can cause
          problems for the grid.
          <div className="buttonContainer buttonContainer2">
            <button
              className="secondaryButton"
              onClick={() => {
                window.open(
                  "https://www.lawinsider.com/dictionary/energy-imbalance#:~:text=Energy%20Imbalance%20means%20any%20difference,congestion%20or%20other%20scheduling%20fees.",
                  "_blank"
                );
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div className="hero hero2 hero3">
        <div className="heroText heroText2 heroText3">
          <h1 id="followGridSection">How To Follow The Grid?</h1>
          With the <b>I❤️Grid</b> device you can always follow if the imbalance
          is positive or negative.
          <div className="buttonContainer buttonContainer2">
            <button
              className="secondaryButton"
              onClick={() => {
                window.open(
                  "https://www.lawinsider.com/dictionary/energy-imbalance#:~:text=Energy%20Imbalance%20means%20any%20difference,congestion%20or%20other%20scheduling%20fees.",
                  "_blank"
                );
              }}
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="graph">
          <div className="graphContainer"></div>
          <div className="moreImage more3">
            <img className="more3Img" src="product.png"></img>
          </div>
        </div>
      </div>
    </>
  );
}
