import { NextResponse } from "next/server";
// import multer from "multer";
import { writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

// const upload = multer({ dest: "uploads/" });

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  // Convert to Buffer
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const outputDir = "public/uploads";
  const fileName = `original-${Date.now()}.png`;
  const filePath = path.join(outputDir, fileName);

  await writeFile(filePath, fileBuffer);

  // Define target sizes
  const sizes = [
    { width: 300, height: 250 },
    { width: 728, height: 90 },
    { width: 160, height: 600 },
    { width: 300, height: 600 },
  ];

  // Resize Images
  const resizedImages = await Promise.all(
    sizes.map(async (size) => {
      const resizedFileName = `resized-${size.width}x${size.height}-${Date.now()}.png`;
      const resizedFilePath = path.join(outputDir, resizedFileName);

      await sharp(fileBuffer)
        .resize(size.width, size.height)
        .toFile(resizedFilePath);

      return `/uploads/${resizedFileName}`;
    })
  );

  return NextResponse.json({ message: "Image processed", images: resizedImages });
}
