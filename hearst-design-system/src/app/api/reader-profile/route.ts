import { getStore } from "@netlify/blobs";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

type SyncedReaderProfile = {
  id: string;
  syncId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  preferences: unknown;
  commentsByStoryId: unknown;
  collections: unknown;
};

const profileStoreName = "hearst-reader-profiles";
const localProfileDir = path.join(process.cwd(), ".next", "cache", "reader-profiles");

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function normalizeSyncId(value: unknown) {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value) ? value : "";
}

function sanitizeProfile(value: unknown, syncId: string): SyncedReaderProfile | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<SyncedReaderProfile>;
  if (
    typeof candidate.id !== "string"
    || typeof candidate.firstName !== "string"
    || typeof candidate.email !== "string"
    || typeof candidate.createdAt !== "string"
  ) {
    return null;
  }

  return {
    id: candidate.id,
    syncId,
    firstName: candidate.firstName,
    lastName: typeof candidate.lastName === "string" ? candidate.lastName : "",
    email: candidate.email,
    avatarUrl: typeof candidate.avatarUrl === "string" ? candidate.avatarUrl : undefined,
    createdAt: candidate.createdAt,
    preferences: candidate.preferences && typeof candidate.preferences === "object" ? candidate.preferences : {},
    commentsByStoryId: candidate.commentsByStoryId && typeof candidate.commentsByStoryId === "object" ? candidate.commentsByStoryId : {},
    collections: Array.isArray(candidate.collections) ? candidate.collections : [],
  };
}

async function readLocalProfile(syncId: string) {
  try {
    const value = await fs.readFile(path.join(localProfileDir, `${syncId}.json`), "utf8");
    return JSON.parse(value) as SyncedReaderProfile;
  } catch {
    return null;
  }
}

async function writeLocalProfile(syncId: string, profile: SyncedReaderProfile) {
  await fs.mkdir(localProfileDir, { recursive: true });
  await fs.writeFile(path.join(localProfileDir, `${syncId}.json`), JSON.stringify(profile), "utf8");
}

async function getSyncedProfile(syncId: string) {
  try {
    const store = getStore(profileStoreName);
    return await store.get(syncId, { type: "json" }) as SyncedReaderProfile | null;
  } catch {
    return readLocalProfile(syncId);
  }
}

async function setSyncedProfile(syncId: string, profile: SyncedReaderProfile) {
  try {
    const store = getStore(profileStoreName);
    await store.setJSON(syncId, profile);
  } catch {
    await writeLocalProfile(syncId, profile);
  }
}

export async function GET(request: NextRequest) {
  const syncId = normalizeSyncId(request.nextUrl.searchParams.get("syncId"));
  if (!syncId) return jsonError("A valid profile sync id is required.", 400);

  const profile = await getSyncedProfile(syncId);
  return NextResponse.json({ profile }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: NextRequest) {
  let body: { syncId?: unknown; profile?: unknown };
  try {
    body = await request.json() as { syncId?: unknown; profile?: unknown };
  } catch {
    return jsonError("A profile payload is required.", 400);
  }

  const syncId = normalizeSyncId(body.syncId);
  if (!syncId) return jsonError("A valid profile sync id is required.", 400);

  const profile = sanitizeProfile(body.profile, syncId);
  if (!profile) return jsonError("A valid reader profile is required.", 400);

  await setSyncedProfile(syncId, profile);
  return NextResponse.json({ profile }, { headers: { "Cache-Control": "no-store" } });
}
