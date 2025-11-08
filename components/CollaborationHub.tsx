"use client"

import { useState } from 'react';
import { Search, Filter, Plus, MessageSquare, Github, Figma, Code, Cpu, Paintbrush, Database, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Student {
  id: string;
  name: string;
  department: string;
  year: string;
  skills: string[];
  note: string;
  avatar: string;
  bio?: string;
  projects?: string[];
  interests?: string[];
  struggles?: string[];
}

const skills = ["AI/ML", "Web Dev", "Mobile Dev", "UI/UX", "Backend", "DevOps", "Blockchain", "IoT", "Cybersecurity"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const availability = ["Open to Collab", "Looking for Teammates"];

const getSkillIcon = (skill: string) => {
  switch (skill.toLowerCase()) {
    case 'ai/ml':
      return <Cpu className="w-4 h-4 mr-1" />;
    case 'web dev':
      return <Code className="w-4 h-4 mr-1" />;
    case 'ui/ux':
      return <Figma className="w-4 h-4 mr-1" />;
    case 'mobile dev':
      return <Smartphone className="w-4 h-4 mr-1" />;
    default:
      return <Code className="w-4 h-4 mr-1" />;
  }
};

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Alex Chen',
    department: 'Computer Science',
    year: '3rd Year',
    skills: ['AI/ML', 'Web Dev', 'Data Science'],
    note: 'Looking for a teammate to build an NLP project',
    avatar: '/avatars/1.png',
    bio: 'Passionate about NLP and building impactful applications. Currently working on a sentiment analysis tool.',
    projects: ['Sentiment Analysis Dashboard', 'E-commerce Recommendation System'],
    interests: ['Natural Language Processing', 'Deep Learning', 'Web Applications'],
    struggles: ['Deploying ML models', 'Frontend development']
  },
  {
    id: '2',
    name: 'Jordan Smith',
    department: 'Design',
    year: '2nd Year',
    skills: ['UI/UX', 'Figma', 'Frontend'],
    note: 'Looking to collaborate on a hackathon project',
    avatar: '/avatars/2.png',
    bio: 'UI/UX designer with a passion for creating intuitive user experiences.',
    projects: ['Fitness App Redesign', 'E-learning Platform'],
    interests: ['User Research', 'Prototyping', 'Design Systems']
  },
  {
    id: '3',
    name: 'Taylor Wilson',
    department: 'Electrical Engineering',
    year: '4th Year',
    skills: ['IoT', 'Embedded Systems', 'Python'],
    note: 'Building a smart home system, need help with the backend',
    avatar: '/avatars/3.png',
    bio: 'IoT enthusiast with experience in embedded systems and home automation.',
    projects: ['Smart Garden System', 'Home Automation Hub']
  },
  {
    id: '4',
    name: 'Casey Kim',
    department: 'Computer Science',
    year: '2nd Year',
    skills: ['Web Dev', 'JavaScript', 'React'],
    note: 'Looking for a study group for web development',
    avatar: '/avatars/4.png'
  },
  {
    id: '5',
    name: 'Riley Johnson',
    department: 'Data Science',
    year: '3rd Year',
    skills: ['Data Analysis', 'Python', 'SQL'],
    note: 'Working on a data visualization project',
    avatar: '/avatars/5.png'
  },
  {
    id: '6',
    name: 'Morgan Lee',
    department: 'Cybersecurity',
    year: '4th Year',
    skills: ['Cybersecurity', 'Networking', 'Python'],
    note: 'Looking for teammates for CTF competitions',
    avatar: '/avatars/6.png'
  }
];

const CollaborationHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.every(skill => student.skills.includes(skill));
    
    const matchesYear = !selectedYear || student.year === selectedYear;
    
    return matchesSearch && matchesSkills && matchesYear;
  });

  const openStudentModal = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  return (
    <div className="py-8 px-4 md:px-8 bg-[#121212] text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-alata text-4xl font-bold text-white mb-4">Collaboration Hub</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Connect with like-minded students, find project partners, and build something amazing together.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search students, projects, or skills…"
              className="pl-10 bg-gray-900 border-gray-800 text-white placeholder-gray-500 h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-[#1DB954]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Filter by:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 5).map(skill => (
                <Button
                  key={skill}
                  variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
                  className={`rounded-full h-8 text-xs font-medium ${selectedSkills.includes(skill) ? 'bg-[#1DB954] hover:bg-[#1DB954]/90' : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'}`}
                  onClick={() => toggleSkill(skill)}
                >
                  {getSkillIcon(skill)}
                  {skill}
                </Button>
              ))}
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-xs text-gray-400 hover:bg-gray-800 h-8">
                    + More
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-white">All Skills</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-2 py-4">
                    {skills.map(skill => (
                      <Button
                        key={skill}
                        variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
                        className={`justify-start ${selectedSkills.includes(skill) ? 'bg-[#1DB954] hover:bg-[#1DB954]/90' : 'bg-gray-800 border-gray-700'}`}
                        onClick={() => toggleSkill(skill)}
                      >
                        {getSkillIcon(skill)}
                        {skill}
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="flex flex-wrap gap-2 ml-auto">
              <Button className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-white rounded-full h-8 px-4 text-sm font-medium flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Post Request
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {years.map(year => (
              <Button
                key={year}
                variant={selectedYear === year ? 'default' : 'outline'}
                className={`rounded-full h-8 text-xs font-medium ${selectedYear === year ? 'bg-[#1DB954] hover:bg-[#1DB954]/90' : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setSelectedYear(selectedYear === year ? '' : year)}
              >
                {year}
              </Button>
            ))}
            
            {availability.map(item => (
              <Button
                key={item}
                variant={selectedAvailability === item ? 'default' : 'outline'}
                className={`rounded-full h-8 text-xs font-medium ${selectedAvailability === item ? 'bg-[#1DB954] hover:bg-[#1DB954]/90' : 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setSelectedAvailability(selectedAvailability === item ? '' : item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>

        {/* Suggested Teammates */}
        <div className="mb-8">
          <h2 className="font-alata text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-[#1DB954]">✨</span> Suggested Teammates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.slice(0, 3).map(student => (
              <StudentCard 
                key={student.id} 
                student={student} 
                onConnect={() => openStudentModal(student)}
              />
            ))}
          </div>
        </div>

        {/* All Students */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-alata text-xl font-semibold text-white">All Students</h2>
            <p className="text-sm text-gray-400">{filteredStudents.length} students found</p>
          </div>
          
          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map(student => (
                <StudentCard 
                  key={student.id} 
                  student={student} 
                  onConnect={() => openStudentModal(student)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-900/50 rounded-xl">
              <p className="text-gray-400">No students found matching your criteria.</p>
              <Button 
                variant="ghost" 
                className="text-[#1DB954] hover:bg-[#1DB954]/10 mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSkills([]);
                  setSelectedYear('');
                  setSelectedAvailability('');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedStudent && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-2xl font-bold text-[#1DB954]">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-white">{selectedStudent.name}</DialogTitle>
                    <p className="text-gray-400">{selectedStudent.department} • {selectedStudent.year}</p>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">About</h3>
                  <p className="text-gray-300">
                    {selectedStudent.bio || 'No bio available.'}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map(skill => (
                      <Badge 
                        key={skill} 
                        className="bg-gray-800 text-[#1DB954] border border-[#1DB954]/30 hover:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {selectedStudent.projects && selectedStudent.projects.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-white mb-2">Projects</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      {selectedStudent.projects.map((project, index) => (
                        <li key={index}>{project}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedStudent.interests && selectedStudent.interests.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-white mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.interests.map((interest, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedStudent.struggles && selectedStudent.struggles.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-white mb-2">Looking for help with</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.struggles.map((struggle, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-800/50 border border-gray-700 text-gray-300 rounded-full text-sm">
                          {struggle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    className="border-gray-700 text-white hover:bg-gray-800"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </Button>
                  <Button className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-white">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StudentCard = ({ student, onConnect }: { student: Student, onConnect: () => void }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-[#1DB954]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#1DB954]/10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-lg font-bold text-[#1DB954]">
            {student.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-white">{student.name}</h3>
            <p className="text-xs text-gray-400">{student.department} • {student.year}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="h-8 px-3 text-xs border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954]/10"
          onClick={onConnect}
        >
          View
        </Button>
      </div>
      
      <div className="mb-3">
        <p className="text-sm text-gray-300 line-clamp-2">
          <span className="text-[#1DB954] font-medium">Note: </span>
          {student.note}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-1.5 mb-4">
        {student.skills.map((skill, index) => (
          <span 
            key={index} 
            className="px-2.5 py-0.5 bg-gray-800/50 text-gray-300 rounded-full text-xs"
          >
            {skill}
          </span>
        ))}
      </div>
      
      <Button 
        className="w-full bg-[#1DB954] hover:bg-[#1DB954]/90 text-white text-sm font-medium py-2"
        onClick={onConnect}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Connect
      </Button>
    </div>
  );
};

export default CollaborationHub;
