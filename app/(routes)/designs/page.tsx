"use client";

import { useAuthContext } from "@/app/provider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Record } from "@/app/view-code/[uid]/page";
import { Code } from "lucide-react";
import Link from "next/link";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

function Designs() {
  const { user } = useAuthContext();
  const [designs, setDesigns] = useState<Record | any>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (user) getAllUserDesigns();
  }, [user]);

  const getAllUserDesigns = async () => {
    try {
      const result = await axios.get(
        `/api/design-to-code?email=${user?.email}`
      );
      setDesigns(result.data);
    } catch (error) {
      console.error("Error fetching designs:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedDesigns = [...designs].sort((a, b) => {
    return sortOrder === "asc"
      ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="p-5">
      <div className="fixed inset-0 -z-10">
        <BackgroundGradientAnimation />
      </div>
      <h2 className="text-xl font-bold mb-4">Your Designs</h2>
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          Sort by Time ({sortOrder === "asc" ? "Oldest" : "Newest"})
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full rounded-lg" />
            ))
          : sortedDesigns.map((design: Record) => (
              <Card
                key={design.id}
                className="rounded-md overflow-hidden bg-secondary/50 backdrop-blur-xl outline-none border-none"
              >
                <CardContent className="p-4">
                  <Image
                    src={design.imageUrl}
                    alt="Design Preview"
                    width={300}
                    height={200}
                    className="rounded-md w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <p className="mt-3 text-sm font-semibold">
                    {new Intl.DateTimeFormat("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    }).format(new Date(design.createdAt))}
                  </p>

                  <p className="mt-3 text-md font-semibold text-ellipsis line-clamp-1 overflow-hidden">
                    {design.prompt}
                  </p>
                  <p className="text-sm text-gray-500">Model: {design.model}</p>
                  <Link href={`/view-code/${design?.uid}`}>
                    <Button
                      variant={"outline"}
                      className="mt-3 w-full active:opacity-50"
                    >
                      <Code />
                      View Code
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}

export default Designs;
