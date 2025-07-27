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

  const sortByEndDate = (arr: any[]): any[] => {
    return [...arr].sort((a, b) => {
      const aDate = a.end_date || a.start_date || '';
      const bDate = b.end_date || b.start_date || '';
      return bDate.localeCompare(aDate);
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

  return (
    <div className="min-h-screen bg-background">
      {banner}
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          {/* Action Buttons will go here in the next step */}
        </div>
        {/* Main content will be migrated next */}
      </div>
    </div>
  );
};

export default CareerArkV2; 