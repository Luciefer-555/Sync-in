import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category?: string;
  difficulty?: string;
  tags?: string[];
}

interface MCQData {
  questions: MCQQuestion[];
}

interface APIErrorResponse {
  error: string;
  debug?: {
    requestedCategory?: string;
    safeCategory?: string;
    filename?: string;
    filePath?: string;
  };
  details?: string;
  file?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MCQData | APIErrorResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { category } = req.query;

  // Validate category parameter
  if (!category || Array.isArray(category)) {
    return res.status(400).json({ error: 'Category is required and must be a string' });
  }

  // Sanitize the category to prevent path traversal
  const safeCategory = category.replace(/[^a-z0-9-]/gi, '').toLowerCase();
  
  if (!safeCategory) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    // Define the expected filename based on category
    const filenameMap: Record<string, string> = {
      'dsa': 'dsa_mcqs.json',
      'html': 'html_mcqs.json',
      'python': 'python_mcqs.json',
      'javascript': 'javascript_mcqs.json',
      'java': 'java_mcqs.json',
      'sql': 'sql_mcqs.json',
      'mongodb': 'mongodb_mcqs.json',
      'css': 'css_mcqs.json',
      'system design': 'system_design_mcqs.json',
      'computer science': 'computer_science_mcqs.json'
    };

    // Get the filename from the map or use the category name
    const filename = filenameMap[safeCategory] || `${safeCategory}.json`;
    const filePath = path.join(process.cwd(), 'gui', 'mcqs', filename);

    // Check if the file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error(`File not found: ${filePath}`);
      const errorResponse: APIErrorResponse = { 
        error: `No questions found for category: ${category}`,
        debug: {
          requestedCategory: category,
          safeCategory,
          filename,
          filePath
        }
      };
      return res.status(404).json(errorResponse);
    }

    // Read and parse the file
    const fileContents = await fs.readFile(filePath, 'utf8');
    let data: MCQData;
    
    try {
      data = JSON.parse(fileContents) as MCQData;
    } catch (error) {
      console.error(`Error parsing JSON file: ${filePath}`, error);
      const errorResponse: APIErrorResponse = { 
        error: 'Error parsing questions data',
        details: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          filePath
        }
      };
      return res.status(500).json(errorResponse);
    }

    // Validate the data structure
    if (!data.questions || !Array.isArray(data.questions)) {
      console.error(`Invalid data format in file: ${filePath}`);
      const errorResponse: APIErrorResponse = { 
        error: 'Invalid data format: questions array is missing or invalid',
        file: filename,
        debug: {
          filePath
        }
      };
      return res.status(500).json(errorResponse);
    }

    // Send the response
    res.status(200).json(data);
  } catch (error) {
    console.error('Error loading MCQs:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to load questions' 
    });
  }
}
