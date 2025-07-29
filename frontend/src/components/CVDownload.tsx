import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Navigation } from "./Navigation";
import { Download, FileText, Mail } from "lucide-react";

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
        const res = await fetch('/api/cv', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch CVs');
        const data = await res.json();
        setCVs(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch CVs');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchCVs();
    // eslint-disable-next-line
  }, [token]);

  const handleDownload = async (url: string, filename?: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const text = await res.text();
        alert('Download failed: ' + text);
        return;
      }
      // Check Content-Type
      const contentType = res.headers.get('Content-Type');
      if (!contentType || !contentType.includes('officedocument')) {
        alert('Warning: The file is not a valid DOCX. Please contact support.\nContent-Type: ' + contentType);
        return;
      }
      const disposition = res.headers.get('Content-Disposition');
      let suggestedFilename = filename || 'download.docx';
      if (disposition && disposition.includes('filename=')) {
        suggestedFilename = disposition.split('filename=')[1].replace(/"/g, '').split(';')[0];
      }
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = suggestedFilename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Download failed.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-card-foreground mb-4">
            Download Your CVs & Cover Letters
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Download your previously generated CVs and cover letters as DOCX files.
          </p>
        </div>
        {/* CVs Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-card-foreground mb-8">Your CVs</h2>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span className="text-muted-foreground">Loading...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : cvs.length === 0 ? (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv: any) => (
                <Card key={cv.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-card-foreground line-clamp-2">
                          {cv.job_title || cv.metadata?.name || 'CV'}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {cv.company_name || ''}
                        </p>
                      </div>
                      <Badge variant={cv.status === 'final' ? 'success' : 'secondary'} className="ml-2 text-xs">
                        {cv.status || 'final'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Created: {cv.created_at ? new Date(cv.created_at).toLocaleString() : ''}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <Button className="w-full" size="sm" onClick={() => handleDownload(`/api/cv/${cv.id}/download`, `${cv.job_title || cv.metadata?.name || 'cv'}.docx`)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download CV
                      </Button>
                      {cv.cover_letter_available && cv.cover_letter_download_url ? (
                        <Button variant="outline" className="w-full" size="sm" onClick={() => handleDownload(cv.cover_letter_download_url, `cover_letter_${cv.id}.docx`)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Download Cover Letter
                        </Button>
                      ) : (
                        <div className="w-full h-9" />
                      )}
                    </div>
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