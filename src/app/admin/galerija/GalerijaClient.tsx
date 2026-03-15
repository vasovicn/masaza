"use client";

import { useState } from "react";
import GalleryManager from "@/components/admin/GalleryManager";

interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
  sequence: number;
}

export default function GalerijaClient({ initialImages }: { initialImages: GalleryImage[] }) {
  const [images, setImages] = useState(initialImages);

  const handleRefresh = async () => {
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();
    setImages(data.images || []);
  };

  return <GalleryManager images={images} onRefresh={handleRefresh} />;
}
