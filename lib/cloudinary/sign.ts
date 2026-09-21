"use server";

import crypto from "node:crypto";
import { isAdminAuthenticated } from "@/lib/admin/auth";

// Generates a short-lived, signed upload authorization for Cloudinary.
// Signed (not "unsigned preset") uploads mean only requests carrying a valid
// signature from THIS server can upload to the account — the API secret
// never leaves the server, only its derived signature does.
export async function getCloudinarySignature(folder: string) {
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("Not authorized.");

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET."
    );
  }

  const timestamp = Math.round(Date.now() / 1000);

  // Cloudinary requires every param that will be sent in the upload (other
  // than file/api_key/signature) to be included here, sorted alphabetically,
  // then hashed with the secret appended.
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

  return { cloudName, apiKey, timestamp, signature, folder };
}

// Public counterpart for the /submit form — visitors aren't logged in as
// admin, so this has no auth gate. To limit abuse (anyone could call this
// repeatedly from dev tools without ever submitting the real form), the
// destination folder is fixed server-side rather than accepted from the
// client, so at minimum any junk uploads land in one place, not scattered
// across the whole account.
export async function getPublicSubmissionUploadSignature() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET."
    );
  }

  const folder = "polenconnect/submissions/pending";
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

  return { cloudName, apiKey, timestamp, signature, folder };
}
