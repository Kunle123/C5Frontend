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
  const isAuthenticated = !!token;

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

  // Helper for authenticated download (fetch+blob)
  const handleDownload = async (docId: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/cv/${docId}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = 'Download failed';
        
        if (res.status === 502) {
          errorMessage = 'CV service is temporarily unavailable. Please try again in a few moments.';
        } else if (res.status === 404) {
          errorMessage = 'CV not found. It may have been deleted.';
        } else {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.detail || errorData.message || errorMessage;
          } catch {
            errorMessage = `Download failed (${res.status})`;
          }
        }
        
        alert(errorMessage);
        return;
      }
      
      const blob = await res.blob();
      // Extract filename from Content-Disposition header
      let filename = 'cv.docx';
      const disposition = res.headers.get('Content-Disposition');
      if (disposition && disposition.indexOf('filename=') !== -1) {
        filename = disposition.split('filename=')[1].replace(/['"]/g, '').trim();
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Network error. Please check your connection and try again.');
      console.error('Download error:', err);
    }
  };

  // Show all CVs where cover_letter_available is true
  const filteredCVs = cvs.filter(cv => cv.cover_letter_available === true);

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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : filteredCVs.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
                  <h3 className="text-xl font-semibold">You have no CVs yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Generate your first tailored CV using the Application Wizard. Simply paste a job description and let our AI create a perfect match.
                  </p>
                  <Button asChild className="mt-4">
                    <a href="/apply">Create Your First CV</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCVs.map((cv: any) => (
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
                      {/* CV Download Button */}
                      {isAuthenticated ? (
                        <Button className="w-full" size="sm" onClick={() => handleDownload(cv.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download CV
                        </Button>
                      ) : (
                        <a
                          href={`/api/cv/${cv.id}/download`}
                          className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download CV
                        </a>
                      )}
                      {/* Cover Letter Download Button */}
                      {cv.cover_letter_available && cv.cover_letter_download_url ? (
                        isAuthenticated ? (
                          <Button
                            variant="outline"
                            className="w-full"
                            size="sm"
                            onClick={() => {
                              // Extract the cover letter ID from the download URL
                              const match = cv.cover_letter_download_url.match(/\/api\/cv\/(.+)\/download/);
                              const coverLetterId = match ? match[1] : null;
                              if (coverLetterId) {
                                handleDownload(coverLetterId);
                              } else {
                                alert('Cover letter ID not found');
                              }
                            }}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Download Cover Letter
                          </Button>
                        ) : (
                          <a
                            href={cv.cover_letter_download_url}
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-primary text-primary rounded hover:bg-primary/10 transition"
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Download Cover Letter
                          </a>
                        )
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

