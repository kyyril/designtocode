import React from "react";
import ImageUpload from "./_components/ImageUpload";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

function Dashboard() {
  return (
    <div className="xl:px-20">
      <div className="fixed inset-0 -z-10">
        <BackgroundGradientAnimation />
      </div>
      <h2 className="text-3xl font-bold">Convert Design To Code</h2>
      <ImageUpload />
    </div>
  );
}

export default Dashboard;
