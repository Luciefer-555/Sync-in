import json
import random
from datetime import datetime
from typing import List, Dict, Any
import os

# Configuration
TOTAL_QUESTIONS = 1000  # Per domain
DOMAINS = [
    "DSA", "Python", "JavaScript", "React.js", "Java", 
    "SQL", "MongoDB", "CSS", "System Design", "CS Fundamentals"
]

# Domain-specific configurations
DOMAIN_CONFIGS = {
    "DSA": {
        "categories": ["Arrays", "Linked Lists", "Stacks/Queues", "Trees", "Graphs", "Sorting", "Searching", "Dynamic Programming"],
        "difficulty": {"Easy": 0.3, "Medium": 0.5, "Hard": 0.2},
        "templates": [
            {
                "question": "What is the time complexity of {operation} in {data_structure}?",
                "variations": [
                    {"operation": "accessing an element", "data_structure": "an array", "answer": "O(1)"},
                    {"operation": "searching for an element", "data_structure": "a linked list", "answer": "O(n)"},
                    # More variations...
                ],
                "distractors": ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"]
            },
            # More templates...
        ]
    },
    "Python": {
        "categories": ["Basics", "Data Types", "OOP", "Functions", "Modules", "File Handling"],
        "difficulty": {"Easy": 0.4, "Medium": 0.4, "Hard": 0.2},
        "templates": [
            # Question templates for Python...
        ]
    },
    # Configurations for other domains...
}

def generate_question(domain: str, question_id: int) -> Dict[str, Any]:
    """Generate a single MCQ question."""
    config = DOMAIN_CONFIGS[domain]
    difficulty = random.choices(
        list(config["difficulty"].keys()),
        weights=config["difficulty"].values()
    )[0]
    
    # Select a random template and variation
    template = random.choice(config["templates"])
    variation = random.choice(template["variations"])
    
    # Format the question
    question = template["question"].format(**variation)
    
    # Generate options
    correct_answer = variation["answer"]
    options = [correct_answer]
    
    # Add distractors (wrong answers)
    distractors = [d for d in template["distractors"] if d != correct_answer]
    options.extend(random.sample(distractors, 3))
    random.shuffle(options)
    
    # Get the index of the correct answer
    correct_idx = options.index(correct_answer)
    
    return {
        "id": question_id,
        "question": question,
        "options": options,
        "correctAnswer": correct_idx,
        "explanation": f"The correct answer is {correct_answer} because...",
        "category": random.choice(config["categories"]),
        "difficulty": difficulty,
        "tags": [domain.lower(), difficulty.lower()]
    }

def generate_domain_mcqs(domain: str, output_dir: str):
    """Generate MCQs for a single domain."""
    print(f"Generating {TOTAL_QUESTIONS} {domain} MCQs...")
    
    questions = []
    for i in range(1, TOTAL_QUESTIONS + 1):
        questions.append(generate_question(domain, i))
        if i % 100 == 0:
            print(f"  Generated {i}/{TOTAL_QUESTIONS} questions")
    
    # Create metadata
    metadata = {
        "domain": domain,
        "totalQuestions": TOTAL_QUESTIONS,
        "categories": DOMAIN_CONFIGS[domain]["categories"],
        "difficultyDistribution": DOMAIN_CONFIGS[domain]["difficulty"],
        "version": "1.0.0",
        "generatedOn": datetime.now().isoformat()
    }
    
    # Save to file
    output = {
        "metadata": metadata,
        "questions": questions
    }
    
    filename = os.path.join(output_dir, f"{domain.lower().replace(' ', '_')}_mcqs.json")
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
    
    print(f"✅ Saved {len(questions)} {domain} MCQs to {filename}")
    return filename

def main():
    # Create output directory
    output_dir = os.path.join(os.path.dirname(__file__), "mcqs")
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate MCQs for each domain
    for domain in DOMAINS:
        generate_domain_mcqs(domain, output_dir)
    
    print("\n🎉 All MCQs generated successfully!")

if __name__ == "__main__":
    main()
