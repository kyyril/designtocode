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
  record: Record;
  regenerateCode: any;
  isReady: boolean;
}) {
  console.log(record);
  return (
    record && (
      <div className="p-5 bg-gray-50">
        <h2 className="font-bold mb-2">Your Design</h2>
        <Image
          src={record?.imageUrl}
          alt="Design"
          width={300}
          height={400}
          loading="lazy"
          className="rounded-md object-contain h-[200px] w-full border-dashed border bg-white p-2"
        />
        <h2 className="mt-5 font-bold mb-1">Generate By</h2>
        <input
          defaultValue={record.model}
          disabled={true}
          className="bg-white rounded-sm border"
        />
        <h2 className="mt-5 font-bold mb-1">Prompt</h2>
        <Textarea
          defaultValue={record.prompt}
          disabled={true}
          className="bg-white rounded-sm border h-[200px]"
        />

        <Button
          className="mt-5 w-full"
          onClick={regenerateCode}
          disabled={!isReady}
        >
          <RefreshCcwDot />
          Regenerate
        </Button>
      </div>
    )
  );
}

export default DetailSelected;
