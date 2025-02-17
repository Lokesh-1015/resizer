"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return alert("No file selected");

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setImageUrls(data.images);
  };

  const postToX = async (imageUrl: string) => {
    if (!session) {
      signIn("twitter");
      return;
    }

    const response = await fetch("/api/postToX", {
      method: "POST",
      body: JSON.stringify({
        // accessToken: session.accessToken,
        imageUrl,
        caption: "Resized Image from my Next.js app!",
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) alert("Posted to Twitter!");
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Image Resizer & Twitter Poster</h1>

      {!session ? (
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => signIn("twitter")}>
          Sign in with Twitter
        </button>
      ) : (
        <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={() => signOut()}>
          Sign Out
        </button>
      )}

      <input type="file" accept="image/*" onChange={handleFileChange} className="mt-4" />
      <button onClick={uploadImage} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
        Upload & Resize
      </button>

      <div className="mt-6">
        {imageUrls.map((url, index) => (
          <div key={index}>
            <Image src={url} width={1000} height={1000} alt="Resized" className="w-40 mt-4" />
            <button onClick={() => postToX(url)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
              Post to X
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
