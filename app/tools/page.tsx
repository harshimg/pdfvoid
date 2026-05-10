import { ToolsDashboard } from "@/components/tools-dashboard";
import { AdSlot } from "@/components/ads/ad-slot";

export const metadata = {
  title: "PDF Tools Dashboard",
  description: "Search and run free PDF tools for merging, splitting, converting, editing, and organizing PDFs."
};

export default function ToolsPage() {
  return (
    <div className="container py-10">
      <AdSlot placement="top-banner" />
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-primary">Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold">PDF tools</h1>
        <p className="mt-3 text-muted-foreground">
          Search, filter, upload, preview, and process files from one responsive workspace.
        </p>
      </div>
      <ToolsDashboard />
    </div>
  );
}
