import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import { getSession } from "@/services/auth/session";
import { Buffer } from "buffer";
import nestApi from "@/services/apis/nest/nest";

async function getImageUrl(spotId: number): Promise<string> {
  const token = (await getSession()) || "";
  try {
    const res = await nestApi.get(`/spots/${spotId}/image`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "arraybuffer",
    });
    
    const buffer = Buffer.from(res.data);
    const base64 = buffer.toString("base64");
    return `data:image/jpeg;base64,${base64}`;
  } catch {
    throw new Error("Erro ao carregar imagem");
  }
}

export default function ImageLoader({ spotId }: { spotId: number }) {
  const [uri, setUri] = useState<string | null>(null);
  
  useEffect(() => {
    getImageUrl(spotId).then(setUri).catch(console.error);
  }, [spotId]);
  
  if (!uri) return null;
  
  return <Image source={{ uri }} style={{ width: 80, height: 80, marginRight: 12, borderRadius: 8 }} />;
}