import { NextResponse } from "next/server";
import axios from "axios";
import xml2js from "xml2js";

export async function GET() {
  const now = new Date();
  const formattedDateNow = now.toISOString().slice(0, 19) + "+02:00"; // Add the desired timezone offset

  const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);

  // Convert to the desired format
  const formattedDate = fiveHoursAgo.toISOString().slice(0, 19);
  const timezoneOffset = fiveHoursAgo.getTimezoneOffset();
  const timezoneOffsetFormatted =
    (timezoneOffset < 0 ? "+" : "-") +
    Math.abs(Math.floor(timezoneOffset / 60))
      .toString()
      .padStart(2, "0") +
    ":" +
    Math.abs(timezoneOffset % 60)
      .toString()
      .padStart(2, "0");

  const fiveHoursAgoFormatted = formattedDate + timezoneOffsetFormatted;
  console.log(fiveHoursAgoFormatted);
  console.log(formattedDateNow);
  const soapRequest = `<?xml version="1.0" encoding="utf-8"?>\
      <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\
          <soap12:Body>\
              <AktualniSystemovaOdchylkaCR xmlns="https://www.ceps.cz/CepsData/">\
                  <dateFrom>${fiveHoursAgoFormatted}</dateFrom>\
                  <dateTo>${formattedDateNow}</dateTo>\
              </AktualniSystemovaOdchylkaCR>\
          </soap12:Body>\
      </soap12:Envelope>`;
  try {
    let itemList = [];
    const response = await axios.post(
      "https://vip-test-service-00-azapp.azurewebsites.net/_layouts/CepsData.asmx",
      soapRequest,
      {
        headers: {
          "Content-Type": "application/soap+xml; charset=utf-8",
        },
      }
    );
    const responseData = response.data;

    if (response.status === 200) {
      // Parse the SOAP response
      xml2js.parseString(responseData, (err, result) => {
        const dataItems =
          result["soap:Envelope"]["soap:Body"][0][
            "AktualniSystemovaOdchylkaCRResponse"
          ][0]["AktualniSystemovaOdchylkaCRResult"][0]["root"][0]["data"][0][
            "item"
          ];
        // Extract the date and value from each item
        itemList = dataItems.map((item) => ({
          date: item.$.date,
          value: item.$.value1,
        }));
      });
    }
    return NextResponse.json(itemList);
  } catch (error) {
    return NextResponse.json({ Error: "Something went wrong" });
  }
}