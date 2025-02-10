"use client";
import AppHeader from "@/app/_components/AppHeader";
import Constanst from "@/app/data/Constanst";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CodeEditor from "../_components/CodeEditor";
import DetailSelected from "../_components/DetailSelected";

export interface Record {
  id: number;
  imageUrl: string;
  model: string;
  prompt: string;
  createdBy: string;
  code: any;
}

function viewCodeId() {
  const [loading, setLoading] = useState(false);
  const [codeResponse, setCodeResponese] = useState("");
  const [record, setRecord] = useState<Record | any>();
  const { uid } = useParams();

  useEffect(() => {
    uid && getRecordInfo();
  }, [uid]);
  const getRecordInfo = async () => {
    setLoading(true);
    const res = await axios.get("/api/design-to-code?uid=" + uid);

    const result = res.data;
    setRecord(res.data);
    //if code = null, generate code
    if (result?.code == null) {
      // generateCode(result);
    }
    if (result?.error) {
      console.error("No Record Found", result.error);
    }
    setLoading(false);
  };

  const generateCode = async (record: Record) => {
    setLoading(true);
    // Generate code here
    const res = await fetch("/api/ai-model", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: record.prompt + ":" + Constanst.PROMPT,
        model: record.model,
        imageUrl: record.imageUrl,
      }),
    });
    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder
        .decode(value)
        .replace("```typescript", "")
        .replace("```", "");
      setCodeResponese((prev) => prev + text);
      console.log(text);
    }
    setLoading(false);
  };
  return (
    <div>
      <AppHeader hideSidebar={true} />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
        <div>
          {/* selected detail */}
          <DetailSelected record={record} />
        </div>

        <div className="col-span-4">
          {/* code editor */}
          <CodeEditor />
        </div>
      </div>
    </div>
  );
}

export default viewCodeId;
