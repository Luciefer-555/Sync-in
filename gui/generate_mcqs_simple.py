import json
import random
from datetime import datetime
from typing import List, Dict, Any
import os

# Configuration
QUESTIONS_PER_DOMAIN = 100  # Reduced for testing
TOTAL_QUESTIONS = 10 * QUESTIONS_PER_DOMAIN  # 10 domains

# Domain configurations with templates
DOMAINS = {
    "DSA": {
        "categories": ["Arrays", "Linked Lists", "Trees", "Graphs", "Sorting"],
        "templates": [
            {
                "question": "What is the time complexity of {operation} in {data_structure}?",
                "variations": [
                    {"operation": "accessing an element", "data_structure": "an array", "answer": "O(1)"},
                    {"operation": "searching for an element", "data_structure": "a linked list", "answer": "O(n)"},
                    {"operation": "inserting an element at the beginning", "data_structure": "a linked list", "answer": "O(1)"},
                    {"operation": "searching", "data_structure": "a balanced binary search tree", "answer": "O(log n)"},
                    {"operation": "sorting", "data_structure": "an array using merge sort", "answer": "O(n log n)"},
                ],
                "distractors": ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"]
            },
            {
                "question": "Which data structure uses {principle}?",
                "variations": [
                    {"principle": "LIFO (Last In First Out)", "answer": "Stack"},
                    {"principle": "FIFO (First In First Out)", "answer": "Queue"},
                    {"principle": "hashing with chaining", "answer": "Hash Table"},
                ],
                "distractors": ["Array", "Linked List", "Tree", "Graph", "Heap"]
            }
        ]
    },
    "Python": {
        "categories": ["Basics", "Data Types", "OOP", "Functions", "Modules"],
        "templates": [
            {
                "question": "What is the output of: {code}",
                "variations": [
                    {"code": "print(2 ** 3 ** 2)", "answer": "512"},
                    {"code": "print('Hello' + 3 * '!')", "answer": "Hello!!!"},
                    {"code": "print([i for i in range(5) if i % 2 == 0])", "answer": "[0, 2, 4]"},
                ],
                "distractors": ["Error", "None", "True", "False", "0", "1"]
            }
        ]
    },
    # Similar templates for other domains...
}

def generate_question(domain: str, question_id: int) -> Dict[str, Any]:
    """Generate a single MCQ question."""
    config = DOMAINS[domain]
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
        "id": f"{domain[:3].upper()}{question_id:04d}",
        "question": question,
        "options": options,
        "correctAnswer": correct_idx,
        "explanation": f"The correct answer is {correct_answer} because...",
        "category": random.choice(config["categories"]),
        "difficulty": random.choice(["Easy", "Medium", "Hard"]),
        "tags": [domain.lower()]
    }

def main():
    output_dir = os.path.join(os.path.dirname(__file__), "mcqs")
    os.makedirs(output_dir, exist_ok=True)
    
    all_questions = []
    
    for domain in DOMAINS:
        print(f"Generating {QUESTIONS_PER_DOMAIN} {domain} MCQs...")
        domain_questions = []
        
        for i in range(1, QUESTIONS_PER_DOMAIN + 1):
            domain_questions.append(generate_question(domain, i))
            
        # Save domain-specific questions
        domain_file = os.path.join(output_dir, f"{domain.lower()}_mcqs.json")
        with open(domain_file, 'w', encoding='utf-8') as f:
            json.dump({
                "metadata": {
                    "domain": domain,
                    "totalQuestions": len(domain_questions),
                    "categories": DOMAINS[domain]["categories"],
                    "generatedOn": datetime.now().isoformat()
                },
                "questions": domain_questions
            }, f, indent=2)
            
        all_questions.extend(domain_questions)
        print(f"✅ Saved {len(domain_questions)} {domain} MCQs to {domain_file}")
    
    # Save all questions to a single file
    all_questions_file = os.path.join(output_dir, "all_mcqs.json")
    with open(all_questions_file, 'w', encoding='utf-8') as f:
        json.dump({
            "metadata": {
                "totalQuestions": len(all_questions),
                "domains": list(DOMAINS.keys()),
                "generatedOn": datetime.now().isoformat()
            },
            "questions": all_questions
        }, f, indent=2)
    
    print(f"\n🎉 Generated {len(all_questions)} MCQs in total!")
    print(f"📁 Individual domain files saved in: {output_dir}")
    print(f"📄 Combined file saved as: {all_questions_file}")

if __name__ == "__main__":
    main()
