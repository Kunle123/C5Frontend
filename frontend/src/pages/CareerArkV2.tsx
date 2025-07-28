import React, { useRef, useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { Navigation } from '../components/Navigation';
import { Plus, Edit, Trash2, Upload, Calendar, Building, Award, TrendingUp, Clock, MapPin, Sparkles, Brain, FileText, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { API_GATEWAY_BASE } from '../api/careerArkApi';
import { addWorkExperience, updateWorkExperience, deleteWorkExperience, addEducation, updateEducation, deleteEducation, addTraining, updateTraining, deleteTraining, addSkill, updateSkill, deleteSkill, addProject, updateProject, deleteProject, addCertification, updateCertification, deleteCertification } from '../api/careerArkApi';

const sectionList = [
  { key: 'work_experience', label: 'Work Experience' },
  { key: 'education', label: 'Education' },
  { key: 'training', label: 'Training' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'certifications', label: 'Certifications' },
];

function EmptyState({ section, onUpload }: { section: string, onUpload?: () => void }) {
  const sectionNames: Record<string, string> = {
    work_experience: 'work experience',
    education: 'education',
    skills: 'skills',
    projects: 'projects',
    certifications: 'certifications',
    training: 'training',
  };
  const imgSrc = `/empty-${section}.svg`;
  return (
    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
      <img src={imgSrc} alt={`No ${sectionNames[section]} illustration`} className="w-32 mb-2" />
      <p className="mb-2">No {sectionNames[section]} found.</p>
      {onUpload && <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={onUpload}>Upload CV</Button>}
    </div>
  );
}

function convertToMonthInput(dateStr: string) {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}$/.test(dateStr)) return dateStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr.slice(0, 7);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const match = dateStr.match(/^(\w{3}) (\d{4})$/);
  if (match) {
    const month = months.indexOf(match[1]) + 1;
    return `${match[2]}-${month.toString().padStart(2, '0')}`;
  }
  return "";
}

function getUniqueMonths(workExperiences: any[]) {
  const months = new Set<string>();
  workExperiences.forEach(exp => {
    const start = exp.start_date ? new Date(exp.start_date) : null;
    const end = exp.end_date && exp.end_date !== 'Present' ? new Date(exp.end_date) : new Date();
    if (!start || !end) return;
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    const last = new Date(end.getFullYear(), end.getMonth(), 1);
    while (current <= last) {
      months.add(`${current.getFullYear()}-${(current.getMonth()+1).toString().padStart(2,'0')}`);
      current.setMonth(current.getMonth() + 1);
    }
  });
  return months;
}

const CareerArkV2: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [summary, setSummary] = useState<any>(null);
  const [uploadError, setUploadError] = useState('');
  const [polling, setPolling] = useState(false);
  const { toast } = useToast();
  const token = (typeof window !== 'undefined' ? localStorage.getItem('token') : '') || '';
  const [arcData, setArcData] = useState<any>(null);
  const [arcLoading, setArcLoading] = useState(false);
  const [arcError, setArcError] = useState('');
  const [activeSection, setActiveSection] = useState('work_experience');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ company: '', title: '', start_date: '', end_date: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [profileError, setProfileError] = useState('');

  // Education CRUD state
  const [showAddEduModal, setShowAddEduModal] = useState(false);
  const [showEditEduModal, setShowEditEduModal] = useState(false);
  const [editEduItem, setEditEduItem] = useState<any>(null);
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', field: '', start_date: '', end_date: '', description: '' });
  const [eduFormLoading, setEduFormLoading] = useState(false);
  const [eduFormError, setEduFormError] = useState('');
  // Training CRUD state
  const [showAddTrainingModal, setShowAddTrainingModal] = useState(false);
  const [showEditTrainingModal, setShowEditTrainingModal] = useState(false);
  const [editTrainingItem, setEditTrainingItem] = useState<any>(null);
  const [trainingForm, setTrainingForm] = useState({ name: '', provider: '', date: '', details: '' });
  const [trainingFormLoading, setTrainingFormLoading] = useState(false);
  const [trainingFormError, setTrainingFormError] = useState('');

  // Skills CRUD state
  const [skillInput, setSkillInput] = useState('');
  const [skillLoading, setSkillLoading] = useState(false);
  const [skillError, setSkillError] = useState('');
  // Projects CRUD state
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editProjectItem, setEditProjectItem] = useState<any>(null);
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [projectFormLoading, setProjectFormLoading] = useState(false);
  const [projectFormError, setProjectFormError] = useState('');
  // Certifications CRUD state
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [showEditCertModal, setShowEditCertModal] = useState(false);
  const [editCertItem, setEditCertItem] = useState<any>(null);
  const [certForm, setCertForm] = useState({ name: '', issuer: '', year: '' });
  const [certFormLoading, setCertFormLoading] = useState(false);
  const [certFormError, setCertFormError] = useState('');

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    setTaskId(null);
    setStatus('');
    setSummary(null);
    setUploadProgress(10);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/career-ark/cv', true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 60));
        }
      };
      xhr.onreadystatechange = async () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(70);
            const data = JSON.parse(xhr.responseText);
            setTaskId(data.taskId);
            setStatus('pending');
            setPolling(true);
            // Poll for extraction completion using setInterval
            let pollCount = 0;
            const interval = setInterval(async () => {
              try {
                const res = await fetch(`https://api-gw-production.up.railway.app/api/career-ark/cv/status/${data.taskId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const statusData = await res.json();
                setStatus(statusData.status);
                if (
                  statusData.status === 'completed' ||
                  statusData.status === 'completed_with_errors' ||
                  statusData.status === 'failed'
                ) {
                  setPolling(false);
                  clearInterval(interval);
                  if (statusData.status === 'completed') {
                    setUploadProgress(100);
                  setSummary(statusData.extractedDataSummary || null);
                  fetchArcData();
                    toast({ title: 'CV imported and processed!', description: 'CV imported and processed!' });
                  } else if (statusData.status === 'completed_with_errors') {
                    setUploadError('CV processed with errors: ' + (statusData.error || 'Unknown error'));
                    setSummary(statusData.extractedDataSummary || null);
                } else if (statusData.status === 'failed') {
                  setUploadError(statusData.error || 'CV extraction failed.');
                  }
                } else if (pollCount >= 20) { // ~1 minute
                  setPolling(false);
                  setUploadError('CV extraction timed out.');
                  clearInterval(interval);
                }
                pollCount++;
              } catch {
                setPolling(false);
                setUploadError('Failed to check CV extraction status.');
                clearInterval(interval);
              } finally {
                setUploading(false);
              }
            }, 3000); // poll every 3 seconds
          } else {
            setUploadError('Upload failed');
            setUploading(false);
          }
        }
      };
      xhr.send(formData);
    } catch (err: any) {
      setUploadError(err?.error || err?.message || 'Upload failed');
      setUploading(false);
    }
  };

  // Fetch Arc data and user profile
  const fetchArcData = async () => {
    setArcLoading(true);
    setArcError('');
    setProfileError('');
    try {
      const token = (typeof window !== 'undefined' ? localStorage.getItem('token') : '') || '';
      // Fetch the user's profile
      const userRes = await fetch(`${API_GATEWAY_BASE}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!userRes.ok) {
        setProfileError('User profile not found. Please complete your profile before using Career Ark.');
        setProfile(null);
        setArcData(null);
        return;
      }
      const user = await userRes.json();
      setProfile(user);
      // Fetch all sections using the userId
      const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${user.id}/all_sections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch Ark data');
      const data = await res.json();
      setArcData(data);
    } catch (err: any) {
      setArcError(err?.message || 'Failed to fetch Ark data');
    } finally {
      setArcLoading(false);
    }
  };
  useEffect(() => {
    fetchArcData();
  }, [token]);

  // Helper to get details array from item
  const getDetails = (item: any) => {
    if (Array.isArray(item.details) && item.details.length > 0) return item.details;
    if (typeof item.description === 'string' && item.description.trim().length > 0) {
      return item.description.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
  };

  const parseDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'Present') return new Date();
    // Try YYYY-MM or YYYY-MM-DD
    if (/^\d{4}-\d{2}/.test(dateStr)) return new Date(dateStr);
    // Try 'Jan 2020'
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const match = dateStr.match(/^(\w{3}) (\d{4})$/);
    if (match) return new Date(`${match[2]}-${(months.indexOf(match[1])+1).toString().padStart(2,'0')}-01`);
    return new Date(dateStr);
  };

  const sortByEndDate = (arr: any[]): any[] => {
    return [...arr].sort((a, b) => {
      const aDate = parseDate(a.end_date || a.start_date || '');
      const bDate = parseDate(b.end_date || b.start_date || '');
      return bDate.getTime() - aDate.getTime();
    });
  };

  // Defensive: Block modal opening if profile is missing
  const openAddModal = () => {
    if (!profile || !profile.id) {
      setFormError('Cannot add work experience: user profile is missing.');
      return;
    }
    setForm({ company: '', title: '', start_date: '', end_date: '', description: '' });
    setShowAddModal(true);
  };

  // Identifier banner for debugging
  const banner = (
    <div style={{ background: '#38bdf8', color: '#1e293b', padding: '8px', fontWeight: 'bold', textAlign: 'center', fontSize: '18px' }}>
      Career Ark Page 2 (Zen Design)
    </div>
  );

  const workExps = Array.isArray(arcData?.work_experience) ? arcData.work_experience : [];
  const uniqueMonths = getUniqueMonths(workExps);
  const totalYears = uniqueMonths.size > 0 ? (uniqueMonths.size / 12).toFixed(1) : '--';
  const totalRoles = workExps.length;
  const allSkills: string[] = [...new Set((workExps.flatMap((exp: any) => Array.isArray(exp.skills) ? exp.skills : [])) as string[])];

  return (
    <div className="min-h-screen bg-background">
      {banner}
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ position: 'relative' }}>
        {arcLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.7)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
        )}
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-card-foreground">Your Career Ark™</h1>
              <p className="text-lg text-muted-foreground mt-2">
                A complete, evolving record of your professional journey. Add, edit, and organize your experiences to power tailored applications.
              </p>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <Button 
              variant="default"
              className="gap-2"
              onClick={openAddModal}
              disabled={arcLoading || !profile || !profile.id}
            >
              <Plus className="h-4 w-4" />
              Add Work Experience
            </Button>
            <Dialog open={showAddModal || showEditModal} onOpenChange={(open) => { setShowAddModal(open && !editItem); setShowEditModal(open && !!editItem); if (!open) { setEditItem(null); setForm({ company: '', title: '', start_date: '', end_date: '', description: '' }); setFormError(''); } }}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editItem ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
                  <DialogDescription>
                    {editItem ? 'Update your experience details' : 'Add a new role to your Career Ark™'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setFormLoading(true); setFormError('');
                  try {
                    if (editItem) {
                      if (!editItem.id) throw new Error('Invalid experience ID');
                      await updateWorkExperience(editItem.id, { ...form, description: form.description.split('\n').filter(Boolean) });
                      setShowEditModal(false);
                    } else {
                      await addWorkExperience({ ...form, description: form.description.split('\n').filter(Boolean) });
                      setShowAddModal(false);
                    }
                    fetchArcData();
                    toast({ title: editItem ? 'Experience updated' : 'Experience added' });
                  } catch (err: any) {
                    setFormError(err.message || 'Save failed');
                  } finally {
                    setFormLoading(false);
                  }
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input id="title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Senior Software Engineer" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. Tech Corp Ltd." required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input id="start_date" type="month" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date</Label>
                      <Input id="end_date" type="month" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (one per line)</Label>
                    <Textarea id="description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your role and responsibilities..." rows={3} />
                  </div>
                  {formError && <div className="text-red-500 text-sm">{formError}</div>}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="submit" disabled={formLoading}>
                      {formLoading ? 'Saving...' : (editItem ? 'Update Experience' : 'Add Experience')}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditItem(null); setForm({ company: '', title: '', start_date: '', end_date: '', description: '' }); setFormError(''); }}>Cancel</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={handleUploadClick}
              disabled={uploading || polling}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? "Importing..." : "Import CV"}
            </Button>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={uploading || polling}
        />
          </div>
        </div>
        {/* Main content area */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Career Summary Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-primary" />
                  Career Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{totalYears}</div>
                    <div className="text-xs text-muted-foreground">Years Experience</div>
                  </div>
                  <div className="text-center p-3 bg-success/5 rounded-lg">
                    <div className="text-2xl font-bold text-success">{totalRoles}</div>
                    <div className="text-xs text-muted-foreground">Total Roles</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm">Top Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {allSkills.slice(0, 8).map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* AI Suggestions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-card-foreground">Add missing skills</p>
                      <p className="text-muted-foreground text-xs">Based on your roles, consider adding "Agile" and "Scrum"</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-secondary mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-card-foreground">Enhance descriptions</p>
                      <p className="text-muted-foreground text-xs">Add quantifiable achievements to recent roles</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Timeline area (to be migrated next) */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-card-foreground flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                Career Timeline
              </h2>
              {/* Timeline and experience cards */}
              <ScrollArea className="h-[600px] pr-4">
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
                  {Array.isArray(arcData?.work_experience) && arcData.work_experience.length > 0 ? (
                    sortByEndDate(arcData.work_experience).map((experience: any, index: number) => (
                      <div key={experience.id || index} className="relative flex gap-6 pb-8">
                        {/* Timeline Node */}
                        <div className="relative">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-glow">
                            <Building className="h-6 w-6 text-primary-foreground" />
                          </div>
                        </div>
                        {/* Experience Card */}
                        <Card className="flex-1 shadow-card hover:shadow-elevated transition-all duration-300">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <CardTitle className="text-xl text-card-foreground">{experience.title}</CardTitle>
                                <div className="flex items-center gap-4 text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Building className="h-4 w-4" />
                                    <span className="font-medium">{experience.company}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {experience.start_date} - {experience.end_date || 'Present'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    console.log('Editing work experience:', experience, 'start_date:', convertToMonthInput(experience.start_date), 'end_date:', convertToMonthInput(experience.end_date));
                                    setEditItem(experience);
                                    setForm({
                                      company: experience.company,
                                      title: experience.title,
                                      start_date: convertToMonthInput(experience.start_date),
                                      end_date: convertToMonthInput(experience.end_date),
                                      description:
                                        Array.isArray(experience.details)
                                          ? experience.details.join('\n')
                                          : Array.isArray(experience.description)
                                            ? experience.description.join('\n')
                                            : (experience.description || '')
                                    });
                                    setShowEditModal(true);
                                  }}
                                  className="gap-1"
                                >
                                  <Edit className="h-3 w-3" />
                                  Edit
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={async () => { setFormLoading(true); try { await deleteWorkExperience(experience.id); fetchArcData(); toast({ title: 'Deleted' }); } catch (err: any) { toast({ title: err.message || 'Delete failed' }); } finally { setFormLoading(false); } }}
                                  className="gap-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {Array.isArray(experience.description) && experience.description.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2 text-card-foreground">Key Achievements</h4>
                                <ul className="space-y-1">
                                  {experience.description.map((achievement: string, idx: number) => (
                                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                      {achievement}
                                    </li>
                        ))}
                      </ul>
                              </div>
                            )}
                            {Array.isArray(experience.skills) && experience.skills.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2 text-card-foreground">Skills & Technologies</h4>
                                <div className="flex flex-wrap gap-1">
                                  {experience.skills.map((skill: string) => (
                                    <Badge key={skill} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                ))
              ) : (
                    <div className="text-muted-foreground text-center py-8">No work experience found.</div>
                  )}
                </div>
              </ScrollArea>
              {/* Education Section */}
              <h2 className="text-2xl font-semibold text-card-foreground flex items-center gap-2 mt-12">
                <Award className="h-6 w-6 text-primary" />
                Education
              </h2>
              <div className="space-y-4 mt-4">
                {Array.isArray(arcData?.education) && arcData.education.length > 0 ? (
                  arcData.education.map((edu: any, idx: number) => (
                    <Card key={edu.id || idx} className="shadow-card">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-card-foreground">{edu.degree} @ {edu.institution}</CardTitle>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <Calendar className="h-4 w-4" />
                              <span>{edu.start_date} - {edu.end_date || 'Present'}</span>
                              {edu.field && <Badge variant="secondary" className="ml-2">{edu.field}</Badge>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => {
                              console.log('Editing education:', edu, 'start_date:', convertToMonthInput(edu.start_date), 'end_date:', convertToMonthInput(edu.end_date));
                              setEditEduItem(edu);
                              setEduForm({
                                institution: edu.institution,
                                degree: edu.degree,
                                field: edu.field || '',
                                start_date: convertToMonthInput(edu.start_date),
                                end_date: convertToMonthInput(edu.end_date),
                                description:
                                  Array.isArray(edu.details)
                                    ? edu.details.join('\n')
                                    : Array.isArray(edu.description)
                                      ? edu.description.join('\n')
                                      : (edu.description || '')
                              });
                              setShowEditEduModal(true);
                            }}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={async () => { setEduFormLoading(true); try { await deleteEducation(edu.id); fetchArcData(); toast({ title: 'Deleted' }); } catch (err: any) { toast({ title: err.message || 'Delete failed' }); } finally { setEduFormLoading(false); } }}>Delete</Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {Array.isArray(edu.description) && edu.description.length > 0 && (
                          <ul className="list-disc ml-6 text-muted-foreground text-sm">
                            {edu.description.map((desc: string, i: number) => (
                              <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    )}
                      </CardContent>
                    </Card>
                ))
              ) : (
                  <div className="text-muted-foreground text-center py-8">No education entries found.</div>
                )}
              </div>
              {/* Add/Edit Education Modal */}
              <Dialog open={showAddEduModal || showEditEduModal} onOpenChange={(open) => { setShowAddEduModal(open && !editEduItem); setShowEditEduModal(open && !!editEduItem); if (!open) { setEditEduItem(null); setEduForm({ institution: '', degree: '', field: '', start_date: '', end_date: '', description: '' }); setEduFormError(''); } }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editEduItem ? 'Edit Education' : 'Add New Education'}</DialogTitle>
                    <DialogDescription>
                      {editEduItem ? 'Update your education details' : 'Add a new education entry to your Career Ark™'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setEduFormLoading(true); setEduFormError('');
                    try {
                      if (editEduItem) {
                        if (!editEduItem.id) throw new Error('Invalid education ID');
                        await updateEducation(editEduItem.id, { ...eduForm, description: eduForm.description.split('\n').filter(Boolean) });
                        setShowEditEduModal(false);
                      } else {
                        await addEducation({ ...eduForm, description: eduForm.description.split('\n').filter(Boolean) });
                        setShowAddEduModal(false);
                      }
                      fetchArcData();
                      toast({ title: editEduItem ? 'Education updated' : 'Education added' });
                    } catch (err: any) {
                      setEduFormError(err.message || 'Save failed');
                    } finally {
                      setEduFormLoading(false);
                    }
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="degree">Degree</Label>
                        <Input id="degree" value={eduForm.degree} onChange={e => setEduForm(f => ({ ...f, degree: e.target.value }))} placeholder="e.g. BSc Computer Science" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution</Label>
                        <Input id="institution" value={eduForm.institution} onChange={e => setEduForm(f => ({ ...f, institution: e.target.value }))} placeholder="e.g. University of London" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="field">Field</Label>
                      <Input id="field" value={eduForm.field} onChange={e => setEduForm(f => ({ ...f, field: e.target.value }))} placeholder="e.g. Computer Science" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input id="start_date" type="month" value={eduForm.start_date} onChange={e => setEduForm(f => ({ ...f, start_date: e.target.value }))} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_date">End Date</Label>
                        <Input id="end_date" type="month" value={eduForm.end_date} onChange={e => setEduForm(f => ({ ...f, end_date: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (one per line)</Label>
                      <Textarea id="description" value={eduForm.description} onChange={e => setEduForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your studies, achievements, etc..." rows={3} />
                    </div>
                    {eduFormError && <div className="text-red-500 text-sm">{eduFormError}</div>}
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="submit" disabled={eduFormLoading}>
                        {eduFormLoading ? 'Saving...' : (editEduItem ? 'Update Education' : 'Add Education')}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => { setShowAddEduModal(false); setShowEditEduModal(false); setEditEduItem(null); setEduForm({ institution: '', degree: '', field: '', start_date: '', end_date: '', description: '' }); setEduFormError(''); }}>Cancel</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerArkV2; 