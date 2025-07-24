import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Navigation } from "./Navigation";
import { Download, FileText, Mail } from "lucide-react";

export function CVDownload() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-card-foreground mb-4">
            Download Your CVs & Cover Letters
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Download your previously generated CVs and cover letters as DOCX files.
          </p>
        </div>
        {/* CVs Section - now empty, ready for real data integration */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-card-foreground mb-8">Your CVs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* No CVs to display yet */}
          </div>
        </div>
        {/* Empty State for Cover Letters */}
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-card-foreground mb-2">
              All documents ready for download
            </h3>
            <p className="text-muted-foreground text-sm">
              Your CVs and cover letters are generated and ready to download above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 