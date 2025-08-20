import React, { useEffect, useState } from 'react';
import { fetchJobApplications } from '../api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const ApplicationHistory: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const data = await fetchJobApplications(token);
        setApplications(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch application history');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Application History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {!loading && applications.length === 0 && <div>No previous job applications found.</div>}
          <div className="space-y-6">
            {applications.map((app, idx) => (
              <div key={idx} className="border-b pb-4 mb-4">
                <div className="font-semibold text-lg">{app.jobTitle} {app.companyName && <span className="text-muted-foreground">@ {app.companyName}</span>}</div>
                <div className="text-sm text-muted-foreground mb-2">{app.appliedAt ? new Date(app.appliedAt).toLocaleString() : ''}</div>
                <div className="mb-2">
                  <span className="font-medium">Job Description:</span>
                  <pre className="whitespace-pre-wrap bg-muted/30 rounded p-2 mt-1 text-sm">{app.jobDescription}</pre>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationHistory;
