"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, Loader2, Paintbrush, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useAuthContext } from "@/app/provider";
import { useRouter } from "next/navigation";
import Constanst from "@/app/data/Constanst";
import { Card } from "@/components/ui/card";

function ImageUpload() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [model, setModel] = useState<string>();
  const [prompt, setPrompt] = useState<string>();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const onImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const selectedFile = files[0];

      // Validasi file harus berupa gambar
      if (!selectedFile.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }

      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setFile(selectedFile);
    }
  };

  const onGenerateToCodeButton = async () => {
    if (!file) {
      alert("Please select an image before uploading.");
      return;
    }
    setLoading(true);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDIMAGE;
      if (!cloudName) {
        throw new Error(
          "Cloudinary cloud name is missing in environment variables."
        );
      }

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "designtocode");
      data.append("cloud_name", cloudName);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: data }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image.");
      }

      const result = await response.json();
      const imageUrl = result.secure_url;
      console.log("Upload successful:", imageUrl);

      // Kirim data ke server
      const uid = uuidv4();
      const post = await axios.post("/api/design-to-code", {
        uid: uid,
        imageUrl: imageUrl,
        model: model,
        prompt: prompt,
        email: user?.email,
      });
      console.log("Post response:", post.data);
      setLoading(false);
      router.push(`/view-code/${uid}`);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Image upload failed. Please try again.");
    }
  };
  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {!previewUrl ? (
          <Card className="rounded-md p-7 shadow-md flex justify-center items-center flex-col">
            <CloudUpload className="h-10 w-10" />
            <h2 className="text-lg font-bold">Upload Image</h2>
            <p className="text-gray-400 p-4">Click Button To Select Image</p>
            <div className="p-4 w-full mt-4 border rounded-md flex justify-center">
              <label htmlFor="imageUpload" className="cursor-pointer">
                <h2 className="text-sm text-primary-foreground bg-primary rounded-md shadow-sm p-2 hover:opacity-90">
                  Select Image
                </h2>
              </label>
            </div>
            <input
              type="file"
              id="imageUpload"
              className="hidden"
              accept="image/*"
              multiple={false}
              onChange={onImageSelect}
            />
          </Card>
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
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
                setFile(null);
              }}
            />
          </div>
        )}
        <div className="rounded-md p-7 shadow-md">
          <h2 className="font-bold text-lg">Select AI Model</h2>
          <Select onValueChange={setModel}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {Constanst?.AiModelList.map((model, index) => (
                <SelectItem key={index} value={model.name}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <h2 className="text-lg font-bold mt-4">Add Prompt</h2>
          <Textarea
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write Prompt for your design here.."
            className="mt-2 h-[100px]"
          />
        </div>
      </div>
      <div className="mt-10 flex justify-center items-center">
        <Button
          variant={"secondary"}
          onClick={onGenerateToCodeButton}
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <span className="flex flex-row gap-1">
              Generate <Paintbrush />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;
