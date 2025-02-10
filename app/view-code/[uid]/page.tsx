"use client";
import AppHeader from "@/app/_components/AppHeader";
import Constanst from "@/app/data/Constanst";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CodeEditor from "../_components/CodeEditor";
import DetailSelected from "../_components/DetailSelected";
import { Button } from "@/components/ui/button";

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
    <div>
      <AppHeader hideSidebar={true} />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
        <div>
          <DetailSelected
            record={record}
            regenerateCode={getRecordInfo}
            isReady={isReady && !isSaved}
          />
        </div>

        <div className="col-span-4">
          {loading ? (
            <h2 className="text-center h-full w-full text-2xl p-20 flex items-center justify-center">
              Analyzing Design..
              <Loader2 className="animate-spin" />
            </h2>
          ) : (
            <>
              <CodeEditor codeRes={codeResponse} isReady={isReady} />

              <Button onClick={saveCodeToDb} disabled={isSaved || !isReady}>
                Save Code
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewCodeId;
