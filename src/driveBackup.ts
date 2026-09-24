declare global { interface Window { google?: any; } }
import { getAllData } from "./storage";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata";

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve();
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Impossibile caricare Google Identity Services."));
    document.head.appendChild(script);
  });
}

async function getAccessToken(): Promise<string> {
  if (!CLIENT_ID) throw new Error("Backup Drive non configurato: manca VITE_GOOGLE_CLIENT_ID.");
  await loadScript();
  return new Promise<string>((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: DRIVE_SCOPE,
      callback: (response: { access_token?: string; error?: string }) =>
        response.access_token ? resolve(response.access_token) : reject(new Error(response.error ?? "Autorizzazione Drive annullata."))
    });
    client.requestAccessToken({ prompt: "" });
  });
}

async function findBackup(token: string): Promise<string | undefined> {
  const response = await fetch("https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name%3D%27peepoomaps-backup.json%27&fields=files(id)", {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Impossibile cercare il backup su Drive.");
  const files = (await response.json()).files as Array<{ id: string }>;
  return files[0]?.id;
}

export async function backupToDrive(): Promise<void> {
  const token = await getAccessToken();
  const body = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), ...(await getAllData()) });
  const fileId = await findBackup(token);
  const metadata = { name: "peepoomaps-backup.json", parents: ["appDataFolder"], mimeType: "application/json" };
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", new Blob([body], { type: "application/json" }));
  const endpoint = fileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
    : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
  const response = await fetch(endpoint, {
    method: fileId ? "PATCH" : "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });
  if (!response.ok) throw new Error("Backup Drive non riuscito.");
}

export async function importFromDrive(): Promise<Blob> {
  const token = await getAccessToken();
  const fileId = await findBackup(token);
  if (!fileId) throw new Error("Nessun backup PeePooMaps trovato su Google Drive.");
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Impossibile scaricare il backup da Google Drive.");
  return response.blob();
}
