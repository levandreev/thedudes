import { NextResponse } from "next/server";
import axios from "axios";
import xml2js from "xml2js";

export async function GET() {
  const soapRequest =
    '<?xml version="1.0" encoding="utf-8"?>\
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\
        <soap12:Body>\
            <AktualniSystemovaOdchylkaCR xmlns="https://www.ceps.cz/CepsData/">\
                <dateFrom>2023-06-01</dateFrom>\
                <dateTo>2024-06-03</dateTo>\
            </AktualniSystemovaOdchylkaCR>\
        </soap12:Body>\
    </soap12:Envelope>';
  try {
    const response = await axios.post(
      "https://vip-test-service-00-azapp.azurewebsites.net/_layouts/CepsData.asmx",
      soapRequest,
      {
        headers: {
          "Content-Type": "application/soap+xml; charset=utf-8",
        },
      }
    );
    let gridResult = null;
    let lastElem = null;
    const responseData = response.data;
    if (response.status === 200) {
      // Parse the SOAP response
      xml2js.parseString(responseData, (err, result) => {
        if (err) {
          console.error(err);
          return NextResponse.json({ Error: "Something went wrong" });
        } else {
          const dataItems =
            result["soap:Envelope"]["soap:Body"][0][
              "AktualniSystemovaOdchylkaCRResponse"
            ][0]["AktualniSystemovaOdchylkaCRResult"][0]["root"][0]["data"][0][
              "item"
            ];
          // Extract the date and value from each item
          const itemList = dataItems.map((item) => ({
            date: item.$.date,
            value: item.$.value1,
          }));
          lastElem = itemList[itemList.length - 1];
          gridResult = parseInt(lastElem.value) > 0 ? 1 : 0;
        }
      });
    }
    return NextResponse.json({ result: gridResult, value: lastElem });

    // return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ Error: "Something went wrong" });
  }
}

export async function POST() {
  const soapRequest =
    '<?xml version="1.0" encoding="utf-8"?>\
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\
        <soap12:Body>\
            <AktualniSystemovaOdchylkaCR xmlns="https://www.ceps.cz/CepsData/">\
                <dateFrom>2023-06-01</dateFrom>\
                <dateTo>2024-06-03</dateTo>\
            </AktualniSystemovaOdchylkaCR>\
        </soap12:Body>\
    </soap12:Envelope>';
  try {
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
    return NextResponse.json({ responseData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ Error: "Something went wrong" });
  }
}
