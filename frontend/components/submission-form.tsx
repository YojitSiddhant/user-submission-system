"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { api } from "@/lib/api";
import type { ApiResponse, SubmissionFormValues, SubmissionRecord } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/form-field";

type FieldErrors = Partial<Record<keyof SubmissionFormValues | "attachment", string>>;

const initialValues: SubmissionFormValues = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
};

export function SubmissionForm() {
  const [values, setValues] = useState<SubmissionFormValues>(initialValues);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof SubmissionFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validateForm() {
    const nextErrors: FieldErrors = {};
    const name = values.fullName.trim();
    const email = values.email.trim();
    const phone = values.phone.trim();
    const city = values.city.trim();

    if (!name) nextErrors.fullName = "Full name is required.";
    else if (name.length < 2) nextErrors.fullName = "Full name must be at least 2 characters.";

    if (!email) nextErrors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email address.";

    if (!phone) nextErrors.phone = "Phone number is required.";
    else if (!/^[0-9+\-()\s]{7,20}$/.test(phone)) nextErrors.phone = "Enter a valid phone number.";

    if (!city) nextErrors.city = "City is required.";
    else if (city.length < 2) nextErrors.city = "City must be at least 2 characters.";

    if (!attachment) {
      nextErrors.attachment = "Attachment is required.";
    } else {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(attachment.type)) {
        nextErrors.attachment = "Only PDF, JPG, and PNG files are allowed.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setMessageType(null);

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("fullName", values.fullName.trim());
    formData.append("email", values.email.trim().toLowerCase());
    formData.append("phone", values.phone.trim());
    formData.append("city", values.city.trim());

    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      setIsSubmitting(true);

      const response = await api.post<ApiResponse<SubmissionRecord>>("/submissions", formData);

      setValues(initialValues);
      setAttachment(null);
      setMessage(response.data.message || "Submission created successfully.");
      setMessageType("success");
      setErrors({});
    } catch (error) {
      const axiosError = error as {
        response?: {
          data?: {
            message?: string;
            errors?: FieldErrors;
          };
        };
      };

      const apiErrors = axiosError.response?.data?.errors;
      if (apiErrors) {
        setErrors(apiErrors);
      }

      setMessage(axiosError.response?.data?.message || "Something went wrong while submitting the form.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-[520px] p-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-lg font-semibold text-slate-900">User Registration Form</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <FormField
          label="Full Name"
          required
          error={errors.fullName}
          inputProps={{
            id: "fullName",
            name: "fullName",
            type: "text",
            placeholder: "Jane Doe",
            value: values.fullName,
            onChange: (event: ChangeEvent<HTMLInputElement>) => updateField("fullName", event.target.value),
            autoComplete: "name",
          }}
        />

        <FormField
          label="Email Address"
          required
          error={errors.email}
          inputProps={{
            id: "email",
            name: "email",
            type: "email",
            placeholder: "jane@example.com",
            value: values.email,
            onChange: (event: ChangeEvent<HTMLInputElement>) => updateField("email", event.target.value),
            autoComplete: "email",
          }}
        />

        <FormField
          label="Phone Number"
          required
          error={errors.phone}
          inputProps={{
            id: "phone",
            name: "phone",
            type: "tel",
            placeholder: "+91 98765 43210",
            value: values.phone,
            onChange: (event: ChangeEvent<HTMLInputElement>) => updateField("phone", event.target.value),
            autoComplete: "tel",
          }}
        />

        <FormField
          label="City"
          required
          error={errors.city}
          inputProps={{
            id: "city",
            name: "city",
            type: "text",
            placeholder: "Bengaluru",
            value: values.city,
            onChange: (event: ChangeEvent<HTMLInputElement>) => updateField("city", event.target.value),
            autoComplete: "address-level2",
          }}
        />

        <div>
          <label htmlFor="attachment" className="mb-2 block text-sm font-medium text-slate-700">
            Upload Attachment *
          </label>
          <input
            id="attachment"
            name="attachment"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(event) => {
              const nextFile = event.target.files?.[0] ?? null;
              setAttachment(nextFile);
              setErrors((current) => ({ ...current, attachment: undefined }));
            }}
            className="block h-11 w-full cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white px-0 text-sm leading-10 text-slate-700 file:mr-4 file:h-11 file:border-0 file:bg-slate-100 file:px-3 file:text-sm file:font-medium file:text-slate-700 file:leading-10"
          />
          {errors.attachment ? <p className="mt-2 text-sm text-slate-600">{errors.attachment}</p> : null}
        </div>

        <div className="flex justify-center pt-1">
          <Button type="submit" loading={isSubmitting} className="h-11 min-w-36 rounded-md px-6">
            Submit
          </Button>
        </div>

        {message ? (
          <div
            className={[
              "rounded-md border px-3 py-2 text-sm",
              messageType === "success"
                ? "border-slate-300 bg-white text-slate-700"
                : "border-slate-300 bg-slate-50 text-slate-700",
            ].join(" ")}
          >
            <span className="font-medium">{messageType === "success" ? "Success:" : "Error:"}</span>{" "}
            {message}
          </div>
        ) : null}
      </form>
    </Card>
  );
}
