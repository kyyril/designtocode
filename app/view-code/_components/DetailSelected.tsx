import React from "react";
import { Record } from "../[uid]/page";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RefreshCcwDot } from "lucide-react";

function DetailSelected({
  record,
  regenerateCode,
  isReady,
}: {
  record: Record | null;
  regenerateCode: any;
  isReady: boolean;
}) {
  return (
    record && (
      <div className="p-5 h-full">
        <h2 className="font-bold text-lg mb-2">Your Design</h2>
        <Image
          src={record.imageUrl}
          alt="Design"
          width={300}
          height={400}
          loading="lazy"
          className="rounded-md object-contain h-[150px] w-full border-dashed border bg-secondary/50 p-2"
        />
        <h2 className="mt-5 font-bold mb-1">Generated By</h2>
        <input
          defaultValue={record.model}
          disabled
          className="bg-secondary/50 rounded-sm border w-full p-1"
        />
        <h2 className="mt-5 font-bold mb-1">Prompt</h2>
        <Textarea
          defaultValue={record.prompt}
          disabled
          className="bg-secondary/50 rounded-sm border h-[120px] w-full"
        />
        <Button
          className="mt-16 w-full"
          onClick={regenerateCode}
          disabled={!isReady}
        >
          <RefreshCcwDot className="mr-2" /> Regenerate
        </Button>
      </div>
    )
  );
}

export default DetailSelected;
