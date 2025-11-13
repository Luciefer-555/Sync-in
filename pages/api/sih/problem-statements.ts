import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';

type ProblemStatement = {
  id: string;
  title: string;
  description: string;
  category: string;
  organization: string;
  psNumber: string;
  theme: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  lastDate: string;
  status: string;
  tags: string[];
  url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { search, category, theme, page = '1', limit = '10' } = req.query;

  try {
    // In a real implementation, we would fetch from SIH website
    // For now, we'll use mock data that matches the expected structure
    const mockProblemStatements: ProblemStatement[] = [
      {
        id: '1',
        title: 'AI-Powered Chatbot for Technical Education',
        description: 'Develop an AI-powered chatbot that can answer technical questions, provide coding help, and guide students through complex technical concepts in an interactive manner.',
        category: 'Education',
        organization: 'Ministry of Education',
        psNumber: 'SIH2024-EDU-045',
        theme: 'AI/ML',
        difficulty: 'Hard',
        lastDate: '2024-12-15',
        status: 'Open',
        tags: ['AI', 'Chatbot', 'Education', 'NLP', 'Machine Learning'],
        url: 'https://sih.gov.in/ps/45'
      },
      {
        id: '2',
        title: 'Smart Street Parking Management',
        description: 'Create an IoT and AI-based solution to manage and optimize street parking spaces in urban areas, reducing traffic congestion and improving parking efficiency.',
        category: 'Smart Cities',
        organization: 'Ministry of Urban Development',
        psNumber: 'SIH2024-SMART-032',
        theme: 'IoT/AI',
        difficulty: 'Hard',
        lastDate: '2024-11-30',
        status: 'Open',
        tags: ['IoT', 'AI', 'Smart City', 'Parking', 'Traffic Management'],
        url: 'https://sih.gov.in/ps/32'
      },
      {
        id: '3',
        title: 'Blockchain-Based Legal Record Management',
        description: 'Develop a secure and immutable blockchain-based system for managing legal records, ensuring transparency and preventing tampering of sensitive legal documents.',
        category: 'Governance',
        organization: 'Ministry of Law and Justice',
        psNumber: 'SIH2024-GOV-018',
        theme: 'Blockchain',
        difficulty: 'Hard',
        lastDate: '2025-01-15',
        status: 'Open',
        tags: ['Blockchain', 'Legal Tech', 'Security', 'Document Management'],
        url: 'https://sih.gov.in/ps/18'
      },
      {
        id: '4',
        title: 'AI for Rain Prediction',
        description: 'Build a machine learning model that can accurately predict rainfall patterns and intensity using historical weather data and satellite imagery.',
        category: 'Agriculture',
        organization: 'Indian Meteorological Department',
        psNumber: 'SIH2024-AGRI-022',
        theme: 'AI/ML',
        difficulty: 'Medium',
        lastDate: '2024-11-15',
        status: 'Open',
        tags: ['AI', 'Machine Learning', 'Weather Prediction', 'Agriculture'],
        url: 'https://sih.gov.in/ps/22'
      },
      {
        id: '5',
        title: 'Smart Competency Diagnostic Tool',
        description: 'Develop an intelligent assessment platform that can evaluate and map the technical competencies of students to help them identify skill gaps and learning paths.',
        category: 'Education',
        organization: 'AICTE',
        psNumber: 'SIH2024-EDU-056',
        theme: 'AI/ML',
        difficulty: 'Medium',
        lastDate: '2024-12-01',
        status: 'Open',
        tags: ['Education Technology', 'Skill Assessment', 'AI', 'Learning Analytics'],
        url: 'https://sih.gov.in/ps/56'
      }
    ];

    // Filtering logic (mock implementation)
    let filteredStatements = [...mockProblemStatements];

    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredStatements = filteredStatements.filter(
        (ps) =>
          ps.title.toLowerCase().includes(searchLower) ||
          ps.description.toLowerCase().includes(searchLower) ||
          ps.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    if (category) {
      filteredStatements = filteredStatements.filter(
        (ps) => ps.category.toLowerCase() === (category as string).toLowerCase()
      );
    }

    if (theme) {
      filteredStatements = filteredStatements.filter(
        (ps) => ps.theme.toLowerCase() === (theme as string).toLowerCase()
      );
    }

    // Pagination
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedStatements = filteredStatements.slice(startIndex, endIndex);

    // Get unique categories and themes for filters
    const categories = [...new Set(mockProblemStatements.map(ps => ps.category))];
    const themes = [...new Set(mockProblemStatements.map(ps => ps.theme))];

    res.status(200).json({
      success: true,
      data: {
        problemStatements: paginatedStatements,
        total: filteredStatements.length,
        page: pageNum,
        totalPages: Math.ceil(filteredStatements.length / limitNum),
        filters: {
          categories,
          themes
        }
      }
    });
  } catch (error) {
    console.error('Error fetching problem statements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch problem statements',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
