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
      {
        fps: 10,
        qrbox: 250,
        aspectRatio: 1,
      },
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
          setTimeout(() => {
            startScanner();
          }, 100);
        }, 3000);
      },
      () => {}
    );

    scannerRef.current = scanner;
  };

  const successScreen = status === "success";
  const errorScreen = status === "error";

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-300 ${
        successScreen
          ? "bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-950 text-white"
          : errorScreen
          ? "bg-gradient-to-br from-red-800 via-red-700 to-red-950 text-white"
          : "bg-[#140606] text-white"
      }`}
    >
      {!status && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,110,40,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,204,102,0.18),transparent_26%),linear-gradient(135deg,#1d0606_0%,#300808_34%,#0a0a0a_100%)]" />
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(115deg,transparent_0%,rgba(255,215,120,0.14)_35%,transparent_65%)]" />
        </>
      )}

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {!status && (
          <div className="w-full max-w-6xl grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
            <div>
              <p className="uppercase tracking-[0.35em] text-xs text-yellow-200/70 mb-3">
                Entry Verification
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold text-yellow-50 leading-tight">
                Scan Guest Ticket
              </h1>
              <p className="mt-4 text-yellow-50/65 max-w-md leading-relaxed">
                Verify tickets instantly at the venue entrance using the QR code on each guest ticket.
              </p>

              <div className="mt-8 rounded-3xl border border-yellow-200/15 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-sm text-yellow-50/70">
                  Tap the scanner controls to open the camera, then point the device at the QR code on the guest ticket.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-yellow-200/15 bg-black/30 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-5 sm:p-7">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-yellow-50">
                  Scanner Console
                </h2>
                <p className="mt-1 text-sm text-yellow-50/55">
                  Open the camera and scan each ticket for instant access validation.
                </p>
              </div>

              <div className="rounded-3xl bg-white/95 p-4 sm:p-5">
                <div id="reader" className="scanner-shell w-full overflow-hidden rounded-2xl" />
              </div>
            </div>
          </div>
        )}

        {status && (
          <div className="text-center px-6">
            <div className="inline-flex mb-6 rounded-full border border-white/20 px-4 py-2 text-sm uppercase tracking-[0.3em] bg-white/10">
              Ticket Verification
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold mb-4">
              {status === "success" ? "ACCESS GRANTED" : "ACCESS DENIED"}
            </h1>
            <p className="text-xl sm:text-2xl max-w-2xl mx-auto">
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}