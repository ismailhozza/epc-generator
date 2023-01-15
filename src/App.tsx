/*

React component that generates EPC QR code. It get's following inputs from the user:

1. Receiver’s Name
2. IBAN account number
3. BIC/SWIFT code
4. Amount (Euro)
5. Reference (optional)

It then creates a QR code that can be scanned by the receiver’s bank to make the payment. This QR code can be
saved as an image file and shared with the receiver.

*/
import React, { useState, useRef } from "react";
import QRCode from "qrcode.react";
import Barcode from "react-barcode";

function createBankBarcode(
  version: string = "4",
  iban: string,
  amountInEuro: string,
  reference: string,
) {
  const today = new Date();
  // Format date in YYMMDD format
  const lastTwoDigitsOfYear = today.getFullYear().toString().substr(-2);
  const paddedDate = (today.getDate() < 10 ? "0" : "") + today.getDate();
  const paddedMonth = (today.getMonth() < 9 ? "0" : "") + (today.getMonth() + 1);
  const date = `${lastTwoDigitsOfYear}${paddedMonth}${paddedDate}`;

  // IBAN should be 16 digits long and not contain any spaces and characters
  const ibanWithoutSpaces = iban.replace(/\s/g, "");
  const ibanWithoutSpacesAndCharacters = ibanWithoutSpaces.replace(/[^\d]/g, "");

  // Amount should be 6 digits long and not contain any spaces and characters
  const amountWithoutSpaces = amountInEuro.replace(/\s/g, "");
  const amountParts = amountWithoutSpaces.replace(',', '.').split('.');
  // const amountWithoutSpacesAndCharacters = amountWithoutSpaces.replace(/[^\d]/g, "");
  
  // Split amount into integer and decimal part
  const amountIntegerPart = (amountParts[0] ?? "0").replace(/[^\d]/g, "");
  const amountDecimalPart = (amountParts[1] || "00").replace(/[^\d]/g, "");

  // Pad decimal part to 2 digits
  const amountDecimalPartPadded = amountDecimalPart.padEnd(2, "0");

  const amount = `${amountIntegerPart.padStart(6, "0")}${amountDecimalPartPadded}`;
  console.log('amount:', amount)

  // Reference should be 20 digits long and not contain any spaces and characters
  const referenceWithoutSpaces = reference.replace(/\s/g, "");
  const referenceWithoutSpacesAndCharacters = referenceWithoutSpaces.replace(/[^\d]/g, "");
  const referenceNumber = referenceWithoutSpacesAndCharacters.padStart(23, "0");

  // Create result.
  return `${version}${ibanWithoutSpacesAndCharacters}${amount}${referenceNumber}${date}`;
}

function convertMmToPx(mm: number) {
  const mmToPx = 96 / 25.4;
  const px = mm * mmToPx;
  // Return as whole number and string.
  return px.toFixed(0);
}

function findSvgAndDownloadAsPng() {
  const svg = document.querySelector("svg");

  // Do nothing if there is no SVG
  if (!svg) {
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Do nothing if there is no canvas
  if (!ctx) {
    return;
  }

  // Set svg size to 105mm x 12.7mm
  // svg.setAttribute("width", convertMmToPx(105));
  // svg.setAttribute("height", convertMmToPx(12.7));

  // Set canvas size to SVG size
  canvas.width = svg.clientWidth;
  canvas.height = svg.clientHeight;

  const data = new XMLSerializer().serializeToString(svg);
  const DOMURL = window.URL || window.webkitURL || window;
  const img = new Image();
  const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  const url = DOMURL.createObjectURL(svgBlob);
  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    const png = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.download = "barcode.png";
    a.href = png;
    a.click();
  };
  img.src = url;
}

function App() {
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [name, setName] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [barCode, setBarcode] = useState("");

  const generateQrCode = () => {
    // Barcode generation
    const barcode = createBankBarcode("4", iban, amount, reference);
    setBarcode(barcode);

    // QR code generation
    // Amount should be in format 123.45
    const amountInDecimal = parseFloat(amount.replace(',', '.')).toFixed(2);
    const qrCodeString = `BCD\n001\n1\nSCT\n${bic}\n${name}\n${iban.replace(/\s/g, '')}\nEUR${amountInDecimal}\n\n${reference}\n\nReqdExctnDt/2023-01-01`;
    setQrCode(qrCodeString);
  };

  const downloadBarcode = () => {
    // SVG to PNG conversion
    findSvgAndDownloadAsPng();
  };

  const downloadQrCode = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = image;
    link.click();
  };

  const validToGenerate = () => {
    return iban.length > 0 && bic.length > 0 && amount.length > 0 && reference.length > 0 && name.length > 0;
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center" >EPC QR Code Generator</h1>
      <div className="form">
        <div className="form-group">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="name">Receiver's Name</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="iban">IBAN Account Number</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            id="iban"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="bic">BIC/SWIFT Code</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            id="bic"
            value={bic}
            onChange={(e) => setBic(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="amount">Amount (Euro)</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="reference">Reference</label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button
            className="bg-success-500 hover:bg-success-700 text-white font-bold my-2 py-2 px-4 rounded"
            disabled={!validToGenerate()}
            onClick={generateQrCode}
          >
            Generate Codes
          </button>
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col justify-center items-center">
        {qrCode && (
          <QRCode
            id="qr-code"
            value={qrCode}
            size={256} // 512 / 2 = 256
            level={"H"}
            includeMargin={true}
            renderAs={"canvas"}
          />
        )}
        {qrCode && <div className="form-group">
          <button
            className="bg-info-500 hover:bg-info-700 text-white font-bold my-2 py-2 px-4 rounded"
            onClick={downloadQrCode}
          >
            Download QR Code
          </button>
      </div>}
        <hr className="my-4" />
        {barCode && <div className="w-full flex justify-center">
          <Barcode value={barCode} displayValue={false} width={2} format="CODE128" />
        </div> }
        {/* Download barcode */}
        {barCode && <div className="form-group">
          <button
            className="bg-info-500 hover:bg-info-700 text-white font-bold my-2 py-2 px-4 rounded"
            onClick={downloadBarcode}
          >
            Download Barcode
          </button>
        </div>}
        <hr className="my-4" />
      </div>
    </div>
  );
}

export default App;