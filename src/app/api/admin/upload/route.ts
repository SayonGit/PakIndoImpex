import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { saveUploadedFile, UPLOAD_CATEGORIES, UploadError, type UploadCategory } from "@/lib/uploads";

export async function POST(request: Request) {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  const category = formData.get("category");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (typeof category !== "string" || !UPLOAD_CATEGORIES.includes(category as UploadCategory)) {
    return NextResponse.json({ error: "Invalid upload category." }, { status: 400 });
  }

  try {
    const url = await saveUploadedFile(file, category as UploadCategory);
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof UploadError ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
