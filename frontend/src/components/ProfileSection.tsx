import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  Stack,
  Alert,
  AlertIcon,
  useToast,
  Spinner,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { EditIcon, CheckIcon } from '@chakra-ui/icons';
import { getUser, updateUser, sendVerificationEmail, changePassword, deleteAccount } from '../api';
import { useNavigate } from 'react-router-dom';

const ProfileSection: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const toast = useToast();
  const token = localStorage.getItem('token') || '';
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Phone validation regex for E.164 format
  const phoneRegex = /^\+\d{10,15}$/;
  const isPhoneValid = !form.phone || phoneRegex.test(form.phone);

  useEffect(() => {
    setLoading(true);
    getUser(token)
      .then((data) => {
        setUser(data);
        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
        });
        setError('');
      })
      .catch((err) => setError(err.message || 'Failed to load user info'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleEdit = () => {
    setEditMode(true);
    setError('');
  };
  const handleCancel = () => {
    setEditMode(false);
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setError('');
    setSuccess('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    if (!isPhoneValid) {
      setError('Phone number must be in international format, e.g. +447966461005');
      setSaving(false);
      return;
    }
    try {
      const updated = await updateUser(form, token);
      setUser(updated.user || updated);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      toast({ status: 'success', title: 'Profile updated' });
    } catch (err: any) {
      setError(err?.error || err?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleResendVerification = async () => {
    setVerifying(true);
    setError('');
    try {
      await sendVerificationEmail(token);
      toast({ status: 'info', title: 'Verification email sent' });
    } catch (err: any) {
      setError(err?.error || err?.message || 'Failed to send verification email');
    } finally {
      setVerifying(false);
    }
  };

  // Password change logic
  const handlePasswordChange = async () => {
    setPwError('');
    setPwSuccess('');
    if (!passwords.new || passwords.new !== passwords.confirm) {
      setPwError('Passwords do not match');
      return;
    }
    try {
      await changePassword(passwords.current, passwords.new, token);
      setPwSuccess('Password changed successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
      setShowPasswordModal(false);
      toast({ status: 'success', title: 'Password changed' });
    } catch (err: any) {
      setPwError(err?.error || err?.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteAccount(token);
      toast({ status: 'success', title: 'Account deleted' });
      localStorage.removeItem('token');
      navigate('/');
    } catch (err: any) {
      setDeleteError(err?.error || err?.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <Box bg="white" boxShadow="md" borderRadius="lg" p={6} mb={6} maxW="500px" mx="auto">
      <Heading as="h3" size="md" mb={4} textAlign="center">
        Profile
      </Heading>
      <form>
        <Stack spacing={4}>
          <FormControl isDisabled={!editMode} isRequired>
            <FormLabel fontSize="md">Name</FormLabel>
            <Input name="name" value={form.name} onChange={handleChange} disabled={!editMode} fontSize="md" />
          </FormControl>
          <FormControl isDisabled={!editMode} isRequired>
            <FormLabel fontSize="md">Email</FormLabel>
            <Input name="email" value={form.email} onChange={handleChange} disabled={!editMode} fontSize="md" />
            <HStack mt={2}>
              <Text fontSize="sm" color={user?.email_verified ? 'green.600' : 'orange.500'}>
                {user?.email_verified ? 'Verified' : 'Not Verified'}
              </Text>
              {!user?.email_verified && (
                <Button size="xs" onClick={handleResendVerification} isLoading={verifying} fontSize="sm">
                  Resend Verification
                </Button>
              )}
            </HStack>
          </FormControl>
          <FormControl isDisabled={!editMode} isInvalid={!isPhoneValid}>
            <FormLabel fontSize="md">Phone</FormLabel>
            <Input name="phone" value={form.phone} onChange={handleChange} disabled={!editMode} fontSize="md" />
            <Text fontSize="xs" color="gray.500">Phone must be in international format, e.g. +447966461005</Text>
            {!isPhoneValid && (
              <Text fontSize="xs" color="red.500">Phone number must be in international format, e.g. +447966461005</Text>
            )}
          </FormControl>
          <HStack spacing={2} wrap="wrap" justify="center">
            {!editMode ? (
              <Button leftIcon={<EditIcon />} onClick={handleEdit} colorScheme="blue" size="md" fontSize="md">
                Edit
              </Button>
            ) : (
              <>
                <Button leftIcon={<CheckIcon />} onClick={handleSave} colorScheme="green" isLoading={saving} size="md" fontSize="md">
                  Save
                </Button>
                <Button onClick={handleCancel} colorScheme="gray" variant="outline" size="md" fontSize="md">
                  Cancel
                </Button>
              </>
            )}
            <Button onClick={() => setShowPasswordModal(true)} colorScheme="blue" variant="outline" size="md" fontSize="md">
              Change Password
            </Button>
            <Button onClick={() => setShowDeleteModal(true)} colorScheme="red" variant="solid" size="md" fontSize="md">
              Delete Account
            </Button>
          </HStack>
          {error && <Alert status="error"><AlertIcon />{error}</Alert>}
          {success && <Alert status="success"><AlertIcon />{success}</Alert>}
          {deleteError && <Alert status="error"><AlertIcon />{deleteError}</Alert>}
        </Stack>
      </form>
      {/* Change Password Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <FormControl isRequired>
                <FormLabel fontSize="md">Current Password</FormLabel>
                <Input
                  type="password"
                  value={passwords.current}
                  onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                  fontSize="md"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="md">New Password</FormLabel>
                <Input
                  type="password"
                  value={passwords.new}
                  onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))}
                  fontSize="md"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="md">Confirm New Password</FormLabel>
                <Input
                  type="password"
                  value={passwords.confirm}
                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  fontSize="md"
                />
              </FormControl>
              {pwError && <Alert status="error"><AlertIcon />{pwError}</Alert>}
              {pwSuccess && <Alert status="success"><AlertIcon />{pwSuccess}</Alert>}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePasswordChange} fontSize="md">
              Change Password
            </Button>
            <Button variant="ghost" onClick={() => setShowPasswordModal(false)} fontSize="md">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Delete Account Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete your account? This action cannot be undone.</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteAccount} isLoading={deleting} fontSize="md">
              Delete
            </Button>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)} fontSize="md">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProfileSection; 