import type { AffiliateCategory, AffiliateLink } from "@/lib/types";

// Practical services for moving to / living in Germany: bank accounts,
// health insurance, blocked accounts for the visa, SIM cards, etc.
//
// IMPORTANT: these are affiliate/referral links sourced from
// https://thegermanguy.org/partners — clicking through and signing up
// credits their partner accounts (referral codes like ?p=TGG23,
// referral-code=awanise199, utm_source=hoc9lz2rfjmgtdp5 are already baked
// into the URLs). If you want the signups to credit PolenConnect's own
// accounts instead, you'll need to register with each provider separately
// and swap in your own links/codes here.

export const affiliateCategoryLabels: Record<AffiliateCategory, string> = {
  insurance: "Insurance",
  banks: "German Banks",
  "credit-cards": "Credit Cards",
  electricity: "Electricity",
  "blocked-account": "Blocked Account",
  "money-transfer": "Money Transfer",
  "internet-sim": "Internet / SIM Card",
  "tax-return": "Tax Return",
};

export const affiliateCategoryOrder: AffiliateCategory[] = [
  "insurance",
  "banks",
  "credit-cards",
  "blocked-account",
  "money-transfer",
  "internet-sim",
  "electricity",
  "tax-return",
];

export const affiliateLinks: AffiliateLink[] = [
  // ---- Insurance ---------------------------------------------------
  {
    id: "aff-barmer",
    name: "Public Health Insurance: BARMER",
    category: "insurance",
    description: "Statutory (gesetzliche) health insurance accepted for visa and university enrollment purposes.",
    url: "https://feather-insurance.com/en/public-health-insurance/barmer?utm_source=hoc9lz2rfjmgtdp5",
    ctaLabel: "Explore Plans",
  },
  {
    id: "aff-mawista",
    name: "Private Health Insurance: MAWISTA",
    category: "insurance",
    description: "Private health cover popular with students and newcomers before switching to statutory insurance.",
    url: "https://feather-insurance.com/private-health-insurance?utm_source=hoc9lz2rfjmgtdp5",
    ctaLabel: "Explore Plans",
  },
  {
    id: "aff-dental",
    name: "Dental Insurance",
    category: "insurance",
    description: "Supplementary cover for dental treatment costs not fully covered by statutory insurance.",
    url: "https://feather-insurance.com/dental-insurance?utm_source=hoc9lz2rfjmgtdp5",
    ctaLabel: "Explore Plans",
  },
  {
    id: "aff-life",
    name: "Life Insurance",
    category: "insurance",
    description: "Financial protection for your family in case of unexpected events.",
    url: "https://feather-insurance.com/life-insurance?utm_source=hoc9lz2rfjmgtdp5",
    ctaLabel: "Explore Plans",
  },
  {
    id: "aff-disability",
    name: "Disability Insurance",
    category: "insurance",
    description: "Income protection if you're unable to work due to illness or injury.",
    url: "https://feather-insurance.com/disability-insurance?utm_source=hoc9lz2rfjmgtdp5",
    ctaLabel: "Explore Plans",
  },
  {
    id: "aff-dog-liability",
    name: "Dog Liability Insurance",
    category: "insurance",
    description: "Required in several German states if you own a dog.",
    url: "https://feather-insurance.com/dog-liability-insurance?utm_source=hoc9lz2rfjmgtdp5",
    ctaLabel: "Explore Plans",
  },
  {
    id: "aff-personal-liability",
    name: "Personal Liability Insurance",
    category: "insurance",
    description: "Haftpflichtversicherung — widely considered essential in Germany, covers damage you accidentally cause to others.",
    url: "https://feather-insurance.com/personal-liability-insurance?utm_source=hoc9lz2rfjmgtdp5",
    ctaLabel: "Explore Plans",
  },
  {
    id: "aff-household",
    name: "Household Contents Insurance",
    category: "insurance",
    description: "Covers your furniture, electronics, and belongings against theft, fire, and water damage.",
    url: "https://feather-insurance.com/household-insurance?utm_source=hoc9lz2rfjmgtdp5",
    ctaLabel: "Explore Plans",
  },
  {
    id: "aff-bike",
    name: "Bike Insurance",
    category: "insurance",
    description: "Protects against bike theft — worth it if you're commuting by bicycle in a German city.",
    url: "https://feather-insurance.com/bike-insurance?utm_source=hoc9lz2rfjmgtdp5",
    ctaLabel: "Explore Plans",
  },
  {
    id: "aff-legal",
    name: "Legal Insurance",
    category: "insurance",
    description: "Rechtsschutzversicherung — covers legal fees for disputes with landlords, employers, and more.",
    url: "https://feather-insurance.com/legal-insurance?utm_source=hoc9lz2rfjmgtdp5",
    ctaLabel: "Explore Plans",
  },
  {
    id: "aff-pet-health",
    name: "Pet Health Insurance",
    category: "insurance",
    description: "Covers veterinary costs for your pet.",
    url: "https://feather-insurance.com/pet-health-insurance?utm_source=hoc9lz2rfjmgtdp5",
    ctaLabel: "Explore Plans",
  },

  // ---- German Banks --------------------------------------------------
  {
    id: "aff-n26",
    name: "N26",
    category: "banks",
    description: "Fully digital bank account, opened entirely online — a common first account for newcomers.",
    url: "http://n26-eu.c2nwa3.net/7abxGd",
    ctaLabel: "Start Banking",
  },
  {
    id: "aff-revolut",
    name: "Revolut",
    category: "banks",
    description: "Multi-currency account and card, useful for international transfers and travel.",
    url: "https://revolut.com/referral/?referral-code=awanise199",
    ctaLabel: "Start Banking",
  },
  {
    id: "aff-commerzbank",
    name: "Commerzbank",
    category: "banks",
    description: "Traditional German bank with branches nationwide, often required for certain visa/rental processes.",
    url: "https://www.commerzbank.de/girokonto-antrag?path=/pk/de/Abschluss/GD51_Girokonto_DD_MCD_TGK_50Start_KwK&x-werbecode=JTDNVS",
    ctaLabel: "Start Banking",
  },

  // ---- Credit Cards ----------------------------------------------------
  {
    id: "aff-advanzia",
    name: "Advanzia",
    category: "credit-cards",
    description: "No-fee credit card, no Schufa credit history required — popular for newcomers to Germany.",
    url: "https://tell.tl/p/b1a/1z0idrw",
    ctaLabel: "Apply Now",
  },

  // ---- Electricity -------------------------------------------------
  {
    id: "aff-eprimo",
    name: "Eprimo",
    category: "electricity",
    description: "Electricity provider for your apartment, with online sign-up and no long-term contract required.",
    url: "https://tell.tl/p/b1a/2hYs-uQ",
    ctaLabel: "Connect Now",
  },

  // ---- Blocked Account -----------------------------------------------
  {
    id: "aff-expatrio",
    name: "Expatrio",
    category: "blocked-account",
    description: "Blocked account (Sperrkonto) for student visa applications, opened fully online.",
    url: "https://www.expatrio.com?p=TGG23",
    ctaLabel: "Open Blocked Account",
  },
  {
    id: "aff-fintiba",
    name: "Fintiba",
    category: "blocked-account",
    description: "Another popular blocked-account provider for German student visa proof-of-funds requirements.",
    url: "http://partner.fintiba.com/tggthegermanguy",
    ctaLabel: "Open Blocked Account",
  },

  // ---- Money Transfer --------------------------------------------------
  {
    id: "aff-wise",
    name: "Wise",
    category: "money-transfer",
    description: "Send money between Poland and Germany at the real exchange rate with low, transparent fees.",
    url: "https://wise.com/invite/ihpc/chitrakantis",
    ctaLabel: "Begin Transfer",
  },

  // ---- Internet / SIM Card -------------------------------------------
  {
    id: "aff-simde",
    name: "SIM.DE",
    category: "internet-sim",
    description: "Prepaid and contract SIM plans, a common first mobile plan for newcomers.",
    url: "https://h.sim.de/12263fbdc468d?kw=a3c6MjI1YTcwYmMtYWMzNC00ZDk4LTkwNGMtYWE4MjU3ZTkwZTQ0",
    ctaLabel: "Order Now",
  },
  {
    id: "aff-1und1",
    name: "1&1",
    category: "internet-sim",
    description: "Home internet and mobile plans from one of Germany's largest providers.",
    url: "https://www.1und1.de/?ps_id=P786342813",
    ctaLabel: "Order Now",
  },

  // ---- Tax Return ------------------------------------------------------
  {
    id: "aff-taxfix",
    name: "Taxfix",
    category: "tax-return",
    description: "File your German tax return (Steuererklärung) online and claim back overpaid tax.",
    url: "https://taxfix.page.link/eijQ",
    ctaLabel: "Get Started",
  },
];

export function getAffiliatesByCategory(category: AffiliateCategory) {
  return affiliateLinks.filter((a) => a.category === category);
}