import React, { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { FileText, Download, Trash2, Calendar } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CVDownload = () => {
  const { toast } = useToast();
  const [cvs, setCvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userToken = localStorage.getItem('token') || '';

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api-gw-production.up.railway.app/api/cvs', {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (!res.ok) throw new Error('Failed to fetch CVs');
      const data = await res.json();
      setCvs(data.cvs || data || []);
    } catch (err) {
      console.error('Error fetching CVs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (cvId: string, cvName: string) => {
    try {
      const res = await fetch(`https://api-gw-production.up.railway.app/api/cv/${cvId}/download`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (!res.ok) throw new Error('Failed to download CV');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cvName.replace(/[^a-z0-9]/gi, '_')}.docx`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "CV Downloaded",
        description: "Your CV has been downloaded successfully.",
      });
    } catch (err) {
      toast({
        title: "Download Failed",
        description: err instanceof Error ? err.message : "Failed to download CV.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (cvId: string) => {
    if (!confirm('Are you sure you want to delete this CV?')) return;
    
    try {
      const res = await fetch(`https://api-gw-production.up.railway.app/api/cvs/${cvId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (!res.ok) throw new Error('Failed to delete CV');
      
      toast({
        title: "CV Deleted",
        description: "Your CV has been deleted successfully.",
      });
      
      fetchCVs(); // Refresh list
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: err instanceof Error ? err.message : "Failed to delete CV.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My CVs</h1>
          <p className="text-muted-foreground">Manage and download your generated CVs</p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Loading your CVs...</p>
              </div>
            </CardContent>
          </Card>
        ) : cvs.length === 0 ? (
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
          <div className="space-y-4">
            {cvs.map((cv: any) => (
              <Card key={cv.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{cv.name || 'Untitled CV'}</CardTitle>
                        {cv.description && <p className="text-sm text-muted-foreground mt-1">{cv.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownload(cv.id, cv.name)}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(cv.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {cv.created_at && (
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      Created {new Date(cv.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { CVDownload };
