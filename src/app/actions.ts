"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  validate,
  type FormState,
  type SubmissionInput,
} from "@/lib/submission";

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createSubmission(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const values: SubmissionInput = {
    fullName: readString(formData, "fullName"),
    businessName: readString(formData, "businessName"),
    role: readString(formData, "role"),
    phone: readString(formData, "phone"),
    email: readString(formData, "email"),
    businessType: readString(formData, "businessType"),
    location: readString(formData, "location"),
    tin: readString(formData, "tin"),
  };

  const errors = validate(values);
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      errors,
      values,
    };
  }

  try {
    await prisma.submission.create({
      data: { ...values, email: values.email.toLowerCase() },
    });
  } catch (error) {
    console.error("[createSubmission] failed to save:", error);
    return {
      status: "error",
      message: "Could not save the submission. Please try again.",
      values,
    };
  }

  // Keep the records page in sync with the new row.
  revalidatePath("/records");

  return {
    status: "success",
    message: "Submission received. Thank you.",
  };
}
