"use client";

import { signIn } from "next-auth/react";
import Header from "@/components/Header"; // твой хедэр
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="bg-yellow-50 rounded-2xl shadow-lg p-10 max-w-md w-full text-center relative">
          <h1 className="text-3xl font-bold text-[#3e2723] mb-6">
            Sign in to continue
          </h1>
          <Image
            src="/key.svg"
            alt="Login"
            width={180}
            height={180}
            className="mx-auto mb-6"
          />

          <p className="text-[#5d4037] mb-6 text-lg">
            Use your Google account to access your profile.
          </p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/account" })}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-3 shadow-sm hover:shadow-md transition font-semibold text-[#3e2723] cursor-pointer"
          >
            <Image src="/google.svg" alt="Google" width={24} height={24} />
            Login with Google
          </button>
        </div>
      </main>
    </div>
  );
}
