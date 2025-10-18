import { cuid } from "./cuid";
import { getServerSupabase } from "./supabaseClient";

/**
 * Translations Manager
 * Centralized system for managing translations with CUID
 */

export interface Translation {
  id: string;
  locale: "ar" | "en";
  namespace: string;
  key: string;
  value: string;
  created_at?: string;
  updated_at?: string;

export interface TranslationInput {
  locale: "ar" | "en";
  namespace: string;
  key: string;
  value: string;

/**
 * Add a single translation to the database
 */
export async function addTranslation(
  translation: TranslationInput,
): Promise<Translation> {
  const supabase = await getServerSupabase();
  const id = cuid.translation();

  const { data, error } = await supabase
    .from("translations")
    .insert({
      id,
      locale: translation.locale,
      namespace: translation.namespace,
      key: translation.key,
      value: translation.value,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add translation: ${error.message}`);

  return data;

/**
 * Add multiple translations at once
 */
export async function addMultipleTranslations(
  translations: TranslationInput[],
): Promise<Translation[]> {
  const supabase = await getServerSupabase();

  const translationsWithIds = translations.map((translation) => ({
    id: cuid.translation(),
    locale: translation.locale,
    namespace: translation.namespace,
    key: translation.key,
    value: translation.value,
  }));

  const { data, error } = await supabase
    .from("translations")
    .insert(translationsWithIds)
    .select();

  if (error) {
    throw new Error(`Failed to add translations: ${error.message}`);

  return data;

/**
 * Get translations by locale and namespace
 */
export async function getTranslations(
  locale: "ar" | "en",
  namespace: string = "common",
): Promise<Record<string, string>> {
  const supabase = await getServerSupabase();

  const { data, error } = await supabase
    .from("translations")
    .select("key, value")
    .eq("locale", locale)
    .eq("namespace", namespace);

  if (error) {
    throw new Error(`Failed to get translations: ${error.message}`);

  const result: Record<string, string> = {};
  data?.forEach((item: { key: string; value: string }) => {
    result[item.key] = item.value;
  });

  return result;

/**
 * Update a translation
 */
export async function updateTranslation(
  id: string,
  value: string,
): Promise<Translation> {
  const supabase = await getServerSupabase();

  const { data, error } = await supabase
    .from("translations")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update translation: ${error.message}`);

  return data;

/**
 * Delete a translation
 */
export async function deleteTranslation(id: string): Promise<void> {
  const supabase = await getServerSupabase();

  const { error } = await supabase.from("translations").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete translation: ${error.message}`);
  }

/**
 * Bulk insert translations with CUID
 */
export async function bulkInsertTranslations(
  translations: TranslationInput[],
): Promise<void> {
  const supabase = await getServerSupabase();

  const translationsWithIds = translations.map((translation) => ({
    id: cuid.translation(),
    locale: translation.locale,
    namespace: translation.namespace,
    key: translation.key,
    value: translation.value,
  }));

  const { error } = await supabase
    .from("translations")
    .upsert(translationsWithIds, { onConflict: "locale,namespace,key" });

  if (error) {
    throw new Error(`Failed to bulk insert translations: ${error.message}`);
  }

/**
 * Get all translations for a locale
 */
export async function getAllTranslationsForLocale(
  locale: "ar" | "en",
): Promise<Translation[]> {
  const supabase = await getServerSupabase();

  const { data, error } = await supabase
    .from("translations")
    .select("*")
    .eq("locale", locale)
    .order("namespace", { ascending: true })
    .order("key", { ascending: true });

  if (error) {
    throw new Error(`Failed to get translations: ${error.message}`);

  return data || [];

/**
 * Search translations
 */
export async function searchTranslations(
  query: string,
  locale?: "ar" | "en",
): Promise<Translation[]> {
  const supabase = await getServerSupabase();

  let queryBuilder = supabase
    .from("translations")
    .select("*")
    .or(`key.ilike.%${query}%,value.ilike.%${query}%`);

  if (locale) {
    queryBuilder = queryBuilder.eq("locale", locale);

  const { data, error } = await queryBuilder;

  if (error) {
    throw new Error(`Failed to search translations: ${error.message}`);

  return data || [];

export default {
  addTranslation,
  addMultipleTranslations,
  getTranslations,
  updateTranslation,
  deleteTranslation,
  bulkInsertTranslations,
  getAllTranslationsForLocale,
  searchTranslations,
};
}}}}}}}}}}}}}}}}}
