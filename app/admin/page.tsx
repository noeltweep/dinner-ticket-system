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
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#140606] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,110,40,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,204,102,0.18),transparent_26%),linear-gradient(135deg,#1d0606_0%,#300808_34%,#0a0a0a_100%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(115deg,transparent_0%,rgba(255,215,120,0.14)_35%,transparent_65%)]" />

      <div className="relative px-4 py-8 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="uppercase tracking-[0.35em] text-xs text-yellow-200/70 mb-3">
                ESUMSA Dinner & Awards Night
              </p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-yellow-50">
                Ticket Registration Portal
              </h1>
              <p className="mt-2 text-sm sm:text-base text-yellow-50/65 max-w-2xl">
                Generate branded tickets, email guests instantly, and keep entry records organized in one place.
              </p>
            </div>
            <div className="inline-flex items-center rounded-2xl border border-yellow-200/15 bg-white/5 px-4 py-3 text-sm text-yellow-100/80">
              Event Access • Admin Control
            </div>
          </div>

          <div className="grid xl:grid-cols-[1.05fr_0.95fr] gap-8">
            <div className="rounded-3xl border border-yellow-200/15 bg-black/30 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-6 sm:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-yellow-50">
                  Generate Ticket
                </h2>
                <p className="mt-2 text-sm text-yellow-50/60">
                  Fill in the guest details below and issue a ticket instantly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-yellow-50/80 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter guest full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-2xl border border-yellow-200/15 bg-white/8 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-red-400/70 focus:bg-white/10"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm text-yellow-50/80 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="guest@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border border-yellow-200/15 bg-white/8 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-red-400/70 focus:bg-white/10"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-yellow-50/80 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-2xl border border-yellow-200/15 bg-white/8 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-red-400/70 focus:bg-white/10"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-yellow-50/80 mb-2">
                      Ticket Type
                    </label>
                    <select
                      value={ticketType}
                      onChange={(e) => setTicketType(e.target.value as TicketType)}
                      className="w-full rounded-2xl border border-yellow-200/15 bg-white/8 px-4 py-3 text-white outline-none focus:border-red-400/70 focus:bg-white/10"
                    >
                      <option className="text-black" value="Regular">Regular</option>
                      <option className="text-black" value="VIP">VIP</option>
                      <option className="text-black" value="Table for 10">Table for 10</option>
                      <option className="text-black" value="All Star">All Star</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full rounded-2xl py-3 font-semibold transition ${
                    loading
                      ? "bg-red-400/50 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-950/40"
                  }`}
                >
                  {loading ? "Generating Ticket..." : "Generate & Send Ticket"}
                </button>

                {errorMessage && (
                  <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>

            <div className="rounded-3xl border border-yellow-200/15 bg-black/30 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-yellow-50">
                  Ticket Preview
                </h2>
                <p className="mt-2 text-sm text-yellow-50/60">
                  Generated ticket details and QR code will appear here after submission.
                </p>
              </div>

              {!qrCode ? (
                <div className="h-full min-h-[380px] rounded-3xl border border-dashed border-yellow-200/20 bg-white/5 flex items-center justify-center text-center px-6">
                  <div>
                    <p className="text-lg font-medium text-yellow-50/85">
                      No ticket generated yet
                    </p>
                    <p className="mt-2 text-sm text-yellow-50/50">
                      Submit a guest record to preview the generated QR code and ticket details.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-yellow-200/15 bg-white/5 p-6">
                  <div className="mb-5">
                    <p className="text-sm uppercase tracking-[0.25em] text-yellow-200/60">
                      Generated Successfully
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-yellow-50">
                      {ticketType}
                    </h3>
                  </div>

                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-yellow-50/60">Ticket ID</span>
                      <span className="font-semibold text-yellow-50">{generatedTicketId}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-yellow-50/60">Guest</span>
                      <span className="font-semibold text-yellow-50">{name}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-yellow-50/60">Delivery</span>
                      <span className="font-semibold text-yellow-50">Email Sent</span>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-5 flex items-center justify-center">
                    <img src={qrCode} alt="QR Code" className="w-56 h-56 object-contain" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}