import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PolenConnect Germany — The Home of Poles in Germany",
    template: "%s · PolenConnect Germany",
  },
  description:
    "The largest online platform connecting Poles across Germany. Find sports clubs, communities, student associations, restaurants, jobs, housing, events, and more.",
  keywords: [
    "Polish Germany",
    "Polish community Germany",
    "Polish students Germany",
    "Polish restaurants Germany",
    "Polish football club Germany",
    "NRN Germany",
  ],
  openGraph: {
    title: "PolenConnect Germany — The Home of Poles in Germany",
    description:
      "Connect with sports clubs, student associations, businesses, events, jobs, housing, and communities across Germany.",
    url: siteUrl,
    siteName: "PolenConnect Germany",
    locale: "en_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PolenConnect Germany",
    description: "The Home of Poles in Germany.",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(fraunces.variable, inter.variable, plexMono.variable, "min-h-screen")}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
