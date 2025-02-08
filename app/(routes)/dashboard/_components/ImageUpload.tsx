"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, CloudUpload, Paintbrush, UploadIcon, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

function ImageUpload() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
    }
  };
  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {!previewUrl ? (
          <div className="rounded-md p-7 shadow-md flex justify-center items-center flex-col">
            <CloudUpload className="h-10 w-10" />
            <h2 className="text-lg font-bold">Upload Image</h2>
            <p className="text-gray-400 p-4">Click Button To Select Image</p>
            <div className="p-4 w-full mt-4 border rounded-md flex justify-center">
              <label htmlFor="imageUpload">
                <h2 className="text-sm text-secondary bg-primary rounded-md shadow-sm p-2 hover:opacity-90 cursor-pointer">
                  Select Image
                </h2>
              </label>
            </div>

            <input
              type="file"
              id="imageUpload"
              className="hidden"
              multiple={false}
              onChange={onImageSelect}
            />
          </div>
        ) : (
          <div className="p-5 border flex justify-center items-center flex-col rounded-md shadow-md">
            <Image
              width={500}
              height={500}
              src={previewUrl}
              alt="previewImg"
              className="object-contain w-full h-[300px]"
            />
            <X
              className="cursor-pointer mt-2 h-10 w-10 border rounded-sm text-red-600 hover:text-red-300"
              onClick={() => {
                setPreviewUrl(null);
              }}
            />
          </div>
        )}
        <div className="rounded-md p-7 shadow-md flex justify-center items-center flex-col">
          <h2 className="text-lg font-bold">Add Prompt</h2>
          <Textarea
            placeholder="Write Prompt for your design here.."
            className="mt-3 h-[200px]"
          />
        </div>
      </div>
      <div className="mt-10 flex justify-center items-center">
        <Button size="lg">
          Generate <Paintbrush />
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;
