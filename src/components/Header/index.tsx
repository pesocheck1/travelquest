"use client";

import Image from "next/image";
import React from "react";

export default function Header() {
  const handleLogoClick = () => {
    window.location.href = "/";
  };

  return (
    <header className="w-full flex justify-between items-center px-6 py-1 2xl:py-6 bg-gradient-to-r from-yellow-400 to-orange-400">
      <div
        onClick={handleLogoClick}
        className="flex items-center space-x-1 2xl:space-x-0 cursor-pointer hover:opacity-80 transition"
        style={{ fontFamily: '"Glacial Indifference", sans-serif' }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleLogoClick()}
      >
        <Image
          src="/logo.svg"
          alt="Travel Quest Logo"
          width={45}
          height={45}
          className="2xl:w-[90px] 2xl:h-[90px]"
        />
        <span className="text-white text-3xl relative top-3 2xl:text-5xl 2xl:top-4">
          TRAVELQUEST
        </span>
      </div>

      <nav className="flex gap-6 items-center 2xl:gap-10">
        <button
          type="button"
          className="text-white font-semibold text-xl hover:opacity-75 transition cursor-pointer"
        >
          About us
        </button>

        <button
          type="button"
          className="text-white font-semibold text-xl hover:opacity-75 transition cursor-pointer"
        >
          Blog
        </button>

        <button
          type="button"
          className="bg-white text-orange-600 font-bold px-4 py-1 rounded-md 2xl:px-6 2xl:py-2 text-xl hover:bg-orange-100 transition cursor-pointer"
        >
          Log in
        </button>
      </nav>
    </header>
  );
}
