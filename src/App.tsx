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

function App() {
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [name, setName] = useState("");
  const [qrCode, setQrCode] = useState("");
  const canvasRef = useRef(null);

  const generateQrCode = () => {
    const today = new Date();
    // Format date in YYYY-MM-DD format
    // const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const qrCodeString = `BCD\n001\n1\nSCT\n${bic}\n${name}\n${iban.replace(/\s/g, '')}\nEUR${amount}\n\n${reference}\n\nReqdExctnDt/2023-01-01`;
    setQrCode(qrCodeString);
  };

  const downloadQrCode = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = image;
    link.click();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4" >Generate EPC QR Code</h1>
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={generateQrCode}
          >
            Generate QR Code
          </button>
        </div>
      </div>
      {qrCode && (
        <QRCode
          id="qr-code"
          value={qrCode}
          size={512}
          level={"H"}
          includeMargin={true}
          renderAs={"canvas"}
        />
        )}
        {qrCode && <div className="form-group">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={downloadQrCode}
          >
            Download QR Code
          </button>
        </div>}
    </div>
  );
}

export default App;