import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Map",
  description: "An interactive map of Polish communities, businesses, and events across Germany.",
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
