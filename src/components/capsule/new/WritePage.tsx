"use client";

import { useState } from "react";
import Left from "./left/Left";
import Right from "./right/Right";
import WriteHeader from "./WriteHeader";

export default function WritePage() {
  const [preview, setPreview] = useState({
    title: "",
    senderName: "",
    receiverName: "",
    content: "",
  });

  return (
    <>
      <div className="h-screen flex flex-col">
        <WriteHeader />

        <div className="flex flex-1 flex-col lg:flex-row overflow-hidden bg-sub">
          <div className="w-full lg:w-1/2 overflow-y-auto">
            <Left preview={preview} onPreviewChange={setPreview} />
          </div>
          <div className="w-1/2 hidden lg:flex border-l border-outline overflow-hidden min-h-0">
            <Right preview={preview} />
          </div>
        </div>
      </div>
    </>
  );
}
