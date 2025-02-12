"use client";

import Authentication from "./_components/Authentication";
import ProfileAvatar from "./_components/ProfileAvatar";
import { useAuthContext } from "./provider";
import Link from "next/link";
import { memo } from "react";
import Footer from "@/components/Footer";
import {
  CircleDollarSign,
  Code,
  Code2,
  LibraryBig,
  LucideIcon,
  MessageCircleCode,
  PaintBucket,
} from "lucide-react";

const features: Array<{
  Icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    Icon: MessageCircleCode,
    title: "AI-Powered Conversion",
    description:
      "Automatically generate React components from your design files.",
  },
  {
    Icon: PaintBucket,
    title: "Customizable Output",
    description:
      "Fine-tune generated code to match your development standards.",
  },
  {
    Icon: CircleDollarSign,
    title: "Free to Use",
    description: "Use it anytime, anywhere for free.",
  },
  {
    Icon: LibraryBig,
    title: "Modern Library",
    description: "Export code directly into your Next.js or React projects.",
  },
];

// Update the FeatureCard component
const FeatureCard = memo(
  ({
    title,
    description,
    Icon,
  }: {
    title: string;
    description: string;
    Icon: LucideIcon;
  }) => (
    <div className="group flex flex-col justify-center hover:bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-7 transition-all duration-300 border border-white/10">
      <Icon className="w-8 h-8 text-gray-300 group-hover:text-white transition-colors" />
      <h3 className="mt-4 group-hover:text-white text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-600 to-purple-900 transition-colors">
        {title}
      </h3>
      <p className="mt-1 text-gray-300/80">{description}</p>
    </div>
  )
);

export default function Home() {
  const user = useAuthContext();

  return (
    <div className="min-h-screen w-full overflow-hidden flex flex-col relative">
      {/* Header */}
      <header className="backdrop-blur-xl bg-black/20 p-3 fixed top-0 left-0 right-0 flex justify-between items-center w-full z-50">
        <a
          className="text-2xl font-bold font-sans text-white flex flex-row"
          href="#"
          aria-label="Brand"
        >
          <span className="hover:text-white transition-colors bg-gradient-to-r from-purple-800 via-purple-600 to-white bg-clip-text text-transparent ">
            DesignTo
          </span>
          Code
          <Code2 className="mt-2 ml-1" />
        </a>
        <div>
          {!user?.user?.email ? (
            <Authentication>
              <button className="text-gray-500 hover:text-white text-sm transition underline h-[40px]">
                Sign Up
              </button>
            </Authentication>
          ) : (
            <ProfileAvatar />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center text-center px-6 pt-40 pb-20 h-screen mt-24">
        <h1 className="text-5xl pb-4 md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
          Transform Your Designs
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-600 to-purple-900">
            {" "}
            into Code
          </span>
        </h1>
        <p className="text-lg text-gray-300/90 max-w-xl">
          Convert Figma, Adobe XD, and Sketch designs into clean React code
          effortlessly.
        </p>
        <div className="mt-8">
          {!user?.user?.email ? (
            <Authentication>
              <button className="px-4 font-bold font-sans py-3 text-white bg-primary/50 backdrop-blur-sm hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 rounded-full">
                Get Started
              </button>
            </Authentication>
          ) : (
            <Link
              href={"/dashboard"}
              className="px-4 font-bold font-sans py-3 text-white bg-primary/50 backdrop-blur-sm hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 rounded-full"
            >
              Go To Workspace
            </Link>
          )}
        </div>
      </main>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 py-10 max-w-7xl mx-auto">
        {features.map((item, index) => (
          <FeatureCard
            key={index}
            title={item.title}
            description={item.description}
            Icon={item.Icon}
          />
        ))}
      </section>

      <section className="mt-60">
        <Footer />
      </section>
    </div>
  );
}
