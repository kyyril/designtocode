"use client";
import AppHeader from "@/app/_components/AppHeader";
import Constanst from "@/app/data/Constanst";
import axios from "axios";
import { Loader2, Menu } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CodeEditor from "../_components/CodeEditor";
import DetailSelected from "../_components/DetailSelected";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export interface Record {
  id: number;
  imageUrl: string;
  model: string;
  prompt: string;
  createdBy: string;
  code: any;
  uid: string;
}

function ViewCodeId() {
  const [loading, setLoading] = useState(false);
  const [codeResponse, setCodeResponse] = useState("");
  const [record, setRecord] = useState<Record | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { uid } = useParams();

  useEffect(() => {
    if (uid) getRecordInfo();
  }, [uid]);

  const getRecordInfo = async () => {
    setCodeResponse("");
    setIsReady(false);
    setLoading(true);
    try {
      const res = await axios.get(`/api/design-to-code?uid=${uid}`);
      const result = res.data;
      setRecord(result);

      if (!result?.code) {
        generateCode(result);
      } else {
        setCodeResponse(result.code.res);
        setIsReady(true);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("No Record Found", error);
    }
    setLoading(false);
  };

  const generateCode = async (record: Record) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${record.prompt}:${Constanst.PROMPT}`,
          model: record.model,
          imageUrl: record.imageUrl,
        }),
      });
      if (!res.body) return;

      setLoading(false);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let newCode = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder
          .decode(value)
          .replace("```typescript", "")
          .replace("```", "");
        newCode += text;
        setCodeResponse((prev) => prev + text);
      }

      setIsReady(true);
      setIsSaved(false);
    } catch (error) {
      console.error("Error generating code", error);
    }
  };

  const saveCodeToDb = async () => {
    if (!record || !codeResponse) return;
    setLoading(true);
    try {
      await axios.put("/api/design-to-code", {
        uid: record.uid,
        codeRes: { res: codeResponse },
      });
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving code", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <AppHeader hideSidebar={true} />

      {/* Mobile Sidebar */}
      <div className="md:hidden p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Menu className="mr-2" /> Detail
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-4 overflow-y-auto">
            <DetailSelected
              record={record}
              regenerateCode={getRecordInfo}
              isReady={isReady && !isSaved}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar untuk Desktop */}
        <aside className="hidden md:block w-1/4 lg:w-1/5 bg-gray-50 p-4 overflow-y-auto">
          <DetailSelected
            record={record}
            regenerateCode={getRecordInfo}
            isReady={isReady && !isSaved}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-2xl">
              Analyzing Design..
              <Loader2 className="animate-spin ml-2" />
            </div>
          ) : (
            <div className="flex flex-col h-full p-4">
              <div className="flex-1 overflow-auto">
                <CodeEditor codeRes={codeResponse} isReady={isReady} />
              </div>
              <Button
                className="mt-4 sm:w-full lg:w-[200px]"
                onClick={saveCodeToDb}
                disabled={isSaved || !isReady}
              >
                Save Code
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ViewCodeId;
