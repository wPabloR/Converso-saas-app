"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseAnonClient, createSupabaseClient } from "../supabase";

const companionFromSessionRow = (raw: unknown): Companion | null => {
  if (!raw || typeof raw !== "object") return null;
  const row = (Array.isArray(raw) ? raw[0] : raw) as Companion;
  return row?.id ? row : null;
};

export const createCompanion = async (formData: CreateCompanion) => {
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("companions")
    .insert({ ...formData, author })
    .select();

  if (error || !data)
    throw new Error(error?.message || "Failed to create a companion");

  return data[0];
};

export const getAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  const supabase = createSupabaseAnonClient();

  let query = supabase.from("companions").select();

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: companions, error } = await query;

  if (error) throw new Error(error.message);

  return companions ?? [];
};

export const getCompanion = async (id: string) => {
  const supabase = createSupabaseAnonClient();

  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

export const addToSessionHistory = async (companionId: string) => {
  const { userId } = await auth();
  if (!userId) return;

  const supabase = createSupabaseClient();

  const { error } = await supabase.from("session_history").insert({
    companion_id: companionId,
    user_id: userId,
  });

  if (error) throw new Error(error.message);
};

export const getRecentSessions = async (limit = 10) => {
  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase
    .from("session_history")
    .select("companions:companion_id (*)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? [])
    .map((row) => companionFromSessionRow(row.companions))
    .filter((companion): companion is Companion => companion != null);
};

export const getUserSessions = async (userId: string, limit = 10) => {
  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase
    .from("session_history")
    .select("companions:companion_id (*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? [])
    .map((row) => companionFromSessionRow(row.companions))
    .filter((companion): companion is Companion => companion != null);
};
