import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Stack, Divider, Alert, TextField, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, CircularProgress } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import { generateApplicationMaterials, listCVTasks, downloadProcessedCV, deleteCVTask, getArcData } from '../api/careerArkApi';

const DownloadApplication: React.FC = () => {
  // State for generation
  const [jobAdvert, setJobAdvert] = useState('');
  const [genResult, setGenResult] = useState<any>(null);
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState('');
  // State for CV tasks
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [taskError, setTaskError] = useState('');
  const [downloadingTaskId, setDownloadingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  // Clipboard
  const [copyMsg, setCopyMsg] = useState('');

  // Generate application
  const handleGenerate = async () => {
    setGenError(''); setGenResult(null); setGenLoading(true);
    try {
      // Always fetch the latest Arc data before generating
      const arcData = await getArcData();
      const res = await generateApplicationMaterials(jobAdvert, arcData);
      setGenResult(res);
    } catch (err: any) {
      setGenError(err?.error || err?.message || 'Failed to generate application');
    } finally {
      setGenLoading(false);
    }
  };

  // List CV tasks
  const handleListTasks = async () => {
    setTaskError(''); setTasksLoading(true);
    try {
      const res = await listCVTasks();
      setTasks(Array.isArray(res) ? res : (res.tasks || []));
    } catch (err: any) {
      setTaskError(err?.error || err?.message || 'Failed to list CV tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  // Download processed CV
  const handleDownloadCV = async (taskId: string, filename = 'cv.pdf') => {
    setDownloadingTaskId(taskId);
    try {
      const blob = await downloadProcessedCV(taskId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setTaskError('Failed to download CV');
    } finally {
      setDownloadingTaskId(null);
    }
  };

  // Delete CV task
  const handleDeleteTask = async (taskId: string) => {
    setDeletingTaskId(taskId);
    try {
      await deleteCVTask(taskId);
      setTasks(tasks => tasks.filter(t => t.taskId !== taskId));
    } catch (err) {
      setTaskError('Failed to delete task');
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyMsg('Copied!');
    setTimeout(() => setCopyMsg(''), 1500);
  };

  return (
    <Box sx={{ py: 6, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={4} sx={{ p: 5, mb: 6 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom align="center">
          Download Application Materials
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Stack spacing={3}>
          <Typography variant="h6">Generate New Application</Typography>
          <TextField label="Job Advert" value={jobAdvert} onChange={e => setJobAdvert(e.target.value)} fullWidth multiline minRows={3} />
          <Button variant="contained" onClick={handleGenerate} disabled={genLoading}>
            {genLoading ? <CircularProgress size={22} /> : 'Generate CV & Cover Letter'}
          </Button>
          {genError && <Alert severity="error">{genError}</Alert>}
          {genResult && (
            <Stack spacing={4}>
              <Paper elevation={3} sx={{ p: 4, mb: 2, background: 'linear-gradient(135deg, #f5f7fa 0%, #e3eafc 100%)', borderRadius: 3, boxShadow: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h5" fontWeight={700} color="primary.main">Generated CV</Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      startIcon={<FileDownloadIcon />}
                      onClick={() => {
                        const blob = new Blob([genResult.cv], { type: 'text/plain' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'cv.txt';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                      }}
                    >
                      Download TXT
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PictureAsPdfIcon />}
                      onClick={() => {
                        const blob = new Blob([genResult.cv], { type: 'application/pdf' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'cv.pdf';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                      }}
                    >
                      Download PDF
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DescriptionIcon />}
                      onClick={() => {
                        const blob = new Blob([genResult.cv], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'cv.docx';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                      }}
                    >
                      Download DOCX
                    </Button>
                    <IconButton onClick={() => handleCopy(genResult.cv)}><ContentCopyIcon /></IconButton>
                  </Stack>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ whiteSpace: 'pre-wrap', fontFamily: 'serif', fontSize: 17, color: 'text.primary', minHeight: 180 }}>
                  {genResult.cv}
                </Box>
              </Paper>
              <Paper elevation={3} sx={{ p: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #fceabb 100%)', borderRadius: 3, boxShadow: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                  <Typography variant="h5" fontWeight={700} color="secondary.main">Generated Cover Letter</Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      startIcon={<FileDownloadIcon />}
                      onClick={() => {
                        const blob = new Blob([genResult.coverLetter], { type: 'text/plain' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'cover_letter.txt';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                      }}
                    >
                      Download TXT
                    </Button>
                    <IconButton onClick={() => handleCopy(genResult.coverLetter)}><ContentCopyIcon /></IconButton>
                  </Stack>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ whiteSpace: 'pre-wrap', fontFamily: 'serif', fontSize: 17, color: 'text.primary', minHeight: 180 }}>
                  {genResult.coverLetter}
                </Box>
              </Paper>
            </Stack>
          )}
        </Stack>
        <Divider sx={{ my: 4 }} />
        <Stack spacing={3}>
          <Typography variant="h6">Your CV Tasks</Typography>
          <Button variant="outlined" onClick={handleListTasks} disabled={tasksLoading}>
            {tasksLoading ? <CircularProgress size={22} /> : 'List All CV Tasks'}
          </Button>
          {taskError && <Alert severity="error">{taskError}</Alert>}
          <List>
            {tasks.map((task) => (
              <ListItem key={task.taskId} divider>
                <ListItemText
                  primary={`Task ID: ${task.taskId}`}
                  secondary={`Status: ${task.status}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleDownloadCV(task.taskId, `cv_${task.taskId}.pdf`)} disabled={downloadingTaskId === task.taskId}>
                    <FileDownloadIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeleteTask(task.taskId)} disabled={deletingTaskId === task.taskId}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Paper>
    </Box>
  );
};

export default DownloadApplication; 