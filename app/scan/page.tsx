"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ScanPage() {
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    startScanner();

    return () => {
      scannerRef.current?.clear().catch(() => {});
    };
  }, []);

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        scanner.clear();
        setResult("Checking ticket...");
        setStatus(null);

        const response = await fetch("/api/verify-ticket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketId: decodedText }),
        });

        const data = await response.json();

        if (response.ok) {
          setResult(data.message);
          setStatus("success");
        } else {
          setResult(data.error);
          setStatus("error");
        }

        setTimeout(() => {
          setResult(null);
          setStatus(null);
          // Wait a tiny bit for DOM to re-render
          setTimeout(() => {
            startScanner();
          }, 100);
        }, 3000);
      },
      (error) => {
        console.warn(error);
      }
    );

    scannerRef.current = scanner;
  };

  const backgroundColor =
    status === "success"
      ? "bg-green-600"
      : status === "error"
      ? "bg-red-600"
      : "bg-gray-100";

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-all duration-300 ${
    status ? "text-white" : "text-black"
  } ${backgroundColor}`}
    >
      {!status && (
        <>
          <h1 className="text-4xl font-bold mb-6 text-black">
            Scan Ticket
          </h1>
          <div
            id="reader"
            className="w-80 bg-white p-4 rounded shadow-md"
          ></div>
        </>
      )}

      {status && (
        <div className="text-center px-6">
          <h1 className="text-5xl font-bold mb-4">
            {status === "success" ? "ACCESS GRANTED" : "ACCESS DENIED"}
          </h1>
          <p className="text-2xl">{result}</p>
        </div>
      )}
    </div>
  );
}