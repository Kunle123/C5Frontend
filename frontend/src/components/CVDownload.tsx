import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Navigation } from "./Navigation";
import { Download, FileText, Mail, Loader2, Trash2 } from "lucide-react";
import { uploadCV, deleteCV } from "../api";

export function CVDownload() {
  const [cvs, setCVs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

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

  useEffect(() => {
    if (token) fetchCVs();
    // eslint-disable-next-line
  }, [token]);

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      await uploadCV(file, token!);
      setUploadSuccess('CV uploaded successfully!');
      setFile(null);
      await fetchCVs();
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
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
        {/* Upload Section */}
        <div className="mb-8 flex flex-col md:flex-row items-center gap-4 justify-center">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="block w-full md:w-auto border rounded px-3 py-2 text-sm"
            disabled={uploading}
          />
          <Button onClick={handleUpload} disabled={!file || uploading} className="w-full md:w-auto">
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Upload CV
          </Button>
        </div>
        {uploadError && <div className="text-center text-red-500 mb-4">{uploadError}</div>}
        {uploadSuccess && <div className="text-center text-green-600 mb-4">{uploadSuccess}</div>}
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
              {cvs.map((cv: any) => (
                <Card key={cv.cv_id || cv.id} className="shadow-md border border-gray-200 rounded-xl p-6 flex flex-col items-start bg-white">
                  <CardHeader className="w-full pb-2">
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                      <FileText className="w-5 h-5 text-primary" />
                      {cv.job_title || cv.name || 'CV'}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      {cv.created ? `Created: ${new Date(cv.created).toLocaleString()}` : ''}
                    </div>
                  </CardHeader>
                  <CardContent className="w-full flex flex-col gap-3 pt-2">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      onClick={() => handleDownload(`/api/cv/${cv.cv_id || cv.id}/download`)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download CV
                    </Button>
                    {cv.cover_letter_id && (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                        variant="outline"
                        onClick={() => handleDownload(`/api/cover-letter/${cv.cover_letter_id}/download`)}
                      >
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