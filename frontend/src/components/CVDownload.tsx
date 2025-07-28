import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Navigation } from "./Navigation";
import { Download, FileText, Mail, Loader2 } from "lucide-react";

export function CVDownload() {
  const [cvs, setCVs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  useEffect(() => {
    const fetchCVs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://api-gw-production.up.railway.app/api/mega-cv', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch CVs');
        const data = await res.json();
        setCVs(data.megaCVs || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch CVs');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchCVs();
  }, [token]);

  const handleDownload = async (url: string) => {
    window.open(url, '_blank');
  };

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
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-card-foreground mb-8">Your CVs</h2>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : cvs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No CVs found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv) => (
                <Card key={cv.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {cv.job_title || 'CV'}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      {cv.created ? `Created: ${new Date(cv.created).toLocaleString()}` : ''}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" onClick={() => handleDownload(cv.download_url)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download CV
                    </Button>
                    {cv.cover_letter_url && (
                      <Button className="w-full" variant="outline" onClick={() => handleDownload(cv.cover_letter_url)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Cover Letter
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 