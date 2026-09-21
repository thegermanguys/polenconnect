import { Check, X, Users, Building2, CalendarDays, MapPinned, ShieldCheck, LogOut, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { getCities } from "@/lib/data/cities";
import { getCategories } from "@/lib/data/categories";
import { getAllClubsAdmin, getAllRestaurantsAdmin, getAllEventsAdmin, getPendingQueueAdmin } from "@/lib/admin/queries";
import {
  setListingStatusAction,
  adminLogoutAction,
  createClubAction,
  createRestaurantAction,
  createEventAction,
} from "./actions";

export const dynamic = "force-dynamic";

const EVENT_CATEGORY_OPTIONS = ["festival", "sports", "cultural", "networking", "religious", "concert", "other", "offer"];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;

  const [cities, categories, clubs, restaurants, events, queue] = await Promise.all([
    getCities(),
    getCategories(),
    getAllClubsAdmin(),
    getAllRestaurantsAdmin(),
    getAllEventsAdmin(),
    getPendingQueueAdmin(),
  ]);

  const clubCategories = categories.filter((c) => c.group === "sports" || c.group === "community");
  const cityOptions = cities.map((c) => ({ value: c.slug, label: c.name }));

  const overviewStats = [
    { icon: MapPinned, label: "Cities", value: cities.length },
    { icon: Users, label: "Clubs & Groups", value: clubs.length },
    { icon: Building2, label: "Restaurants", value: restaurants.length },
    { icon: CalendarDays, label: "Events", value: events.length },
  ];

  return (
    <div className="container py-14">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage listings and approvals across the platform.</p>
          </div>
        </div>
        <form action={adminLogoutAction}>
          <Button variant="outline" size="sm" type="submit">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </form>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {overviewStats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-surface p-5 text-center shadow-soft">
            <s.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
            <p className="font-display text-2xl font-bold">{s.value}</p>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue={tab ?? "approvals"} className="mt-10">
        <TabsList className="flex-wrap h-auto gap-y-2">
          <TabsTrigger value="approvals">Approvals {queue.length > 0 && `(${queue.length})`}</TabsTrigger>
          <TabsTrigger value="cities">Cities</TabsTrigger>
          <TabsTrigger value="clubs">Clubs & Groups</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        {/* ----------------------------- Approvals ----------------------------- */}
        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Pending moderation ({queue.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {queue.length === 0 && <p className="text-sm text-muted-foreground">Queue is clear — nice work.</p>}
              {queue.map((item) => (
                <div
                  key={`${item.table}-${item.id}`}
                  className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="muted">{item.typeLabel}</Badge>
                      <p className="font-medium">{item.name}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{item.citySlug}</p>
                  </div>
                  <div className="flex gap-2">
                    <form action={setListingStatusAction}>
                      <input type="hidden" name="table" value={item.table} />
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="status" value="approved" />
                      <Button size="sm" type="submit">
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                    </form>
                    <form action={setListingStatusAction}>
                      <input type="hidden" name="table" value={item.table} />
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="status" value="rejected" />
                      <Button size="sm" variant="outline" type="submit">
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------- Cities ------------------------------- */}
        <TabsContent value="cities">
          <p className="mb-4 text-sm text-muted-foreground">
            Cities and categories rarely change — the fastest way to add or edit one is the{" "}
            <span className="font-medium text-foreground">Table Editor</span> in your Supabase project
            (Dashboard → Table Editor → cities / categories), no form needed here.
          </p>
          <AdminTable
            columns={["City", "State", "Communities", "Businesses", "Events"]}
            rows={cities.map((c) => [c.name, c.state, c.communityCount, c.businessCount, c.eventCount])}
          />
        </TabsContent>

        {/* -------------------------- Clubs & Groups ---------------------------- */}
        <TabsContent value="clubs" className="space-y-6">
          <details className="rounded-2xl border border-border bg-surface shadow-soft">
            <summary className="flex cursor-pointer items-center gap-2 p-5 font-display text-lg font-semibold">
              <Plus className="h-4 w-4 text-primary" /> Add a new club or group
            </summary>
            <div className="border-t border-border p-6">
              <form action={createClubAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <p className="text-xs text-muted-foreground sm:col-span-2">Fields marked <span className="text-destructive">*</span> are required.</p>
                <Field label="Name" name="name" required />
                <Field label="Slug (optional — auto-generated from name)" name="slug" />
                <SelectField label="City" name="citySlug" required options={cityOptions} />
                <SelectField
                  label="Category"
                  name="categorySlug"
                  required
                  options={clubCategories.map((c) => ({ value: c.slug, label: c.name }))}
                />
                <Field label="Phone" name="phone" />
                <Field label="Email" name="email" type="email" />
                <ImageUploadField label="Logo" name="logo" folder="polenconnect/clubs/logos" />
                <ImageUploadField label="Cover image" name="coverImage" folder="polenconnect/clubs/covers" />
                <Field label="Maps URL" name="mapsUrl" />
                <Field label="Captain name (sports clubs)" name="captainName" />
                <Field label="Practice location (sports clubs)" name="practiceLocation" />
                <Field label="Practice time (sports clubs)" name="practiceTime" />
                <Field label="Member count (sports clubs)" name="memberCount" type="number" />
                <Field label="Contact person (cultural/music groups)" name="contactPerson" />
                <Field label="Instagram URL" name="instagram" />
                <Field label="Facebook URL" name="facebook" />
                <Field label="WhatsApp invite URL" name="whatsapp" />
                <Field label="Website URL" name="website" />
                <TextareaField label="Description" name="description" className="sm:col-span-2" />
                <label className="flex items-center gap-2 text-sm sm:col-span-2">
                  <input type="checkbox" name="isFeatured" className="h-4 w-4 rounded border-input" /> Feature on homepage
                </label>
                <Button type="submit" className="sm:col-span-2 w-fit">Publish club / group</Button>
              </form>
            </div>
          </details>

          <AdminTable
            columns={["Club/Group", "City", "Category", "Members", "Status"]}
            rows={clubs.map((c) => [c.name, c.citySlug, c.categorySlug, c.memberCount ?? "–", c.status])}
          />
        </TabsContent>

        {/* ------------------------------ Restaurants ---------------------------- */}
        <TabsContent value="restaurants" className="space-y-6">
          <details className="rounded-2xl border border-border bg-surface shadow-soft">
            <summary className="flex cursor-pointer items-center gap-2 p-5 font-display text-lg font-semibold">
              <Plus className="h-4 w-4 text-primary" /> Add a new restaurant
            </summary>
            <div className="border-t border-border p-6">
              <form action={createRestaurantAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <p className="text-xs text-muted-foreground sm:col-span-2">Fields marked <span className="text-destructive">*</span> are required.</p>
                <Field label="Name" name="name" required />
                <Field label="Slug (optional — auto-generated from name)" name="slug" />
                <SelectField label="City" name="citySlug" required options={cityOptions} />
                <Field label="Category label" name="category" placeholder="Restaurant" />
                <Field label="Address" name="address" />
                <Field label="Phone" name="phone" />
                <Field label="Maps URL" name="mapsUrl" />
                <ImageUploadField label="Logo" name="logo" folder="polenconnect/restaurants/logos" />
                <ImageUploadField
                  label="Photos"
                  name="photos"
                  folder="polenconnect/restaurants/photos"
                  multiple
                  className="sm:col-span-2"
                />
                <Field label="Cuisine tags (comma-separated)" name="cuisine" placeholder="Polish, Tibetan" />
                <Field label="Rating (0–5)" name="rating" type="number" />
                <Field label="Review count" name="reviewCount" type="number" />
                <Field label="Instagram URL" name="instagram" />
                <Field label="Facebook URL" name="facebook" />
                <Field label="Website URL" name="website" />
                <TextareaField label="Description" name="description" className="sm:col-span-2" />
                <label className="flex items-center gap-2 text-sm sm:col-span-2">
                  <input type="checkbox" name="isPremium" className="h-4 w-4 rounded border-input" /> Mark as premium listing
                </label>
                <p className="text-xs text-muted-foreground sm:col-span-2">
                  Opening hours, menu highlights, and delivery links can be added afterward via the Supabase Table
                  Editor (opening_hours / menu_highlights / delivery columns).
                </p>
                <Button type="submit" className="sm:col-span-2 w-fit">Publish restaurant</Button>
              </form>
            </div>
          </details>

          <AdminTable
            columns={["Restaurant", "City", "Category", "Rating", "Status"]}
            rows={restaurants.map((b) => [b.name, b.citySlug, b.category, b.rating, b.status])}
          />
        </TabsContent>

        {/* -------------------------------- Events -------------------------------- */}
        <TabsContent value="events" className="space-y-6">
          <details className="rounded-2xl border border-border bg-surface shadow-soft">
            <summary className="flex cursor-pointer items-center gap-2 p-5 font-display text-lg font-semibold">
              <Plus className="h-4 w-4 text-primary" /> Add a new event
            </summary>
            <div className="border-t border-border p-6">
              <form action={createEventAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <p className="text-xs text-muted-foreground sm:col-span-2">Fields marked <span className="text-destructive">*</span> are required.</p>
                <Field label="Title" name="title" required />
                <Field label="Slug (optional — auto-generated from title)" name="slug" />
                <SelectField label="City" name="citySlug" required options={cityOptions} />
                <SelectField
                  label="Category"
                  name="category"
                  options={EVENT_CATEGORY_OPTIONS.map((c) => ({ value: c, label: c }))}
                />
                <Field label="Festival tag (optional)" name="festivalTag" placeholder="Wigilia, Dożynki, Andrzejki, Mikołajki…" />
                <Field label="Organizer" name="organizer" />
                <ImageUploadField label="Poster" name="poster" folder="polenconnect/events/posters" />
                <Field label="Location" name="location" />
                <Field label="Maps URL" name="mapsUrl" />
                <Field label="Start date" name="startDate" type="date" required />
                <Field label="End date (optional)" name="endDate" type="date" />
                <Field label="Price" name="price" placeholder="Free, €10…" />
                <Field label="Register URL" name="registerUrl" />
                <TextareaField label="Description" name="description" className="sm:col-span-2" />
                <label className="flex items-center gap-2 text-sm sm:col-span-2">
                  <input type="checkbox" name="isFeatured" className="h-4 w-4 rounded border-input" /> Feature on homepage
                </label>
                <Button type="submit" className="sm:col-span-2 w-fit">Publish event</Button>
              </form>
            </div>
          </details>

          <AdminTable
            columns={["Event", "City", "Date", "Category", "Status"]}
            rows={events.map((e) => [e.title, e.citySlug, e.startDate, e.category, e.status])}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AdminTable({ columns, rows }: { columns: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-soft">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-5 py-3 font-medium">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.length === 0 && (
            <tr>
              <td className="px-5 py-4 text-muted-foreground" colSpan={columns.length}>Nothing here yet.</td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-surface-2/60">
              {row.map((cell, j) => (
                <td key={j} className="px-5 py-3">
                  {j === row.length - 1 && typeof cell === "string" ? (
                    <Badge variant={cell === "approved" ? "green" : cell === "pending" ? "accent" : "muted"} className="capitalize">
                      {cell}
                    </Badge>
                  ) : (
                    String(cell)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Small server-rendered form field helpers (no client JS needed) --------

function RequiredMark() {
  return <span className="ml-0.5 text-destructive">*</span>;
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={name}>
        {label}
        {required && <RequiredMark />}
      </Label>
      <Input id={name} name={name} type={type} required={required} placeholder={placeholder} />
    </div>
  );
}

function TextareaField({ label, name, className }: { label: string; name: string; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} rows={4} />
    </div>
  );
}

function SelectField({
  label,
  name,
  required,
  options,
  className,
}: {
  label: string;
  name: string;
  required?: boolean;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={name}>
        {label}
        {required && <RequiredMark />}
      </Label>
      <Select id={name} name={name} required={required} defaultValue="">
        <option value="" disabled>Select…</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </Select>
    </div>
  );
}
