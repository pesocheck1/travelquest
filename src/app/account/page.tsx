import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

export default async function AccountPage() {
  const session = await getServerSession();

  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="bg-yellow-50 rounded-2xl shadow-lg p-10 max-w-md w-full text-center relative">
          <h1 className="text-3xl font-bold text-[#3e2723] mb-2">
            Personal Account
          </h1>
          <Image
            src="/build.svg"
            alt="Login"
            width={180}
            height={180}
            className="mx-auto mb-4"
          />

          <p className="text-[#5d4037] mt-5 mb-9 text-lg">
            This feature is currently under development. Please check back soon!
          </p>

          <Link
            href="/"
            className="bg-[#e74c3c] text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-[#d84333] transition"
          >
            Back to Start
          </Link>
        </div>
      </main>
    </div>
  );
}
