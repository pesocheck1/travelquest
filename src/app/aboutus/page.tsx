"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "../../components/Header";

export default function AboutUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!name || !email || !message) {
      setError("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSuccess("Your message has been sent successfully!");

      setName("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY * 0.5); // скорость 0.5
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-[#3e2723]">
      <Header />

      {/* HERO */}
      <section className="relative w-full h-[480px] overflow-hidden">
        <div
          className="absolute w-full h-[150%] top-[-13%]"
          style={{ transform: `translateY(${offset * 0.7}px)` }}
        >
          <Image
            src="/team.svg"
            alt="About Us Hero"
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg text-center">
            About TravelQuest Okinawa
          </h1>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6 text-[#3e2723] text-center">
          How It Works
        </h2>

        <p className="text-lg leading-relaxed mb-4 pl-4">
          <strong>Discover Okinawa easily!</strong> Our gamified travel planner
          is made for first-time visitors who want a simple, fun way to explore
          the island without getting lost in endless guides.
        </p>

        <p className="text-lg leading-relaxed mb-4 pl-4">
          We carefully selected the best beaches, hidden gems, and must-see
          attractions across Okinawa. Everything is handpicked so you can
          <strong> enjoy your trip without stress.</strong>
        </p>

        <p className="text-lg leading-relaxed mb-6 pl-4">
          With cute avatars, an interactive map, and a bright, intuitive
          interface, you can plan your route, save your favorite spots, and
          explore Okinawa at your own pace.
        </p>
      </section>

      {/* CONTACT FORM */}
      <div className="flex flex-col items-center text-center w-full pb-12">
        <h2 className="text-3xl font-bold mb-6 text-[#3e2723]">Contact Us</h2>
        <p className="text-[#3e2723] text-base max-w-md mb-6">
          Have questions or suggestions? Write to us and we&apos;ll get back to
          you as soon as possible!
        </p>

        {/* NAME */}
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
          border bg-white rounded-md px-4 py-2 w-2/4 mb-6 text-center text-lg
          focus:outline-none
          focus:shadow-[0_0_20px_4px_rgba(255,223,0,0.8)]
          transition-shadow duration-300
        "
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
          border bg-white rounded-md px-4 py-2 w-2/4 mb-6 text-center text-lg
          focus:outline-none
          focus:shadow-[0_0_20px_4px_rgba(255,223,0,0.8)]
          transition-shadow duration-300
        "
        />

        {/* MESSAGE */}
        <textarea
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="
          border bg-white rounded-md px-4 py-2 w-2/4 h-32 mb-6 text-center text-lg resize-none
          focus:outline-none
          focus:shadow-[0_0_20px_4px_rgba(255,223,0,0.8)]
          transition-shadow duration-300
        "
        />

        {/* ERROR */}
        {error && <p className="text-red-600 text-lg mb-4">{error}</p>}

        {/* SUCCESS */}
        {success && <p className="text-green-700 text-lg mb-4">{success}</p>}

        {/* BUTTON */}
        <button
          disabled={loading}
          onClick={handleSubmit}
          className={`
          font-bold py-3 px-10 rounded-md transition text-lg
          ${
            loading
              ? "bg-[#F39897] text-white cursor-not-allowed"
              : "bg-[#e74c3c] text-white hover:bg-[#d84333] cursor-pointer"
          }
        `}
        >
          {loading ? "Sending..." : "SEND"}
        </button>
      </div>
    </div>
  );
}
