"use client";

import Image from "next/image";
import { Step } from "../types";

type Props = {
  step: Step;
  name: string;
  setName: (v: string) => void;
  avatar: string | null;
  setAvatar: (v: string | null) => void;
  setStep: React.Dispatch<React.SetStateAction<Step>>;
};

export default function AvatarStep({
  name,
  setName,
  avatar,
  setAvatar,
  setStep,
}: Props) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-8 text-[#3e2723]">
        Enter your name
      </h2>

      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border bg-white rounded-md px-4 py-2 w-2/4 mb-12 text-center focus:outline-none focus:shadow-[0_0_20px_4px_rgba(255,223,0,0.8)]"
      />

      <h3 className="text-2xl font-bold mb-4 text-[#3e2723]">
        Select your avatar
      </h3>

      <div className="flex justify-center space-x-6 mb-8">
        {["/avatar1.svg", "/avatar2.svg", "/avatar3.svg"].map((src, i) => {
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
                if (!isSelected) e.currentTarget.style.boxShadow = "none";
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
                width={70}
                height={70}
                className="rounded-full"
              />
            </button>
          );
        })}
      </div>

      <button
        disabled={!name || !avatar}
        onClick={() => setStep("preferences")}
        className={`font-bold py-3 px-10 rounded-md transition ${
          !name || !avatar
            ? "bg-[#F39897] text-white cursor-not-allowed"
            : "bg-[#e74c3c] text-white cursor-pointer hover:bg-[#d84333]"
        }`}
      >
        NEXT
      </button>
    </>
  );
}
