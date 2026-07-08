import Groq from "groq-sdk";
import { CRM_STATUS_VALUES, DATA_SOURCE_VALUES, CRMRecord } from "./schema.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a data mapping engine for a real estate CRM import tool.

You will receive an array of raw CSV rows as JSON objects. The column names are UNPREDICTABLE — they may come from Facebook Lead Ads exports, Google Ads exports, manual spreadsheets, or other CRMs. You must map each row's fields by MEANING, not by exact header name match.

Map every row into this exact CRM schema:
- created_at: lead creation date/time
- name: lead's full name
- email: primary email address (if multiple emails exist, use the first one and put the rest in crm_note)
- country_code: phone country code (e.g. +91)
- mobile_without_country_code: phone number WITHOUT the country code (if multiple numbers exist, use the first one and put the rest in crm_note)
- company: company name
- city, state, country: location fields
- lead_owner: person responsible for this lead
- crm_status: MUST be exactly one of: ${CRM_STATUS_VALUES.join(", ")}. If none match confidently, leave it as an empty string. Do NOT invent a new value.
- crm_note: any remarks, follow-up notes, extra emails/phones, or other info that doesn't fit elsewhere
- data_source: MUST be exactly one of: ${DATA_SOURCE_VALUES.join(", ")}. If none match confidently, leave it as an empty string. Do NOT invent a new value.
- possession_time: property possession timeframe, if present
- description: any additional description

Rules:
- If a row has neither an email nor a phone number, still include it in your output — downstream validation will handle skipping it, do not try to skip it yourself.
- created_at must be a string parseable by JavaScript's Date() constructor.
- Output ONLY a JSON object shaped like {"records": [...]}. No prose, no markdown code fences.
- Every field must be present in every object, using an empty string "" for anything not found.`;

export async function extractBatch(
  rawRows: Record<string, any>[]
): Promise<Partial<CRMRecord>[]> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    temperature: 0,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Map these rows into the CRM schema. Return as {"records": [...]}:\n\n${JSON.stringify(
          rawRows
        )}`,
      },
    ],
  });

  const content = response.choices[0].message.content;
  if (!content) return [];

  try {
    const parsed = JSON.parse(content);
    return parsed.records ?? [];
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", content);
    return [];
  }
}

export async function extractAll(
  rawRows: Record<string, any>[],
  batchSize = 15
): Promise<Partial<CRMRecord>[]> {
  const results: Partial<CRMRecord>[] = [];

  for (let i = 0; i < rawRows.length; i += batchSize) {
    const batch = rawRows.slice(i, i + batchSize);
    const batchResult = await extractBatch(batch);
    results.push(...batchResult);
  }

  return results;
}
