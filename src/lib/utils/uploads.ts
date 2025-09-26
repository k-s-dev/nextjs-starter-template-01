"use server";

import path from "node:path";
import { access, mkdir, writeFile } from "node:fs/promises";

export async function saveFileUpload({
  uploadFile,
  uploadDir,
  fileNameWoExt,
  fileExt,
  uploadRootDir = "public/",
}: {
  uploadFile: File;
  uploadDir: string;
  fileNameWoExt?: string;
  fileExt?: string;
  uploadRootDir?: string;
}) {
  fileExt = fileExt ? fileExt : uploadFile.name.split(".")[1].toLowerCase();
  const fileName = fileNameWoExt
    ? `${fileNameWoExt}.${fileExt}`
    : uploadFile.name;

  const uploadPath = path.join(".", "/", uploadRootDir, uploadDir);
  const uploadFilePath = path.join(uploadPath, fileName);

  try {
    await access(uploadPath);
  } catch {
    await mkdir(uploadPath, { recursive: true });
  }

  const arrayBuffer = await uploadFile.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  await writeFile(uploadFilePath, buffer);

  const uploadUrl = path.join("/", uploadDir, fileName);

  return uploadUrl;
}
