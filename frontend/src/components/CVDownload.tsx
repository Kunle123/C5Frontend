import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Mail } from "lucide-react";

interface CVItem {
  id: string;
  jobTitle: string;
  company: string;
  createdDate: string;
  status: 'draft' | 'final';
}

const mockCVs: CVItem[] = [
  {
    id: '1',
    jobTitle: 'IT Project Manager',
    company: 'Leading Energy Sector Company',
    createdDate: '20/07/2025, 10:52:48',
    status: 'final'
  },
  {
    id: '2',
    jobTitle: 'Unknown Job Title',
    company: 'Unknown Company',
    createdDate: '19/07/2025, 13:40:54',
    status: 'draft'
  },
  {
    id: '3',
    jobTitle: 'IT Project Manager',
    company: 'Leading Energy Sector Company',
    createdDate: '19/07/2025, 13:19:16',
    status: 'final'
  },
  {
    id: '4',
    jobTitle: 'IT Project Manager',
    company: 'Leading Energy Sector Company',
    createdDate: '19/07/2025, 13:01:41',
    status: 'final'
  },
  {
    id: '5',
    jobTitle: 'IT Project Manager',
    company: 'Leading Energy Sector Company',
    createdDate: '19/07/2025, 12:58:42',
    status: 'final'
  },
  {
    id: '6',
    jobTitle: 'Project Manager',
    company: 'Global Technology Firm',
    createdDate: '19/07/2025, 10:43:38',
    status: 'final'
  },
  {
    id: '7',
    jobTitle: 'Unknown Job Title',
    company: 'Unknown Company',
    createdDate: '19/07/2025, 11:36:51',
    status: 'draft'
  },
  {
    id: '8',
    jobTitle: 'Unknown Job Title',
    company: 'Unknown Company',
    createdDate: '19/07/2025, 01:04:15',
    status: 'draft'
  },
  {
    id: '9',
    jobTitle: 'Unknown Job Title',
    company: 'Unknown Company',
    createdDate: '18/07/2025, 23:15:22',
    status: 'draft'
  },
  {
    id: '10',
    jobTitle: 'Project Manager',
    company: 'Innovation Tech Solutions',
    createdDate: '18/07/2025, 20:08:17',
    status: 'final'
  }
];

export function CVDownload() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-primary">Candidate 5</div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-foreground hover:text-primary transition-colors">Home</a>
              <a href="/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</a>
              <a href="/my-cvs" className="text-primary font-medium">My CVs</a>
              <a href="/account" className="text-foreground hover:text-primary transition-colors">Account</a>
              <Button variant="outline">Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCVs.map((cv) => (
              <Card key={cv.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-card-foreground line-clamp-2">
                        {cv.jobTitle}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {cv.company}
                      </p>
                    </div>
                    <Badge variant={cv.status === 'final' ? 'success' : 'secondary'} className="ml-2 text-xs">
                      {cv.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created: {cv.createdDate}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <Button className="w-full" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download CV
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Download Cover Letter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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