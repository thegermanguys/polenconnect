"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { submitListingAction } from "@/app/submit/actions";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { getPublicSubmissionUploadSignature } from "@/lib/cloudinary/sign";
import type { City, Category } from "@/lib/types";

type FieldType = "text" | "email" | "tel" | "textarea" | "select" | "date" | "image" | "number";

interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  multiple?: boolean;
  options?: { value: string; label: string }[];
}

function buildCategoryForms(
  cityOptions: { value: string; label: string }[],
  sportsCategories: Category[],
  communityCategories: Category[]
): Record<string, { label: string; fields: FieldConfig[] }> {
  return {
    "sports-club": {
      label: "Sports Club",
      fields: [
        { name: "name", label: "Club name", type: "text", required: true },
        { name: "city", label: "City", type: "select", required: true, options: cityOptions },
        {
          name: "category",
          label: "Sport",
          type: "select",
          required: true,
          options: sportsCategories.map((c) => ({ value: c.slug, label: c.name })),
        },
        { name: "phone", label: "Phone", type: "tel", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "logo", label: "Club logo", type: "image" },
        { name: "coverImage", label: "Cover image", type: "image" },
        { name: "mapsUrl", label: "Maps URL", type: "text" },
        { name: "captain", label: "Captain name", type: "text", required: true },
        { name: "practiceLocation", label: "Practice location", type: "text" },
        { name: "practiceTime", label: "Practice time", type: "text" },
        { name: "memberCount", label: "Member count", type: "number" },
        { name: "instagram", label: "Instagram URL", type: "text" },
        { name: "facebook", label: "Facebook URL", type: "text" },
        { name: "whatsapp", label: "WhatsApp invite URL", type: "text" },
        { name: "website", label: "Website URL", type: "text" },
        { name: "description", label: "Description", type: "textarea", required: true },
      ],
    },
    restaurant: {
      label: "Restaurant",
      fields: [
        { name: "name", label: "Restaurant name", type: "text", required: true },
        { name: "city", label: "City", type: "select", required: true, options: cityOptions },
        { name: "address", label: "Address", type: "text", required: true },
        { name: "phone", label: "Phone", type: "tel", required: true },
        { name: "mapsUrl", label: "Maps URL", type: "text" },
        { name: "logo", label: "Logo", type: "image" },
        { name: "photos", label: "Photos", type: "image", multiple: true },
        { name: "cuisine", label: "Cuisine", type: "text", placeholder: "Polish, Tibetan…" },
        { name: "instagram", label: "Instagram URL", type: "text" },
        { name: "facebook", label: "Facebook URL", type: "text" },
        { name: "website", label: "Website URL", type: "text" },
        { name: "description", label: "Description", type: "textarea", required: true },
      ],
    },
    association: {
      label: "Cultural / Music Group",
      fields: [
        { name: "name", label: "Group name", type: "text", required: true },
        { name: "city", label: "City", type: "select", required: true, options: cityOptions },
        {
          name: "category",
          label: "Focus area",
          type: "select",
          required: true,
          options: communityCategories.map((c) => ({ value: c.slug, label: c.name })),
        },
        { name: "phone", label: "Phone", type: "tel" },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "logo", label: "Group logo", type: "image" },
        { name: "coverImage", label: "Cover image", type: "image" },
        { name: "mapsUrl", label: "Maps URL", type: "text" },
        { name: "contactName", label: "Contact name", type: "text", required: true },
        { name: "instagram", label: "Instagram URL", type: "text" },
        { name: "facebook", label: "Facebook URL", type: "text" },
        { name: "whatsapp", label: "WhatsApp invite URL", type: "text" },
        { name: "website", label: "Website URL", type: "text" },
        { name: "description", label: "Description", type: "textarea", required: true },
      ],
    },
    event: {
      label: "Event",
      fields: [
        { name: "title", label: "Event title", type: "text", required: true },
        { name: "city", label: "City", type: "select", required: true, options: cityOptions },
        {
          name: "category",
          label: "Event type",
          type: "select",
          required: true,
          options: [
            { value: "festival", label: "Festival" },
            { value: "sports", label: "Sports" },
            { value: "cultural", label: "Cultural" },
            { value: "networking", label: "Networking" },
            { value: "religious", label: "Religious" },
            { value: "concert", label: "Concert" },
            { value: "other", label: "Other" },
          ],
        },
        { name: "festivalTag", label: "Festival tag (optional)", type: "text", placeholder: "Wigilia, Dożynki, Andrzejki, Mikołajki…" },
        { name: "organizer", label: "Organizer", type: "text", required: true },
        { name: "poster", label: "Event poster", type: "image" },
        { name: "location", label: "Location", type: "text", required: true },
        { name: "mapsUrl", label: "Maps URL", type: "text" },
        { name: "date", label: "Date", type: "date", required: true },
        { name: "endDate", label: "End date (optional)", type: "date" },
        { name: "price", label: "Price", type: "text", placeholder: "Free, €10…" },
        { name: "registerUrl", label: "Register URL", type: "text" },
        { name: "description", label: "Description", type: "textarea", required: true },
      ],
    },
  };
}

export function SubmitForm({
  cities,
  sportsCategories,
  communityCategories,
}: {
  cities: City[];
  sportsCategories: Category[];
  communityCategories: Category[];
}) {
  const [category, setCategory] = React.useState("sports-club");
  const cityOptions = React.useMemo(() => cities.map((c) => ({ value: c.slug, label: c.name })), [cities]);
  const CATEGORY_FORMS = React.useMemo(
    () => buildCategoryForms(cityOptions, sportsCategories, communityCategories),
    [cityOptions, sportsCategories, communityCategories]
  );
  const config = CATEGORY_FORMS[category];

  return (
    <Tabs value={category} onValueChange={setCategory} className="mt-8">
      <TabsList className="flex-wrap h-auto gap-y-2">
        {Object.entries(CATEGORY_FORMS).map(([key, val]) => (
          <TabsTrigger key={key} value={key}>{val.label}</TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={category}>
        <form
          action={submitListingAction}
          className="grid grid-cols-1 gap-5 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:grid-cols-2 sm:p-8"
        >
          <input type="hidden" name="_form" value={category} />
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Fields marked <span className="text-primary">*</span> are required.
          </p>
          {config.fields.map((field) =>
            field.type === "image" ? (
              <ImageUploadField
                key={field.name}
                label={field.label}
                name={field.name}
                folder="polenconnect/submissions/pending"
                multiple={field.multiple}
                signAction={getPublicSubmissionUploadSignature}
                className={field.multiple ? "sm:col-span-2" : undefined}
              />
            ) : (
              <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2 space-y-2" : "space-y-2"}>
                <Label htmlFor={field.name}>
                  {field.label} {field.required && <span className="text-primary">*</span>}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea id={field.name} name={field.name} required={field.required} placeholder={field.placeholder} rows={4} />
                ) : field.type === "select" ? (
                  <Select id={field.name} name={field.name} required={field.required} defaultValue="">
                    <option value="" disabled>Select…</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                ) : (
                  <Input id={field.name} name={field.name} type={field.type} required={field.required} placeholder={field.placeholder} />
                )}
              </div>
            )
          )}

          <div className="sm:col-span-2 flex items-start gap-2 rounded-xl bg-surface-2 p-4 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            Your submission is sent to our moderation queue and reviewed before it appears publicly.
          </div>

          <Button type="submit" size="lg" className="sm:col-span-2">
            Submit for Review
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
