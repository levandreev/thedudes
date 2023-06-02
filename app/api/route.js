import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const data = {
    id: 1,
  };

  return NextResponse.json({ data });
}

export async function POST(request) {
  const body = await request.json();
  console.log(body);

  const soapRequest =
    '<?xml version="1.0" encoding="utf-8"?>\
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\
        <soap12:Body>\
            <AktualniSystemovaOdchylkaCR xmlns="https://www.ceps.cz/CepsData/">\
                <dateFrom>2023-05-01</dateFrom>\
                <dateTo>2023-05-05</dateTo>\
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
    // console.log(responseData);
    return NextResponse.json({ responseData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ Error: "Something went wrong" });
  }
}
