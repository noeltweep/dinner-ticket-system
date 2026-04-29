"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        localStorage.setItem("isAdmin", "true");
        router.push("/admin");
      } else {
        setError("Wrong password");
      }
    } catch {
      setError("Unable to login right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#140606] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,120,40,0.25),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,200,90,0.18),transparent_28%),linear-gradient(135deg,#1a0606_0%,#2b0909_35%,#0b0b0b_100%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(120deg,transparent_0%,rgba(255,215,100,0.12)_35%,transparent_60%)]" />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:block">
            <div className="max-w-xl">
              <p className="uppercase tracking-[0.35em] text-xs text-yellow-200/80 mb-4">
                ESUMSA All Stars
              </p>
              <h1 className="text-5xl xl:text-6xl font-semibold leading-tight text-yellow-50">
                Dinner & Awards Night
              </h1>
              <p className="mt-5 text-lg text-yellow-50/80 max-w-lg leading-relaxed">
                Secure access for event administration, ticket generation, and entrance validation.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-4 max-w-md">
                <div className="rounded-2xl border border-yellow-200/15 bg-white/5 backdrop-blur-sm p-4">
                  <p className="text-xs uppercase tracking-widest text-yellow-100/60">Event</p>
                  <p className="mt-2 text-xl font-semibold text-yellow-50">Dinner Night</p>
                </div>
                <div className="rounded-2xl border border-yellow-200/15 bg-white/5 backdrop-blur-sm p-4">
                  <p className="text-xs uppercase tracking-widest text-yellow-100/60">Access</p>
                  <p className="mt-2 text-xl font-semibold text-yellow-50">Admin Portal</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto">
            <div className="rounded-3xl border border-yellow-200/15 bg-black/35 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] p-6 sm:p-8">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.3em] text-yellow-200/70 mb-3">
                  Welcome back
                </p>
                <h2 className="text-3xl font-semibold text-yellow-50">
                  Admin Login
                </h2>
                <p className="mt-2 text-sm text-yellow-50/65">
                  Sign in to generate tickets and manage event entry.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm text-yellow-50/80 mb-2">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-yellow-200/15 bg-white/8 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-red-400/70 focus:bg-white/10"
                    required
                  />
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
                  {loading ? "Signing in..." : "Enter Admin Portal"}
                </button>

                {error && (
                  <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}