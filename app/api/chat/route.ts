import { NextResponse } from 'next/server';

// Tell Next.js to use the Edge Runtime
export const runtime = 'edge';

// Types
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type RequestBody = {
  question: string;
  context?: Message[];
};

// Import the dataset from the new location
import dataset from '@/src/data/dataset';

// Simple in-memory cache for the dataset
let cachedDataset: any[] = [];

// Load the dataset
async function loadDataset() {
  if (cachedDataset.length > 0) {
    return cachedDataset;
  }
  
  try {
    // The dataset is imported directly, no need for fs
    cachedDataset = Array.isArray(dataset) ? dataset : [];
    return cachedDataset;
  } catch (error) {
    console.error('Error loading dataset:', error);
    return [];
  }
}

// Simple tokenizer (improve with a proper NLP library for production)
const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 0);
};

// Calculate similarity between two texts (0 to 1)
const calculateSimilarity = (text1: string, text2: string): number => {
  const tokens1 = new Set(tokenize(text1));
  const tokens2 = tokenize(text2);
  
  if (tokens1.size === 0 || tokens2.length === 0) return 0;
  
  let matches = 0;
  for (const token of tokens2) {
    if (tokens1.has(token)) matches++;
  }
  
  // Jaccard similarity coefficient
  return matches / (tokens1.size + tokens2.length - matches);
};

export async function POST(request: Request) {
  try {
    // Load the dataset
    const dataset = await loadDataset();
    if (dataset.length === 0) {
      throw new Error('Failed to load knowledge base');
    }

    const { question, context = [] }: RequestBody = await request.json();
    
    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Prepare search text with context
    const contextText = context.map(m => m.content).join(' ');
    const searchText = `${contextText} ${question}`.trim().toLowerCase();
    
    // Find the most relevant answer
    const relevantItems = [];
    
    for (const item of dataset) {
      if (!item.instruction || !item.output) continue;
      
      const instruction = item.instruction.toLowerCase();
      const output = item.output.toLowerCase();
      
      // Simple keyword matching (can be improved with better NLP techniques)
      const keywords = searchText.split(/\s+/);
      const matchScore = keywords.reduce((score, keyword) => {
        if (instruction.includes(keyword) || output.includes(keyword)) {
          return score + 1;
        }
        return score;
      }, 0);
      
      if (matchScore > 0) {
        relevantItems.push({
          ...item,
          score: matchScore
        });
      }
    }
    
    // Sort by match score and get the best match
    const bestMatch = relevantItems.sort((a, b) => b.score - a.score)[0];
    
    if (bestMatch) {
      return NextResponse.json({
        answer: bestMatch.output,
        source: bestMatch.instruction || 'SyncIn Knowledge Base',
        confidence: bestMatch.score / 10 // Normalize score to 0-1 range
      });
    }

    // If no good match found, try to generate a contextual response
    if (context.length > 0) {
      // Try to find a follow-up pattern
      const lastMessage = context[context.length - 1];
      if (lastMessage.role === 'assistant') {
        // Check if this is a request for more details
        const lowerQuestion = question.toLowerCase();
        if (lowerQuestion.includes('more') || 
            lowerQuestion.includes('elaborate') || 
            lowerQuestion.includes('tell me more')) {
          return NextResponse.json({
            answer: "I'd be happy to provide more details. Could you specify which part you'd like me to elaborate on?",
            source: 'SyncIn Assistant'
          });
        }
      }
    }

    // Fallback response
    return NextResponse.json({
      answer: "I'm not entirely sure about that. Could you provide more context or rephrase your question? I'm here to help with information about SyncIn, academic resources, and career guidance.",
      source: 'SyncIn Assistant'
    });

  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
