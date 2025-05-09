import React, { useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  Text,
  Heading,
  useBreakpointValue,
  VStack,
  HStack,
  Avatar,
  Divider,
  Input,
  Textarea,
  Button,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, CheckIcon, CloseIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';

// Mock data
const user = {
  name: 'John Smith',
  address: '123 Elm Street, Springfield, SP1 2AB',
  phone: '+44 7000 000000',
  dob: '6 Mar 1984',
  email: 'john.smith@email.com',
};

const career = [
  {
    type: 'job',
    title: 'Project Manager',
    org: 'Royal Bank of Scotland',
    date: 'June 2020 – Sept 2022',
    details: [
      'Managed multiple projects simultaneously through the entire lifecycle',
      'Led cross-functional teams to deliver projects on time and within budget',
      'Developed project plans, schedules, and budgets',
      'Collaborated with stakeholders to define project requirements',
    ],
  },
  {
    type: 'job',
    title: 'Business Analyst',
    org: 'Lloyds Bank',
    date: 'Jan 2017 – May 2020',
    details: [
      'Analyzed business processes and identified improvement opportunities',
      'Facilitated requirements gathering and documentation',
    ],
  },
  {
    type: 'job',
    title: 'Finance Assistant',
    org: 'BW Finance',
    date: 'Jul 2012 – Dec 2016',
    details: [
      'Processed invoices and managed accounts payable',
      'Assisted with monthly financial reporting',
    ],
  },
  {
    type: 'education',
    title: 'Manchester University',
    org: 'BEng – Mechanical Engineering',
    date: '2002 – 2005',
    details: ['Graduated with honors'],
  },
  {
    type: 'training',
    title: 'Leadership Course',
    org: '',
    date: 'April 2021',
    details: ['Completed leadership development program'],
  },
];

const sectionTitles = {
  job: 'Career History',
  education: 'Education',
  training: 'Training',
};

const CareerHistory: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [careerData, setCareerData] = useState([...career]);
  const [addSection, setAddSection] = useState<null | keyof typeof sectionTitles>(null);
  const [addData, setAddData] = useState<any>({ title: '', org: '', date: '', details: [''] });
  const bg = '#f5f5f5';
  const leftPaneWidth = useBreakpointValue({ base: '100%', md: '30%' });
  const rightPaneWidth = useBreakpointValue({ base: '100%', md: '70%' });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { idx = '' } = useParams();

  // Group items by type for left pane
  const grouped = careerData.reduce((acc, item, idx) => {
    acc[item.type] = acc[item.type] || [];
    acc[item.type].push({ ...item, idx });
    return acc;
  }, {} as Record<string, any[]>);

  // Handlers for editing
  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setEditData({ ...careerData[idx], details: [...careerData[idx].details] });
  };
  const handleEditChange = (field: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };
  const handleEditDetailChange = (i: number, value: string) => {
    setEditData((prev: any) => {
      const details = [...prev.details];
      details[i] = value;
      return { ...prev, details };
    });
  };
  const handleSaveEdit = () => {
    setCareerData((prev) => prev.map((item, idx) => (idx === editIdx ? { ...editData } : item)));
    setEditIdx(null);
    setEditData(null);
    toast({ status: 'success', title: 'Entry updated' });
  };
  const handleCancelEdit = () => {
    setEditIdx(null);
    setEditData(null);
  };
  const handleDelete = (idx: number) => {
    setCareerData((prev) => prev.filter((_, i) => i !== idx));
    if (selectedIdx === idx) setSelectedIdx(0);
    toast({ status: 'info', title: 'Entry deleted' });
  };

  // Handlers for adding
  const handleAdd = (section: keyof typeof sectionTitles) => {
    setAddSection(section);
    setAddData({ title: '', org: '', date: '', details: [''] });
  };
  const handleAddChange = (field: string, value: any) => {
    setAddData((prev: any) => ({ ...prev, [field]: value }));
  };
  const handleAddDetailChange = (i: number, value: string) => {
    setAddData((prev: any) => {
      const details = [...prev.details];
      details[i] = value;
      return { ...prev, details };
    });
  };
  const handleAddDetailRow = () => {
    setAddData((prev: any) => ({ ...prev, details: [...prev.details, ''] }));
  };
  const handleSaveAdd = () => {
    setCareerData((prev) => [
      ...prev,
      { ...addData, type: addSection, idx: prev.length },
    ]);
    setAddSection(null);
    setAddData({ title: '', org: '', date: '', details: [''] });
    toast({ status: 'success', title: 'Entry added' });
  };
  const handleCancelAdd = () => {
    setAddSection(null);
    setAddData({ title: '', org: '', date: '', details: [''] });
  };

  // Mobile: show detail view if idx param is present, else show list
  if (isMobile) {
    if (idx) {
      // Show detail view
      const parsedIdx = parseInt(idx, 10);
      const entry = careerData[parsedIdx];
      if (!entry) return <Box p={4}>Not found</Box>;
      return (
        <Box minH="100vh" bg="white" p={4}>
          <Button mb={4} size="sm" leftIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} colorScheme="blue">Back</Button>
          {editIdx === parsedIdx ? (
            <Box>
              <Input value={editData.title} onChange={e => handleEditChange('title', e.target.value)} mb={1} fontWeight="bold" fontSize="lg" />
              <Input value={editData.org} onChange={e => handleEditChange('org', e.target.value)} mb={1} />
              <Input value={editData.date} onChange={e => handleEditChange('date', e.target.value)} mb={2} />
              <Divider mb={4} />
              <VStack align="start" spacing={3}>
                {editData.details.map((d: string, i: number) => (
                  <TextareaAutosize
                    key={i}
                    value={d}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleEditDetailChange(i, e.target.value)}
                    minRows={1}
                    style={{ width: '100%', marginBottom: 8 }}
                  />
                ))}
              </VStack>
              <Button size="xs" leftIcon={<AddIcon />} onClick={() => handleEditChange('details', [...editData.details, ''])} mb={1} mt={2}>Add Detail</Button>
              <HStack mt={4}>
                <Button size="sm" colorScheme="green" leftIcon={<CheckIcon />} onClick={handleSaveEdit}>Save</Button>
                <Button size="sm" colorScheme="gray" leftIcon={<CloseIcon />} onClick={handleCancelEdit}>Cancel</Button>
              </HStack>
            </Box>
          ) : (
            <Box>
              <Heading size="lg" mb={1}>{entry.title}</Heading>
              {entry.org && <Text fontWeight="semibold" color="gray.700" mb={1}>{entry.org}</Text>}
              <Text fontSize="sm" color="gray.500" mb={4}>{entry.date}</Text>
              <Divider mb={4} />
              <VStack align="start" spacing={3}>
                {entry.details.map((d: string, i: number) => (
                  <Text as="li" key={i} ml={4} fontSize="md">{d}</Text>
                ))}
              </VStack>
            </Box>
          )}
        </Box>
      );
    } else {
      // Show list view
      return (
        <Box minH="100vh" bg={bg}>
          <Box as="header" w="100%" bg="brand.100" px={4} py={3} boxShadow="sm" borderBottom="2px solid #e2e8f0" position="fixed" top="64px" zIndex={10}>
            <Grid templateColumns="1fr" gap={4} alignItems="center">
              <Box>
                <Heading size="md">{user.name}</Heading>
                <Text fontSize="sm">{user.address}</Text>
                <Text fontSize="sm">{user.phone}</Text>
              </Box>
              <Box textAlign="left">
                <Text fontWeight="bold" as="span">DOB: </Text>
                <Text as="span" fontSize="sm">{user.dob}</Text>
                <br />
                <Text fontWeight="bold" as="span">Email: </Text>
                <Text as="span" fontSize="sm">{user.email}</Text>
              </Box>
            </Grid>
          </Box>
          <Box pt="112px" maxW="600px" mx="auto">
            {(['job', 'education', 'training'] as const).map((section) =>
              grouped[section] ? (
                <Box key={section} mb={6}>
                  <HStack justify="space-between" align="center" mb={2} pl={4}>
                    <Text fontWeight="bold" fontSize="lg" color="brand.400" style={{ minHeight: 32, display: 'flex', alignItems: 'center' }}>{sectionTitles[section]}</Text>
                    <IconButton aria-label={`Add ${section}`} icon={<AddIcon />} size="sm" onClick={() => handleAdd(section)} />
                  </HStack>
                  <VStack spacing={1} align="stretch">
                    {grouped[section].map((item) => (
                      <Box
                        key={item.idx}
                        p={2}
                        pl={8}
                        borderRadius="md"
                        bg={selectedIdx === item.idx ? 'brand.100' : 'transparent'}
                        _hover={{ bg: selectedIdx === item.idx ? 'brand.100' : 'brand.200', cursor: 'pointer' }}
                        onClick={() => navigate(`/career-history/${item.idx}`)}
                        tabIndex={0}
                        aria-selected={selectedIdx === item.idx}
                        textAlign="left"
                      >
                        <HStack justify="space-between">
                          <Box>
                            <Text fontWeight="semibold">{item.title}</Text>
                            <Text fontSize="sm" color="gray.600">{item.org}</Text>
                            <Text fontSize="xs" color="gray.500">{item.date}</Text>
                          </Box>
                          <HStack>
                            <IconButton aria-label="Edit" icon={<EditIcon />} size="xs" variant="ghost" colorScheme="blue" onClick={e => { e.stopPropagation(); handleEdit(item.idx); navigate(`/career-history/${item.idx}?edit=1`); }} />
                            <IconButton aria-label="Delete" icon={<DeleteIcon />} size="xs" variant="ghost" colorScheme="red" onClick={e => { e.stopPropagation(); handleDelete(item.idx); }} />
                          </HStack>
                        </HStack>
                      </Box>
                    ))}
                    {addSection === section && (
                      <Box p={2} pl={8} borderRadius="md" bg="brand.50">
                        <Input placeholder="Title" value={addData.title} onChange={e => handleAddChange('title', e.target.value)} mb={1} />
                        <Input placeholder="Organisation/Institution" value={addData.org} onChange={e => handleAddChange('org', e.target.value)} mb={1} />
                        <Input placeholder="Date" value={addData.date} onChange={e => handleAddChange('date', e.target.value)} mb={1} />
                        {addData.details.map((d: string, i: number) => (
                          <TextareaAutosize
                            key={i}
                            placeholder="Detail"
                            value={d}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleAddDetailChange(i, e.target.value)}
                            minRows={1}
                            style={{ width: '100%', marginBottom: 8 }}
                          />
                        ))}
                        <Button size="xs" leftIcon={<AddIcon />} onClick={handleAddDetailRow} mb={1}>Add Detail</Button>
                        <HStack mt={2}>
                          <Button size="xs" colorScheme="green" leftIcon={<CheckIcon />} onClick={handleSaveAdd}>Save</Button>
                          <Button size="xs" colorScheme="gray" leftIcon={<CloseIcon />} onClick={handleCancelAdd}>Cancel</Button>
                        </HStack>
                      </Box>
                    )}
                  </VStack>
                </Box>
              ) : null
            )}
          </Box>
        </Box>
      );
    }
  }

  return (
    <Box minH="100vh" bg={bg}>
      {/* Header */}
      <Box
        as="header"
        w="100%"
        bg="brand.100"
        px={{ base: 4, md: 8 }}
        py={3}
        boxShadow="sm"
        borderBottom="2px solid #e2e8f0"
        position="fixed"
        top="64px"
        zIndex={10}
      >
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} alignItems="center">
          <Box>
            <Heading size="md">{user.name}</Heading>
            <Text fontSize="sm">{user.address}</Text>
            <Text fontSize="sm">{user.phone}</Text>
          </Box>
          <Box textAlign={{ base: 'left', md: 'right' }}>
            <Text fontWeight="bold" as="span">DOB: </Text>
            <Text as="span" fontSize="sm">{user.dob}</Text>
            <br />
            <Text fontWeight="bold" as="span">Email: </Text>
            <Text as="span" fontSize="sm">{user.email}</Text>
          </Box>
        </Grid>
      </Box>

      {/* Main Content */}
      <Flex
        pt="112px"
        direction={{ base: 'column', md: 'row' }}
        h="calc(100vh - 80px)"
        maxW="1200px"
        mx="auto"
      >
        {/* Left Pane */}
        <Box
          w={leftPaneWidth}
          minW={{ md: '250px' }}
          maxW={{ md: '350px' }}
          borderRight={{ md: '2px solid #b3ccff', base: 'none' }}
          bg={{ base: bg, md: 'white' }}
          overflowY="auto"
          h={{ base: 'auto', md: '100vh' }}
          mb={{ base: 4, md: 0 }}
        >
          {(['job', 'education', 'training'] as const).map((section) =>
            grouped[section] ? (
              <Box key={section} mb={6}>
                <HStack justify="space-between" align="center" mb={2} pl={4}>
                  <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color="brand.400"
                    style={{ minHeight: 32, display: 'flex', alignItems: 'center' }}
                  >
                    {sectionTitles[section]}
                  </Text>
                  <IconButton
                    aria-label={`Add ${section}`}
                    icon={<AddIcon />}
                    size="sm"
                    onClick={() => handleAdd(section)}
                  />
                </HStack>
                <VStack spacing={1} align="stretch">
                  {grouped[section].map((item) => (
                    <Box
                      key={item.idx}
                      p={2}
                      pl={8}
                      borderRadius="md"
                      bg={selectedIdx === item.idx ? 'brand.100' : 'transparent'}
                      _hover={{ bg: selectedIdx === item.idx ? 'brand.100' : 'brand.200', cursor: 'pointer' }}
                      onClick={() => setSelectedIdx(item.idx)}
                      tabIndex={0}
                      aria-selected={selectedIdx === item.idx}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setSelectedIdx(item.idx);
                      }}
                      textAlign="left"
                    >
                      <HStack justify="space-between">
                        <Box>
                          <Text fontWeight="semibold">{item.title}</Text>
                          <Text fontSize="sm" color="gray.600">{item.org}</Text>
                          <Text fontSize="xs" color="gray.500">{item.date}</Text>
                        </Box>
                        <HStack>
                          <IconButton
                            aria-label="Edit"
                            icon={<EditIcon />}
                            size="xs"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={(e) => { e.stopPropagation(); handleEdit(item.idx); }}
                          />
                          <IconButton
                            aria-label="Delete"
                            icon={<DeleteIcon />}
                            size="xs"
                            variant="ghost"
                            colorScheme="red"
                            onClick={(e) => { e.stopPropagation(); handleDelete(item.idx); }}
                          />
                        </HStack>
                      </HStack>
                    </Box>
                  ))}
                  {addSection === section && (
                    <Box p={2} pl={8} borderRadius="md" bg="brand.50">
                      <Input
                        placeholder="Title"
                        value={addData.title}
                        onChange={e => handleAddChange('title', e.target.value)}
                        mb={1}
                      />
                      <Input
                        placeholder="Organisation/Institution"
                        value={addData.org}
                        onChange={e => handleAddChange('org', e.target.value)}
                        mb={1}
                      />
                      <Input
                        placeholder="Date"
                        value={addData.date}
                        onChange={e => handleAddChange('date', e.target.value)}
                        mb={1}
                      />
                      {addData.details.map((d: string, i: number) => (
                        <TextareaAutosize
                          key={i}
                          placeholder="Detail"
                          value={d}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleAddDetailChange(i, e.target.value)}
                          minRows={1}
                          style={{ width: '100%', marginBottom: 8 }}
                        />
                      ))}
                      <Button size="xs" leftIcon={<AddIcon />} onClick={handleAddDetailRow} mb={1}>
                        Add Detail
                      </Button>
                      <HStack mt={2}>
                        <Button size="xs" colorScheme="green" leftIcon={<CheckIcon />} onClick={handleSaveAdd}>
                          Save
                        </Button>
                        <Button size="xs" colorScheme="gray" leftIcon={<CloseIcon />} onClick={handleCancelAdd}>
                          Cancel
                        </Button>
                      </HStack>
                    </Box>
                  )}
                </VStack>
              </Box>
            ) : null
          )}
        </Box>

        {/* Right Pane */}
        <Box
          w={rightPaneWidth}
          flex={1}
          p={{ base: 4, md: 8 }}
          overflowY="auto"
          h={{ base: 'auto', md: '100%' }}
          bg="white"
          borderRadius={{ base: 'md', md: 'none' }}
          boxShadow={{ base: 'md', md: 'none' }}
        >
          {editIdx === selectedIdx ? (
            <Box>
              <Input
                value={editData.title}
                onChange={e => handleEditChange('title', e.target.value)}
                mb={1}
                fontWeight="bold"
                fontSize="lg"
              />
              <Input
                value={editData.org}
                onChange={e => handleEditChange('org', e.target.value)}
                mb={1}
              />
              <Input
                value={editData.date}
                onChange={e => handleEditChange('date', e.target.value)}
                mb={2}
              />
              <Divider mb={4} />
              <VStack align="start" spacing={3}>
                {editData.details.map((d: string, i: number) => (
                  <TextareaAutosize
                    key={i}
                    value={d}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleEditDetailChange(i, e.target.value)}
                    minRows={1}
                    style={{ width: '100%', marginBottom: 8 }}
                  />
                ))}
              </VStack>
              <Button size="xs" leftIcon={<AddIcon />} onClick={() => handleEditChange('details', [...editData.details, ''])} mb={1} mt={2}>
                Add Detail
              </Button>
              <HStack mt={4}>
                <Button size="sm" colorScheme="green" leftIcon={<CheckIcon />} onClick={handleSaveEdit}>
                  Save
                </Button>
                <Button size="sm" colorScheme="gray" leftIcon={<CloseIcon />} onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </HStack>
            </Box>
          ) : (
            careerData[selectedIdx] && (
              <Box>
                <Heading size="lg" mb={1}>{careerData[selectedIdx].title}</Heading>
                {careerData[selectedIdx].org && (
                  <Text fontWeight="semibold" color="gray.700" mb={1}>
                    {careerData[selectedIdx].org}
                  </Text>
                )}
                <Text fontSize="sm" color="gray.500" mb={4}>{careerData[selectedIdx].date}</Text>
                <Divider mb={4} />
                <VStack align="start" spacing={3}>
                  {careerData[selectedIdx].details.map((d: string, i: number) => (
                    <Text as="li" key={i} ml={4} fontSize="md">
                      {d}
                    </Text>
                  ))}
                </VStack>
              </Box>
            )
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default CareerHistory; 