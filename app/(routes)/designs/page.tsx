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

function Designs() {
  const { user } = useAuthContext();
  const [designs, setDesigns] = useState<Record | any>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Your Designs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full rounded-lg" />
            ))
          : designs.map((design: Record) => (
              <Card
                key={design.id}
                className="shadow-lg rounded-lg overflow-hidden"
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
                  <p className="mt-3 text-md font-semibold text-ellipsis line-clamp-1 overflow-hidden">
                    {design.prompt}
                  </p>
                  <p className="text-sm text-gray-500">Model: {design.model}</p>
                  <Link href={`/view-code/${design?.uid}`}>
                    <Button className="mt-3 w-full active:opacity-50">
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
