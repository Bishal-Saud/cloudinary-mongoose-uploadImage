"use client";
import Image from "next/image";
import React, { useTransition } from "react";
function PhotoCard({ url, onClick }) {
  const [isPending, startTransition] = useTransition();
  return (
    <div>
      <h2>PhotoCard</h2>
      <Image src={url} alt="image" width={100} height={60} priority />
      <button
        type="button"
        onClick={() => startTransition(onClick)}
        disabled={isPending}
      >
        {isPending ? "Loading.." : "Delete"}
      </button>
    </div>
  );
}

export default PhotoCard;
