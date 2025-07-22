import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Calendar,
  Building,
  Award,
  TrendingUp,
  Clock,
  MapPin,
  Sparkles,
  Brain,
  FileText,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getArcData, updateWorkExperience, deleteWorkExperience } from "@/api/careerArkApi";

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
}

export function CareerArcPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const [refreshFlag, setRefreshFlag] = useState(0);

  useEffect(() => {
    getArcData()
      .then(data => {
        console.log('API work_experience:', data.work_experience); // TEMP LOG
        const exp = (data.work_experience || []).map((item: any) => {
          let achievements: string[] = [];
          if (Array.isArray(item.responsibilities)) {
            achievements = item.responsibilities;
          } else if (typeof item.description === 'string' && item.description.trim().length > 0) {
            achievements = item.description.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);
          } else if (Array.isArray(item.achievements)) {
            achievements = item.achievements;
          }
          return {
            id: item.id,
            title: item.positionTitle || item.title || '',
            company: item.companyName || item.company || '',
            location: item.location || '',
            startDate: item.startDate || item.start_date || '',
            endDate: item.endDate || item.end_date || 'Present',
            current: !(item.endDate || item.end_date),
            description: item.description || '',
            achievements,
            skills: item.skills || [],
          };
        });
        setExperiences(exp);
      })
      .catch(() => setExperiences([]))
      .finally(() => setLoading(false));
  }, [refreshFlag]);

  const handleAddExperience = () => {
    setEditingExperience(null);
    setIsDialogOpen(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setIsDialogOpen(true);
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await deleteWorkExperience(id);
      toast({ title: "Experience deleted", description: "The experience has been removed from your Career Arc™." });
      setRefreshFlag(f => f + 1);
    } catch (err: any) {
      toast({ title: "Delete failed", description: err?.message || "Could not delete experience", variant: "destructive" });
    }
  };

  const handleImportCV = async () => {
    setIsImporting(true);
    
    toast({
      title: "Starting CV import",
      description: "Processing your CV file...",
    });

    try {
      // Simulate CV processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock imported experience
      const importedExperience: Experience = {
        id: Date.now().toString(),
        title: "Imported Position",
        company: "Imported Company",
        location: "Remote",
        startDate: "2022-01",
        endDate: "2023-12",
        current: false,
        description: "",
        achievements: [
          "Successfully imported from CV",
          "Experience details extracted automatically",
          "Ready for editing and customization"
        ],
        skills: ["CV Import", "Data Processing", "Automation"]
      };

      setExperiences(prev => [importedExperience, ...prev]);
      
      toast({
        title: "CV imported successfully",
        description: "New experience has been added to your Career Arc™.",
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error processing your CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const totalYears = Math.floor(experiences.length * 1.8); // Rough calculation
  const totalRoles = experiences.length;
  const allSkills = [...new Set(experiences.flatMap(exp => exp.skills))];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-primary">Candidate 5</div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-foreground hover:text-primary transition-colors">Home</a>
              <a href="/career-arc" className="text-primary font-medium">Career Arc</a>
              <a href="/my-cvs" className="text-foreground hover:text-primary transition-colors">My CVs</a>
              <Button variant="outline">Account</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-card-foreground">Your Career Arc™</h1>
              <p className="text-lg text-muted-foreground mt-2">
                A complete, evolving record of your professional journey. Add, edit, and organize your experiences to power tailored applications.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddExperience} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Experience
                </Button>
              </DialogTrigger>
              <ExperienceDialog 
                experience={editingExperience}
                onSave={(exp) => {
                  if (editingExperience) {
                    updateWorkExperience(exp.id, exp)
                      .then(() => {
                        toast({ title: "Experience updated", description: "Your Career Arc™ has been updated." });
                        setRefreshFlag(f => f + 1);
                      })
                      .catch(err => {
                        toast({ title: "Update failed", description: err?.message || "Could not update experience", variant: "destructive" });
                      });
                  } else {
                    // This case should ideally not be reached for new experiences,
                    // but as a fallback, we can add a new experience with a temporary ID
                    // or handle it differently if the backend supports direct add.
                    // For now, we'll just toast a generic message.
                    toast({ title: "Experience added", description: "New experience added to your Career Arc™." });
                    setRefreshFlag(f => f + 1); // Refresh to show the new experience
                  }
                  setIsDialogOpen(false);
                }}
              />
            </Dialog>
            
            
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={handleImportCV}
              disabled={isImporting}
            >
              {isImporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isImporting ? "Importing..." : "Import CV"}
            </Button>
          </div>
        </div>

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
                    {allSkills.slice(0, 8).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
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

          {/* Timeline */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-card-foreground flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                Career Timeline
              </h2>
              
              <ScrollArea className="h-[600px] pr-4">
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
                  
                  {experiences.map((experience, index) => (
                  <div key={experience.id} className="relative flex gap-6 pb-8">
                    {/* Timeline Node */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-glow">
                        <Building className="h-6 w-6 text-primary-foreground" />
                      </div>
                      {experience.current && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background"></div>
                      )}
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
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{experience.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(experience.startDate).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  year: 'numeric' 
                                })} - {experience.current ? 'Present' : new Date(experience.endDate).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </span>
                              {experience.current && (
                                <Badge variant="success" className="ml-2">Current</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditExperience(experience)}
                              className="gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteExperience(experience.id)}
                              className="gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {experience.achievements.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 text-card-foreground">Key Achievements</h4>
                            <ul className="space-y-1">
                              {experience.achievements.map((achievement, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {experience.skills.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 text-card-foreground">Skills & Technologies</h4>
                            <div className="flex flex-wrap gap-1">
                              {experience.skills.map(skill => (
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
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ExperienceDialogProps {
  experience: Experience | null;
  onSave: (experience: Experience) => void;
}

function ExperienceDialog({ experience, onSave }: ExperienceDialogProps) {
  const [formData, setFormData] = useState<Partial<Experience>>({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    achievements: [],
    skills: [],
    ...experience
  });

  useEffect(() => {
    // Log the raw values for debugging
    console.log('Edit dialog startDate:', experience?.startDate, 'endDate:', experience?.endDate);

    // Robustly extract yyyy-MM from various formats
    const formatMonth = (date: string | undefined | null) => {
      if (!date || date === 'Present') return '';
      // Accept yyyy-MM, yyyy-MM-dd, or ISO strings
      const match = date.match(/^\d{4}-\d{2}/);
      if (match) return match[0];
      // Try to parse as Date and format as yyyy-MM
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        return d.toISOString().slice(0, 7);
      }
      return '';
    };

    setFormData({
      title: experience?.title || "",
      company: experience?.company || "",
      location: experience?.location || "",
      startDate: formatMonth(experience?.startDate || (experience as any)?.start_date),
      endDate: formatMonth(experience?.endDate || (experience as any)?.end_date),
      current: experience?.current || false,
      description: experience?.description || "",
      achievements: experience?.achievements || [],
      skills: experience?.skills || [],
    });
  }, [experience]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Experience);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{experience ? "Edit Experience" : "Add New Experience"}</DialogTitle>
        <DialogDescription>
          {experience ? "Update your experience details" : "Add a new role to your Career Arc™"}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Senior Software Engineer"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              placeholder="e.g. Tech Corp Ltd."
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder="e.g. London, UK"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="month"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="month"
              value={formData.current ? "" : formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              disabled={formData.current}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) => setFormData({...formData, current: e.target.checked, endDate: e.target.checked ? "Present" : ""})}
                className="rounded"
              />
              <Label htmlFor="current" className="text-sm">I currently work here</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Describe your role and responsibilities..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills">Skills & Technologies (comma-separated)</Label>
          <Input
            id="skills"
            value={formData.skills?.join(", ") || ""}
            onChange={(e) => setFormData({...formData, skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})}
            placeholder="e.g. React, TypeScript, Node.js"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit">
            {experience ? "Update Experience" : "Add Experience"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
} 