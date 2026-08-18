export type SubmissionInput = {
  fullName: string;
  businessName: string;
  role: string;
  phone: string;
  email: string;
  businessType: string;
  location: string;
  tin: string;
};

export type FieldName = keyof SubmissionInput;

export const FIELD_LABELS: Record<FieldName, string> = {
  fullName: "Full name",
  businessName: "Business name",
  role: "Role / Title / Position",
  phone: "Phone number",
  email: "Email",
  businessType: "Business type",
  location: "Business location",
  tin: "RIN / TIN",
};

export const BUSINESS_TYPES = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Liability Company",
  "Non-Governmental Organisation",
  "Cooperative Society",
  "Public Sector",
  "Other",
] as const;

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<FieldName, string>>;
  values?: Partial<SubmissionInput>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts digits with optional +, spaces, dashes and parentheses.
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;

export function validate(values: SubmissionInput) {
  const errors: Partial<Record<FieldName, string>> = {};

  if (values.fullName.length < 2) {
    errors.fullName = "Enter the full name.";
  }
  if (values.businessName.length < 2) {
    errors.businessName = "Enter the business name.";
  }
  if (values.role.length < 2) {
    errors.role = "Enter the role or title.";
  }
  if (!PHONE_RE.test(values.phone)) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!EMAIL_RE.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.businessType) {
    errors.businessType = "Select a business type.";
  }
  if (values.location.length < 2) {
    errors.location = "Enter the business location.";
  }
  if (values.tin.length < 4) {
    errors.tin = "Enter a valid RIN/TIN.";
  }

  return errors;
}
