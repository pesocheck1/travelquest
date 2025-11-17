"use client";

import Image from "next/image";
import React from "react";

interface Props {
  onStart: () => void;
}

export default function StartStep({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold text-[#3e2723] mb-4">
        Welcome to TravelQuest Okinawa!
      </h1>
      <p className="text-xl text-[#3e2723] mb-4">
        Gamified route planning across Okinawa — fun and easy!
      </p>
      <Image
        src="/startinglogo.svg"
        alt="Okinawa illustration"
        width={150}
        height={150}
        className="2xl:m-16 mb-8"
      />
      <button
        onClick={onStart}
        className="bg-[#e74c3c] text-white font-bold py-5 px-14 text-xl rounded-md hover:bg-[#d84333] transition cursor-pointer"
      >
        START
      </button>
    </div>
  );
}
