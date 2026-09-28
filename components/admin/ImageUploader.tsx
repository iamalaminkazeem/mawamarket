"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";

export default function ImageUploader({
  onUploaded,
  label = "Upload Image",
}: {
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const authRes = await fetch("/api/upload-auth");
      if (!authRes.ok) throw new Error("Could not get upload authorization");
      const { token, signature, expire, publicKey, urlEndpoint } = await authRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("folder", "/mawa-market");
      formData.append("token", token);
      formData.append("signature", signature);
      formData.append("expire", String(expire));
      formData.append("publicKey", publicKey);

      const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });
      const data = await uploadRes.json();
      if (data.url) {
        onUploaded(data.url);
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch {
      alert("Upload failed. Check your ImageKit environment variables are set correctly.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="btn-secondary !py-2 !px-4 text-sm"
      >
        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        {uploading ? "Uploading..." : label}
      </button>
    </div>
  );
}
