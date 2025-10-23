"use client";

import { useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [startingPoint, setStartingPoint] = useState("");
  const [transport, setTransport] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [step, setStep] = useState<"start" | "avatar" | "preferences" | "map">(
    "start"
  );
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-1 bg-gradient-to-r from-yellow-400 to-orange-400">
        <div
          onClick={() => (window.location.href = "/")}
          className="flex items-center space-x-1 cursor-pointer hover:opacity-80 transition"
          style={{ fontFamily: '"Glacial Indifference", sans-serif' }}
        >
          <Image
            src="/logo.svg"
            alt="Travel Quest Logo"
            width={45}
            height={45}
          />
          <span className="text-white text-3xl relative top-3">
            TRAVEL QUEST
          </span>
        </div>
        <div className="space-y-3">
          <div className="w-13 h-[2px] bg-white"></div>
          <div className="w-13 h-[2px] bg-white"></div>
          <div className="w-13 h-[2px] bg-white"></div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center w-full px-4 min-h-screen">
        <div
          className="
      bg-yellow-50 border-none rounded-2xl shadow-sm
      w-[900px] h-[550px]
      2xl:w-[1500px] 2xl:h-[850px]
      flex flex-col items-center justify-center text-center p-2 2xl:p-12
      transition-all duration-500
    "
        >
          {/* STEP 1 */}
          {step === "start" && (
            <>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-4">
                  <h1 className="text-4xl font-bold text-[#3e2723] mb-4">
                    Welcome to TRAVEL QUEST OKINAWA!
                  </h1>
                  <p className="text-xl text-[#3e2723] mb-4">
                    Gamified route planning across Okinawa – fun and easy!
                  </p>
                </div>
                <div className="mb-8">
                  <Image
                    src="/startinglogo.svg" // путь к картинке
                    alt="Okinawa illustration"
                    width={150} // нужная ширина
                    height={150} // нужная высота
                  />
                </div>
                <button
                  onClick={() => setStep("avatar")}
                  className="bg-[#e74c3c] text-white font-bold cursor-pointer py-5 px-14 text-xl rounded-md hover:bg-[#d84333] transition"
                >
                  START
                </button>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === "avatar" && (
            <>
              <h2 className="text-2xl font-bold mb-8 text-[#3e2723]">
                Enter your name
              </h2>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border bg-white rounded-md px-4 py-2 w-2/4 mb-12 text-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <h3 className="text-2xl font-bold mb-4 text-[#3e2723]">
                Select your avatar
              </h3>
              <div className="flex justify-center space-x-6 mb-8">
                {["/avatar1.svg", "/avatar2.svg", "/avatar3.svg"].map(
                  (src, i) => {
                    const isSelected = avatar === src;
                    return (
                      <button
                        key={i}
                        onClick={() => setAvatar(src)}
                        onMouseEnter={(e) => {
                          if (!isSelected)
                            e.currentTarget.style.boxShadow =
                              "0 0 15px rgba(255, 223, 0, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected)
                            e.currentTarget.style.boxShadow = "none";
                        }}
                        className="p-1 rounded-full transition-shadow cursor-pointer duration-300 border-4 border-transparent"
                        style={{
                          boxShadow: isSelected
                            ? "0 0 20px 4px rgba(255, 223, 0, 0.8)"
                            : "none",
                        }}
                      >
                        <Image
                          src={src}
                          alt="avatar"
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      </button>
                    );
                  }
                )}
              </div>

              <button
                disabled={!name || !avatar}
                onClick={() => setStep("preferences")}
                className={`font-bold py-3 px-10 rounded-md transition ${
                  !name || !avatar
                    ? "bg-gray-300 text-white cursor-not-allowed"
                    : "bg-[#e74c3c] text-white cursor-pointer hover:bg-[#d84333]"
                }`}
              >
                NEXT
              </button>
            </>
          )}

          {/* STEP 3 */}
          {step === "preferences" && (
            <div className="text-left w-full max-w-lg">
              <h2 className="text-2xl font-bold text-center mb-12 text-[#3e2723]">
                Select your preferences
              </h2>

              {/* Starting point (кастомный select) */}
              <div className="mb-6 relative">
                <label className="block font-semibold text-[#3e2723] mb-2">
                  Starting point
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="w-full text-left bg-transparent border-b border-[#b08968] py-2 text-[#3e2723] flex justify-between items-center focus:outline-none"
                  >
                    <span>{startingPoint || "Select your starting point"}</span>
                    <span className="text-[#3e2723]">▼</span>
                  </button>

                  {openDropdown && (
                    <div className="absolute left-0 w-full bg-white shadow-lg rounded-md mt-1 border border-[#e0d6c2] z-10">
                      {[
                        "Naha Airport",
                        "Tomari Port",
                        "Chatan (Central Okinawa)",
                        "Nago (Northern Okinawa)",
                      ].map((option) => (
                        <div
                          key={option}
                          onClick={() => {
                            setStartingPoint(option);
                            setOpenDropdown(false);
                          }}
                          className="px-3 py-2 cursor-pointer hover:bg-[#fff6e0] transition"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Transportation */}
              <div className="mb-6">
                <label className="block font-semibold text-[#3e2723] mb-2">
                  Transportation
                </label>
                <div className="flex justify-between w-full">
                  {[
                    { value: "car", label: "Car" },
                    { value: "public", label: "Public transport" },
                  ].map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={value}
                        checked={transport === value}
                        onChange={(e) => setTransport(e.target.value)}
                        className="hidden"
                      />
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          transport === value
                            ? "border-[#3e2723]"
                            : "border-[#d6ccc2]"
                        }`}
                      >
                        {transport === value && (
                          <span className="w-2.5 h-2.5 bg-[#3e2723] rounded-full"></span>
                        )}
                      </span>
                      <span className="text-[#3e2723]">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="mb-8 w-full">
                <label className="block font-semibold text-[#3e2723] mb-2">
                  Interests
                </label>
                <div className="grid grid-cols-3 gap-x-6 gap-y-3 w-full">
                  {[
                    "Beaches",
                    "Hotels",
                    "Food",
                    "Culture",
                    "Shopping",
                    "Activities",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={interests.includes(item)}
                        onChange={() => {
                          setInterests((prev) =>
                            prev.includes(item)
                              ? prev.filter((i) => i !== item)
                              : [...prev, item]
                          );
                        }}
                        className="hidden"
                      />
                      <span
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                          interests.includes(item)
                            ? "bg-[#3e2723] border-[#3e2723]"
                            : "border-[#3e2723]"
                        }`}
                      >
                        {interests.includes(item) && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="text-[#3e2723]">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setStep("map")}
                  disabled={
                    !startingPoint || !transport || interests.length === 0
                  }
                  className={`font-bold py-3 px-16 rounded-md transition ${
                    !startingPoint || !transport || interests.length === 0
                      ? "bg-gray-300 text-white cursor-not-allowed"
                      : "bg-[#e74c3c] text-white cursor-pointer hover:bg-[#d84333]"
                  }`}
                >
                  NEXT
                </button>
              </div>
            </div>
          )}
          {/* STEP 4 — MAP */}

          {step === "map" && (
            <div className="flex flex-col w-full h-screen overflow-hidden">
              <h2 className="text-3xl font-bold text-[#3e2723] mb-2 text-center">
                Where would you like to go?
              </h2>

              {/* Основной контейнер с картой и панелью */}
              <div className="flex flex-row flex-1 w-full bg-yellow-50 overflow-hidden">
                {/* Левая часть — карта */}
                <div className="flex-1 relative flex items-center justify-start 2xl:justify-center pl-6 overflow-hidden">
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      width: "min(90vh, 650px)", // карта масштабируется по высоте окна
                      aspectRatio: "1 / 1", // сохраняем квадратное соотношение сторон
                      maxWidth: "100%",
                    }}
                  >
                    <Image
                      src="/oki1.png"
                      alt="Okinawa map"
                      fill
                      className="object-contain"
                    />

                    {/* Аватар — абсолютная позиция в процентах относительно карты */}
                    {avatar && startingPoint && (
                      <div
                        className="absolute transition-all duration-500"
                        style={{
                          top:
                            startingPoint === "Naha Airport"
                              ? "80%"
                              : startingPoint === "Tomari Port"
                              ? "75%"
                              : startingPoint === "Chatan (Central Okinawa)"
                              ? "66%"
                              : startingPoint === "Nago (Northern Okinawa)"
                              ? "38%"
                              : "35%",
                          left:
                            startingPoint === "Naha Airport"
                              ? "22%"
                              : startingPoint === "Tomari Port"
                              ? "22%"
                              : startingPoint === "Chatan (Central Okinawa)"
                              ? "29%"
                              : startingPoint === "Nago (Northern Okinawa)"
                              ? "52%"
                              : "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Image
                          src={avatar}
                          alt="Selected avatar"
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                      </div>
                    )}

                    {/* Метки регионов */}
                    <div className="text-sm font-medium text-[#3e2723] select-none">
                      {/* Yanbaru */}
                      <div
                        className="absolute left-[82%] top-[5%] bg-white rounded-md shadow-md px-1 py-1 w-[25%] min-w-[120px] cursor-pointer transition duration-300"
                        onClick={() => setSelectedRegion("Yanbaru")}
                        onMouseEnter={(e) => {
                          if (selectedRegion !== "Yanbaru")
                            e.currentTarget.style.boxShadow =
                              "0 0 15px rgba(255, 223, 0, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                          if (selectedRegion !== "Yanbaru")
                            e.currentTarget.style.boxShadow = "";
                        }}
                        style={{
                          boxShadow:
                            selectedRegion === "Yanbaru"
                              ? "0 0 20px 4px rgba(255, 223, 0, 0.8)"
                              : "",
                        }}
                      >
                        <p className="font-bold text-[13px] mb-1">Yanbaru</p>
                        <p className="text-[11px] leading-tight">
                          Famous for Cape Hedo, Yanbaru National Park, Tataki
                          Falls
                        </p>
                        <p className="text-[11px] mt-1 text-gray-600">
                          ~2 hours by car
                        </p>
                      </div>

                      {/* Motobu */}
                      <div
                        className="absolute left-[15%] top-[8%] bg-white rounded-md shadow-md px-1 py-1 w-[25%] min-w-[120px] cursor-pointer transition duration-300"
                        onClick={() => setSelectedRegion("Motobu")}
                        onMouseEnter={(e) => {
                          if (selectedRegion !== "Motobu")
                            e.currentTarget.style.boxShadow =
                              "0 0 15px rgba(255, 223, 0, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                          if (selectedRegion !== "Motobu")
                            e.currentTarget.style.boxShadow = "";
                        }}
                        style={{
                          boxShadow:
                            selectedRegion === "Motobu"
                              ? "0 0 20px 4px rgba(255, 223, 0, 0.8)"
                              : "",
                        }}
                      >
                        <p className="font-bold text-[13px] mb-1">Motobu</p>
                        <p className="text-[11px] leading-tight">
                          Famous for Churaumi Aquarium, Junglia Okinawa and
                          Nakijin Castle Ruins
                        </p>
                        <p className="text-[11px] mt-1 text-gray-600">
                          ~1.5 hours by car
                        </p>
                      </div>

                      {/* Central Okinawa */}
                      <div
                        className="absolute left-[0%] top-[40%] bg-white rounded-md shadow-md px-1 py-1 w-[25%] min-w-[120px] cursor-pointer transition duration-300"
                        onClick={() => setSelectedRegion("Central Okinawa")}
                        onMouseEnter={(e) => {
                          if (selectedRegion !== "Central Okinawa")
                            e.currentTarget.style.boxShadow =
                              "0 0 15px rgba(255, 223, 0, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                          if (selectedRegion !== "Central Okinawa")
                            e.currentTarget.style.boxShadow = "";
                        }}
                        style={{
                          boxShadow:
                            selectedRegion === "Central Okinawa"
                              ? "0 0 20px 4px rgba(255, 223, 0, 0.8)"
                              : "",
                        }}
                      >
                        <p className="font-bold text-[13px] mb-1">
                          Central Okinawa
                        </p>
                        <p className="text-[11px] leading-tight">
                          Famous for American Village, Southeast Botanical
                          Gardens and Sunset Beach
                        </p>
                        <p className="text-[11px] mt-1 text-gray-600">
                          ~1 hour by car
                        </p>
                      </div>

                      {/* South Okinawa */}
                      <div
                        className="absolute left-[40%] top-[75%] bg-white rounded-md shadow-md px-1 py-1 w-[25%] min-w-[120px] cursor-pointer transition duration-300"
                        onClick={() => setSelectedRegion("South Okinawa")}
                        onMouseEnter={(e) => {
                          if (selectedRegion !== "South Okinawa")
                            e.currentTarget.style.boxShadow =
                              "0 0 15px rgba(255, 223, 0, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                          if (selectedRegion !== "South Okinawa")
                            e.currentTarget.style.boxShadow = "";
                        }}
                        style={{
                          boxShadow:
                            selectedRegion === "South Okinawa"
                              ? "0 0 20px 4px rgba(255, 223, 0, 0.8)"
                              : "",
                        }}
                      >
                        <p className="font-bold text-[13px] mb-1">
                          South Okinawa
                        </p>
                        <p className="text-[11px] leading-tight">
                          Famous for Shuri Castle, Kokusai-dori and Okinawa
                          World
                        </p>
                        <p className="text-[11px] mt-1 text-gray-600">
                          ~20 minutes by car
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Правая часть — панель маршрута */}
                <div className="w-[260px] 2xl:w-[340px] bg-[#fff8e1] m-2 rounded shadow-inner p-5 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <h2 className="text-xl font-bold mb-3 text-[#3e2723]">
                      Your route
                    </h2>
                    <p className="text-[#3e2723] text-sm mb-4">
                      <span className="font-semibold">Starting point:</span>{" "}
                      {startingPoint || "Not selected"}
                    </p>
                  </div>

                  <button
                    onClick={() => alert("Next screen")}
                    className="bg-[#e74c3c] text-white font-bold py-3 rounded-md hover:bg-[#d84333] transition mt-auto"
                  >
                    NEXT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
