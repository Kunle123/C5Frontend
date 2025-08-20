import React, { useEffect, useState } from 'react';
import { fetchApplicationHistory, ApplicationHistory, updateApplicationHistory, deleteApplicationHistory } from '../api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';

const ApplicationHistoryPage: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ApplicationHistory | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ApplicationHistory>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token') || '';
        const data = await fetchApplicationHistory(token);
        setApplications(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch application history');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openEditModal = (app: ApplicationHistory) => {
    setSelected(app);
    setEditForm(app);
    setEditModalOpen(true);
  };

  const handleEditChange = (field: keyof ApplicationHistory, value: string) => {
    setEditForm(f => ({ ...f, [field]: value }));
  };

  const handleSave = async () => {
    if (!selected?.id) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('token') || '';
      const updated = await updateApplicationHistory(selected.id, editForm, token);
      setApplications(applications.map(a => a.id === updated.id ? updated : a));
      setEditModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update application');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected?.id) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem('token') || '';
      await deleteApplicationHistory(selected.id, token);
      setApplications(applications.filter(a => a.id !== selected.id));
      setEditModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to delete application');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Application History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 border">Job Title</th>
              <th className="p-2 border">Company/Org</th>
              <th className="p-2 border">Contact Name</th>
              <th className="p-2 border">Contact Number</th>
              <th className="p-2 border">Salary</th>
              <th className="p-2 border">Applied At</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="p-4 text-center">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={8} className="p-4 text-red-500 text-center">{error}</td></tr>
            ) : applications.length === 0 ? (
              <tr><td colSpan={8} className="p-4 text-center">No previous job applications found.</td></tr>
            ) : (
              applications.map(app => (
                <tr key={app.id} className="hover:bg-accent cursor-pointer" onClick={() => openEditModal(app)}>
                  <td className="p-2 border font-medium">{app.job_title}</td>
                  <td className="p-2 border">{app.company_name || app.organisation}</td>
                  <td className="p-2 border">{app.contact_name}</td>
                  <td className="p-2 border">{app.contact_number}</td>
                  <td className="p-2 border">{app.salary}</td>
                  <td className="p-2 border">{app.applied_at ? new Date(app.applied_at).toLocaleDateString() : ''}</td>
                  <td className="p-2 border">{app.created_at ? new Date(app.created_at).toLocaleDateString() : ''}</td>
                  <td className="p-2 border"><button className="text-blue-600 underline" onClick={e => { e.stopPropagation(); openEditModal(app); }}>Edit</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Edit/Delete Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
          </DialogHeader>
          {selected && (
            <form className="space-y-3" onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <Input value={editForm.job_title || ''} onChange={e => handleEditChange('job_title', e.target.value)} placeholder="Job Title" required />
              <Input value={editForm.company_name || ''} onChange={e => handleEditChange('company_name', e.target.value)} placeholder="Company Name" />
              <Input value={editForm.organisation || ''} onChange={e => handleEditChange('organisation', e.target.value)} placeholder="Organisation" />
              <Input value={editForm.salary || ''} onChange={e => handleEditChange('salary', e.target.value)} placeholder="Salary" />
              <Input value={editForm.contact_name || ''} onChange={e => handleEditChange('contact_name', e.target.value)} placeholder="Contact Name" />
              <Input value={editForm.contact_number || ''} onChange={e => handleEditChange('contact_number', e.target.value)} placeholder="Contact Number" />
              <Input value={editForm.applied_at || ''} onChange={e => handleEditChange('applied_at', e.target.value)} placeholder="Applied At (YYYY-MM-DD)" />
              <textarea className="w-full border rounded p-2" value={editForm.job_description || ''} onChange={e => handleEditChange('job_description', e.target.value)} placeholder="Job Description" rows={3} />
              <div className="flex gap-2 mt-4">
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
                <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationHistoryPage;
