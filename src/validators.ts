import { CRM_STATUS_VALUES, DATA_SOURCE_VALUES, CRMRecord } from "./schema.js";

export function validateRecord(
  record: Partial<CRMRecord>
): { record: CRMRecord | null; skip: boolean; reason?: string } {
  const r = { ...record };

  const hasEmail = !!(r.email && r.email.trim().length > 0);
  const hasMobile = !!(
    r.mobile_without_country_code && r.mobile_without_country_code.trim().length > 0
  );

  if (!hasEmail && !hasMobile) {
    return { record: null, skip: true, reason: "no email or mobile" };
  }

  if (r.crm_status && !CRM_STATUS_VALUES.includes(r.crm_status as any)) {
    r.crm_status = "";
  }

  if (r.data_source && !DATA_SOURCE_VALUES.includes(r.data_source as any)) {
    r.data_source = "";
  }

  if (r.created_at && isNaN(Date.parse(r.created_at))) {
    r.created_at = "";
  }

  const complete: CRMRecord = {
    created_at: r.created_at ?? "",
    name: r.name ?? "",
    email: r.email ?? "",
    country_code: r.country_code ?? "",
    mobile_without_country_code: r.mobile_without_country_code ?? "",
    company: r.company ?? "",
    city: r.city ?? "",
    state: r.state ?? "",
    country: r.country ?? "",
    lead_owner: r.lead_owner ?? "",
    crm_status: r.crm_status ?? "",
    crm_note: r.crm_note ?? "",
    data_source: r.data_source ?? "",
    possession_time: r.possession_time ?? "",
    description: r.description ?? "",
  };

  return { record: complete, skip: false };
}

export function validateBatch(records: Partial<CRMRecord>[]) {
  const imported: CRMRecord[] = [];
  const skipped: { original: Record<string, any>; reason: string }[] = [];

  for (const rec of records) {
    const { record, skip, reason } = validateRecord(rec);
    if (skip) {
      skipped.push({ original: rec, reason: reason ?? "unknown" });
    } else if (record) {
      imported.push(record);
    }
  }

  return {
    imported,
    skipped,
    totalImported: imported.length,
    totalSkipped: skipped.length,
  };
}
