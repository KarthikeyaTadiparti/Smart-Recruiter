import { InterviewQuestion } from "@/redux/reducers/job-reducer";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// --- helper: parse/normalize incoming questions ---
export const parseQuestions = (raw: any): InterviewQuestion[] => {
  // Already array
  if (Array.isArray(raw)) return raw;

  // Object with questions array or single question object
  if (raw && typeof raw === "object") {
    if (Array.isArray((raw as any).questions)) return (raw as any).questions;
    if ((raw as any).question) return [(raw as InterviewQuestion)];
  }

  // String - maybe with code fences
  if (typeof raw === "string") {
    let cleaned = raw.trim();

    // Remove code fences like ```json ... ``` or ```
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");

    // If extra text, extract the first {...} block
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.questions)) return parsed.questions;
      if (parsed && parsed.question) return [parsed];
    } catch (err) {
      // fallback: try to find an array in the text
      const arrMatch = cleaned.match(/\[.*\]/s);
      if (arrMatch) {
        try {
          const maybeArr = JSON.parse(arrMatch[0]);
          if (Array.isArray(maybeArr)) return maybeArr;
        } catch (err2) {
          console.warn("parseQuestions fallback failed", err2);
        }
      }
      console.warn("parseQuestions: JSON.parse failed", err);
    }
  }

  // Default safe fallback
  return [];
};
