import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Your Community",
  description: "Add your sports club, business, restaurant, association, event, housing, or job listing to PolenConnect Germany.",
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
