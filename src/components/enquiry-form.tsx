"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { VESSEL_CATEGORIES } from "@/lib/vessel-categories";
import { ENQUIRY_TYPES, type EnquiryType } from "@/lib/labels";

type Props = {
  // "charter" adds vessel category, region, start date, duration and technical requirements.
  variant?: "general" | "charter";
  type?: EnquiryType; vesselId?: string; vesselName?: string; equipmentId?: string; subject?: string; defaultCategory?: string;
};
type FieldErrors = Partial<Record<string, string>>;

// Posts to /api/enquiries, which validates, stores the enquiry and only then attempts the notification email.
// Success is shown only after the server confirms the enquiry was stored.
export function EnquiryForm({ variant = "general", type, vesselId, vesselName, equipmentId, subject = "", defaultCategory = "" }: Props) {
  const charter = variant === "charter";
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [fields, setFields] = useState<FieldErrors>({});
  const [reference, setReference] = useState<string | null>(null);
  const [minDate, setMinDate] = useState<string>();
  const form = useRef<HTMLFormElement>(null);
  const status = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const d = new Date(); setMinDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)); }, []);
  useEffect(() => { if (state === "success") status.current?.focus(); }, [state]);

  async function submit(formData: FormData) {
    if (state === "sending") return;
    setState("sending"); setError(""); setFields({});
    const payload: Record<string, unknown> = Object.fromEntries(formData.entries());
    payload.type = charter ? "vessel_charter" : (payload.type || type || "general");
    payload.vesselId = vesselId || ""; payload.equipmentId = equipmentId || "";
    try {
      const r = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        const fieldErrors: FieldErrors = data.fields ?? {};
        setFields(fieldErrors);
        setError(data.error || "We could not submit your enquiry right now. Please try again later.");
        setState("error");
        const firstInvalid = Object.keys(fieldErrors)[0];
        requestAnimationFrame(() => { ((firstInvalid && form.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)) || alertRef.current)?.focus(); });
        return;
      }
      setReference(typeof data.referenceNumber === "string" ? data.referenceNumber : null);
      setState("success");
    } catch {
      setError("We could not reach the server. Check your connection and try again.");
      setState("error");
      requestAnimationFrame(() => alertRef.current?.focus());
    }
  }

  if (state === "success") return (
    <div ref={status} tabIndex={-1} role="status" className="rounded-md border border-marine/40 bg-marine-50 p-6 outline-none sm:p-8">
      <CheckCircle2 aria-hidden size={30} className="text-marine-700" />
      <h3 className="mt-4 font-display text-xl font-bold">Enquiry received</h3>
      <p className="mt-2 text-sm leading-6 text-ink">Thank you. Your {charter ? "charter request" : "enquiry"} has been received{reference && <> under reference <strong className="whitespace-nowrap font-semibold">{reference}</strong></>}. Our team will review your requirements and follow up using the contact details you provided.</p>
      {reference && <p className="mt-2 text-sm text-muted">Please quote this reference in any follow-up.</p>}
      <button type="button" onClick={() => { setState("idle"); setReference(null); }} className="btn btn-outline mt-6">Send another enquiry</button>
    </div>
  );

  const invalid = (name: string) => fields[name] ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` } : {};
  const fieldError = (name: string) => fields[name] ? <span id={`${name}-error`} className="field-error">{fields[name]}</span> : null;
  const sectionTitle = "text-[.72rem] font-bold uppercase tracking-[.16em] text-navy";

  return (
    <form ref={form} onSubmit={e => { e.preventDefault(); submit(new FormData(e.currentTarget)); }} aria-busy={state === "sending"} className="grid gap-6">
      {state === "error" && (
        <div ref={alertRef} tabIndex={-1} role="alert" className="flex gap-3 rounded-[4px] border border-[#f1c4bf] bg-[#fdf3f2] p-4 text-sm text-[#8a1c12] outline-none">
          <AlertTriangle aria-hidden size={18} className="mt-0.5 shrink-0" /><p>{error}</p>
        </div>
      )}
      <fieldset className="grid gap-4">
        <legend className={`${sectionTitle} float-left mb-2 w-full`}>Your details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="label">Full name *<input name="name" required minLength={2} maxLength={160} autoComplete="name" className="field" {...invalid("name")} />{fieldError("name")}</label>
          <label className="label">Company<input name="company" maxLength={180} autoComplete="organization" className="field" {...invalid("company")} />{fieldError("company")}</label>
          <label className="label">Business email *<input name="email" required type="email" maxLength={255} autoComplete="email" className="field" placeholder="you@company.com" {...invalid("email")} />{fieldError("email")}</label>
          <label className="label">Telephone<input name="phone" type="tel" maxLength={60} autoComplete="tel" className="field" {...invalid("phone")} />{fieldError("phone")}</label>
        </div>
      </fieldset>

      {charter ? (
        <>
          <fieldset className="grid gap-4 border-t border-line pt-6">
            <legend className={`${sectionTitle} float-left mb-2 w-full`}>Vessel requirement</legend>
            {subject && <input type="hidden" name="subject" value={subject} />}
            {vesselName && <p className="rounded-[4px] border border-line bg-mist px-4 py-3 text-sm"><span className="text-muted">Requested vessel: </span><strong className="font-semibold text-navy">{vesselName}</strong></p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="label">Vessel category<select name="vesselCategory" defaultValue={defaultCategory} className="field" {...invalid("vesselCategory")}><option value="">Not sure / multiple</option>{VESSEL_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>{fieldError("vesselCategory")}</label>
              <label className="label">Project or operating region<input name="operatingRegion" maxLength={200} className="field" placeholder="e.g. North Sea, Gulf of Guinea" {...invalid("operatingRegion")} />{fieldError("operatingRegion")}</label>
              <label className="label">Expected charter start<input name="charterStart" type="date" min={minDate} className="field" {...invalid("charterStart")} />{fieldError("charterStart")}</label>
              <label className="label">Expected charter duration<input name="charterDuration" maxLength={120} className="field" placeholder="e.g. 90 days + options" {...invalid("charterDuration")} />{fieldError("charterDuration")}</label>
            </div>
          </fieldset>
          <fieldset className="grid gap-4 border-t border-line pt-6">
            <legend className={`${sectionTitle} float-left mb-2 w-full`}>Project details</legend>
            <label className="label">Technical requirements<span className="label-hint">Key particulars, equipment, class or certification needs, if known.</span><textarea name="technicalRequirements" maxLength={4000} rows={4} className="field" {...invalid("technicalRequirements")} />{fieldError("technicalRequirements")}</label>
            <label className="label">Project details *<span className="label-hint">Scope of work, location and anything else that helps us understand the operation.</span><textarea name="message" required minLength={10} maxLength={8000} rows={5} className="field" {...invalid("message")} />{fieldError("message")}</label>
          </fieldset>
        </>
      ) : (
        <fieldset className="grid gap-4 border-t border-line pt-6">
          <legend className={`${sectionTitle} float-left mb-2 w-full`}>Your enquiry</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="label">Enquiry type<select name="type" defaultValue={type ?? "general"} className="field" {...invalid("type")}>{Object.entries(ENQUIRY_TYPES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>{fieldError("type")}</label>
            <label className="label">Subject<input name="subject" defaultValue={subject} maxLength={240} className="field" placeholder="How can we help?" {...invalid("subject")} />{fieldError("subject")}</label>
          </div>
          <label className="label">Message *<textarea name="message" required minLength={10} maxLength={8000} rows={6} className="field" placeholder="Tell us about your requirements" {...invalid("message")} />{fieldError("message")}</label>
        </fieldset>
      )}

      <div className="hidden" aria-hidden><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-5 text-muted">Fields marked * are required. Please do not include confidential or sensitive information in this form.</p>
        <button className="btn btn-primary shrink-0" disabled={state === "sending"}>
          {state === "sending" ? <><Loader2 aria-hidden size={16} className="animate-spin" /> Sending…</> : <>{charter ? "Submit charter request" : "Submit enquiry"} <ArrowRight aria-hidden size={16} /></>}
        </button>
      </div>
    </form>
  );
}
