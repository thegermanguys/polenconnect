import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Legal notice / Impressum for PolenConnect Germany.",
};

const rows: { label: string; value: React.ReactNode }[] = [
  { label: "Company", value: "TGG (The German Guy) UG" },
  {
    label: "Address",
    value: (
      <>
        Mühlenweg 34a
        <br />
        15232 Frankfurt (Oder)
        <br />
        Deutschland
      </>
    ),
  },
  {
    label: "Email",
    value: (
      <a href="mailto:polenconnect@thegermanguy.org" className="text-primary underline underline-offset-4 hover:text-primary/80">
        polenconnect@thegermanguy.org
      </a>
    ),
  },
  { label: "Phone", value: "+49-15736112217" },
  { label: "Registergericht", value: "Amtsgericht Frankfurt (Oder)" },
  { label: "Registernummer", value: "HRB 21884 FF" },
  { label: "Umsatzsteuer-ID (§27a UStG)", value: "DE459234376" },
  { label: "Steuernummer", value: "061/121/02033" },
  {
    label: "Geschäftsführer",
    value: (
      <a
        href="https://www.linkedin.com/in/imawanish5/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-primary underline underline-offset-4 hover:text-primary/80"
      >
        Awanish Srivastava
      </a>
    ),
  },
];

export default function ImpressumPage() {
  return (
    <div className="container max-w-2xl py-14">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Legal</span>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Impressum</h1>
      <p className="mt-4 text-sm text-muted-foreground">Information according to §5 TMG / §5 DDG.</p>

      <dl className="mt-10 divide-y divide-border rounded-2xl border border-border bg-surface">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-muted-foreground">{row.label}</dt>
            <dd className="text-sm sm:col-span-2">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
