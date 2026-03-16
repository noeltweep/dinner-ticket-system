"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type TicketType = "Regular" | "VIP" | "Table for 10" | "All Star";

export default function AdminPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ticketType, setTicketType] = useState<TicketType>("Regular");

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [generatedTicketId, setGeneratedTicketId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          ticketType,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.ok) {
        setQrCode(data.qrCode);
        setGeneratedTicketId(data.ticketId);
      } else {
        setErrorMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-black">
          Generate Ticket
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded text-black"
          required
        />

        <select
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value as TicketType)}
          className="w-full p-2 border rounded text-black"
        >
          <option value="Regular">Regular</option>
          <option value="VIP">VIP</option>
          <option value="Table for 10">Table for 10</option>
          <option value="All Star">All Star</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {loading ? "Generating..." : "Generate Ticket"}
        </button>

        {errorMessage && (
          <div className="text-red-600 text-sm font-semibold text-center">
            {errorMessage}
          </div>
        )}

        {qrCode && (
          <div className="mt-6 text-center">
            <p className="font-semibold mb-2 text-black">
              Ticket ID: {generatedTicketId}
            </p>
            <p className="text-sm text-gray-700 mb-3">
              Ticket Type: {ticketType}
            </p>
            <img src={qrCode} alt="QR Code" className="mx-auto" />
          </div>
        )}
      </form>
    </div>
  );
}