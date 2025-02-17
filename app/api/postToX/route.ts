import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const { accessToken, imageUrl, caption } = await req.json();

  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const response = await axios.post(
      "https://api.twitter.com/2/tweets",
      { text: caption, media: { media_ids: [imageUrl] } },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ message: "Posted successfully", data: response.data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to post", details: error });
  }
}
