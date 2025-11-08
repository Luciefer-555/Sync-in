import Link from 'next/link';

interface ProblemStatement {
  id: string;
  title: string;
  description: string;
  source: string;
  relevance: string;
}

const problemStatements: ProblemStatement[] = [
  {
    id: '1',
    title: 'Digital Learning Platform for Rural Students',
    description: 'AI-based educational platform designed to provide accessible and personalized learning experiences for students in rural areas with limited resources.',
    source: 'https://sih.gov.in',
    relevance: 'Aligns with SyncIn\'s mission to make quality education accessible to all students, regardless of their geographical location.'
  },
  {
    id: '2',
    title: 'Smart Classroom & Timetable Scheduler',
    description: 'AI-powered system to optimize class schedules, room allocations, and resource management for educational institutions.',
    source: 'https://sih.gov.in',
    relevance: 'Complements SyncIn\'s focus on efficient academic management and resource optimization in educational settings.'
  },
  {
    id: '3',
    title: 'Authenticity Validator for Academia',
    description: 'Blockchain and AI solution to verify academic credentials and prevent certificate forgery in educational institutions.',
    source: 'https://sih.gov.in',
    relevance: 'Enhances SyncIn\'s credibility by ensuring the authenticity of academic achievements within the platform.'
  },
  {
    id: '4',
    title: 'Gamified Learning Platform for Rural Education',
    description: 'Adaptive gamification system using AI to create engaging educational content for students in rural areas.',
    source: 'https://sih.gov.in',
    relevance: 'Supports SyncIn\'s goal of making learning more interactive and engaging for all students.'
  },
  {
    id: '5',
    title: 'AI-Powered Student Talent Assessment',
    description: 'Mobile platform using computer vision and AI to assess and nurture student talents in sports and co-curricular activities.',
    source: 'https://sih.gov.in',
    relevance: 'Complements SyncIn\'s holistic approach to student development beyond academics.'
  },
  {
    id: '6',
    title: 'AI-Based Career Guidance System',
    description: 'Personalized career recommendation engine using AI to guide students based on their skills and interests.',
    source: 'https://sih.gov.in',
    relevance: 'Aligns with SyncIn\'s vision of helping students make informed decisions about their academic and professional futures.'
  },
  {
    id: '7',
    title: 'Smart Attendance System Using Face Recognition',
    description: 'Contactless attendance system using facial recognition to streamline classroom management.',
    source: 'https://sih.gov.in',
    relevance: 'Enhances SyncIn\'s academic management capabilities with modern, efficient attendance tracking.'
  }
];

export default function HackathonProblems() {
  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-6">
        <svg 
          className="w-8 h-8 text-[#1DB954]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
          />
        </svg>
        <h2 className="text-2xl font-bold text-white font-alata">Hackathon Problem Statements</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {problemStatements.map((problem) => (
          <div 
            key={problem.id}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <h3 className="text-xl font-bold text-white mb-3 font-alata">{problem.title}</h3>
            <p className="text-gray-300 text-sm mb-4 flex-grow">
              {problem.description}
            </p>
            <div className="mt-auto">
              <Link 
                href={`/problem-statements/${problem.id}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-[#1DB954] text-white rounded-md hover:bg-opacity-90 transition-colors text-sm font-medium w-full text-center"
              >
                See More
                <svg 
                  className="w-4 h-4 ml-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M14 5l7 7m0 0l-7 7m7-7H3" 
                  />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
