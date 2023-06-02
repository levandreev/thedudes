"use client";
import axios from "axios";
import xml2js from "xml2js";
import { useEffect, useState } from "react";
import "./index.css";

export default function Home() {
  const [allImbalances, setAllImbalances] = useState([]);
  const [latestImbalance, setLatestImbalance] = useState(null);

  useEffect(() => {
    if (!latestImbalance) {
      handleClick();
      intervalValue();
    }
    if (latestImbalance && latestImbalance > 0) {
      document.getElementById("currentImbalance").classList.add("green");
    } else if (latestImbalance) {
      document.getElementById("currentImbalance").classList.remove("green");
    }
  }, [latestImbalance]);

  function intervalValue() {
    console.log("called");
    setInterval(async function () {
      await handleClick();
      intervalValue();
    }, 15000);
  }

  const handleClick = async () => {
    try {
      const response = await axios.post("/api");

      if (response.status === 200) {
        const soapResponse = response.data.responseData;

        // Parse the SOAP response
        xml2js.parseString(soapResponse, (err, result) => {
          if (err) {
            console.error(err);
          } else {
            const dataItems =
              result["soap:Envelope"]["soap:Body"][0][
                "AktualniSystemovaOdchylkaCRResponse"
              ][0]["AktualniSystemovaOdchylkaCRResult"][0]["root"][0][
                "data"
              ][0]["item"];

            // Extract the date and value from each item
            const itemList = dataItems.map((item) => ({
              date: item.$.date,
              value: item.$.value1,
            }));
            console.log(parseInt(itemList[itemList.length - 1].value));
            setAllImbalances(itemList);
            setLatestImbalance(parseInt(itemList[itemList.length - 1].value));
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
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
                  location.href = location.href + "#infoSection";
                }}
              >
                Learn More
              </button>
              <button className="primaryButton">Follow The Grid</button>
            </div>
          </div>
          <div className="graph">
            <div className="graphContainer"></div>
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
            <img id="infoSection" src="img2.png"></img>
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
    </>
  );
}
