import json
import random
from datetime import datetime
import os
from typing import List, Dict, Any

# Configuration
QUESTIONS_PER_DOMAIN = 1000  # 1,000 questions per domain
DOMAINS = [
    "DSA", "Python", "JavaScript", "React.js", "Java",
    "SQL", "MongoDB", "CSS", "System Design", "Computer Science"
]

# Domain-specific configurations
DOMAIN_CONFIGS = {
    "DSA": {
        "categories": ["Arrays", "Linked Lists", "Trees", "Graphs", "Sorting", "Searching", "Dynamic Programming"],
        "difficulty": {"Easy": 0.4, "Medium": 0.4, "Hard": 0.2},
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
                "distractors": ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"],
                "explanation": "The time complexity is {answer} because {reason}"
            },
            {
                "question": "Which data structure uses {principle}?",
                "variations": [
                    {"principle": "LIFO (Last In First Out)", "answer": "Stack", "reason": "it follows the last-in-first-out principle"},
                    {"principle": "FIFO (First In First Out)", "answer": "Queue", "reason": "it follows the first-in-first-out principle"},
                    {"principle": "hashing with chaining", "answer": "Hash Table", "reason": "it uses hashing with chaining to handle collisions"},
                ],
                "distractors": ["Array", "Linked List", "Tree", "Graph", "Heap"],
                "explanation": "{answer} uses {principle} {reason}."
            }
        ]
    },
    "Python": {
        "categories": ["Basics", "Data Types", "OOP", "Functions", "Modules", "File Handling", "Decorators"],
        "difficulty": {"Easy": 0.5, "Medium": 0.4, "Hard": 0.1},
        "templates": [
            {
                "question": "What is the output of: {code}",
                "variations": [
                    {"code": "print(2 ** 3 ** 2)", "answer": "512", "reason": "exponentiation is right-associative in Python"},
                    {"code": "'Hello' + 3 * '!'", "answer": "'Hello!!!'", "reason": "string multiplication repeats the string"},
                    {"code": "[i for i in range(5) if i % 2 == 0]", "answer": "[0, 2, 4]", "reason": "list comprehension filters even numbers"},
                ],
                "distractors": ["Error", "None", "True", "False", "0", "1"],
                "explanation": "The output is {answer} because {reason}."
            }
        ]
    },
    "JavaScript": {
        "categories": ["Basics", "ES6+", "DOM", "Async/Await", "Closures", "Prototypes"],
        "difficulty": {"Easy": 0.4, "Medium": 0.4, "Hard": 0.2},
        "templates": [
            {
                "question": "What is the output of: {code}",
                "variations": [
                    {"code": "console.log(1 + '2' + '2')", "answer": "'122'", "reason": "string concatenation occurs with the + operator"},
                    {"code": "console.log(1 - '1')", "answer": "0", "reason": "- operator converts strings to numbers"},
                ],
                "distractors": ["Error", "undefined", "null", "NaN", "'12'"],
                "explanation": "The output is {answer} because {reason}."
            }
        ]
    },
    "React.js": {
        "categories": ["Components", "Hooks", "State", "Props", "Context", "Routing"],
        "difficulty": {"Easy": 0.4, "Medium": 0.4, "Hard": 0.2},
        "templates": [
            {
                "question": "In React, {question}",
                "variations": [
                    {"question": "what hook is used for side effects?", "answer": "useEffect", "reason": "it's designed to handle side effects in function components"},
                    {"question": "how do you update state in a functional component?", "answer": "Using the setState function from useState", "reason": "useState provides the state and setter function"},
                ],
                "distractors": ["useState", "useContext", "useReducer", "setState", "this.setState"],
                "explanation": "{answer} is the correct answer because {reason}."
            }
        ]
    },
    "Java": {
        "categories": ["Basics", "OOP", "Collections", "Multithreading", "Streams", "Exceptions"],
        "difficulty": {"Easy": 0.4, "Medium": 0.4, "Hard": 0.2},
        "templates": [
            {
                "question": "In Java, {question}",
                "variations": [
                    {"question": "what is the default value of an int?", "answer": "0", "reason": "primitive integers default to 0"},
                    {"question": "which collection maintains insertion order?", "answer": "LinkedHashMap", "reason": "it maintains a doubly-linked list of entries"},
                ],
                "distractors": ["null", "1", "-1", "false", "undefined"],
                "explanation": "{answer} is correct because {reason}."
            }
        ]
    },
    "SQL": {
        "categories": ["Queries", "Joins", "Indexes", "Transactions", "Optimization", "Security"],
        "difficulty": {"Easy": 0.4, "Medium": 0.4, "Hard": 0.2},
        "templates": [
            {
                "question": "Which SQL statement is used to {action}?",
                "variations": [
                    {"action": "retrieve data from a database", "answer": "SELECT", "reason": "SELECT is used to query data from a database"},
                    {"action": "update existing records", "answer": "UPDATE", "reason": "UPDATE modifies existing records in a table"},
                ],
                "distractors": ["GET", "FIND", "MODIFY", "CHANGE", "RETRIEVE"],
                "explanation": "{answer} is used to {action} {reason}."
            }
        ]
    },
    "MongoDB": {
        "categories": ["CRUD", "Indexes", "Aggregation", "Sharding", "Performance", "Schema Design"],
        "difficulty": {"Easy": 0.4, "Medium": 0.4, "Hard": 0.2},
        "templates": [
            {
                "question": "In MongoDB, {question}",
                "variations": [
                    {"question": "which operator is used for equality?", "answer": "$eq", "reason": "$eq matches values that are equal to a specified value"},
                    {"question": "what is the default port?", "answer": "27017", "reason": "27017 is the default port for MongoDB"},
                ],
                "distractors": ["$equal", "==", "=", "27018", "3306"],
                "explanation": "{answer} is correct because {reason}."
            }
        ]
    },
    "CSS": {
        "categories": ["Selectors", "Box Model", "Flexbox", "Grid", "Animations", "Responsive"],
        "difficulty": {"Easy": 0.5, "Medium": 0.4, "Hard": 0.1},
        "templates": [
            {
                "question": "Which CSS property is used to {action}?",
                "variations": [
                    {"action": "change the text color", "answer": "color", "reason": "the color property sets the text color"},
                    {"action": "add space between elements", "answer": "margin", "reason": "margin creates space around elements"},
                ],
                "distractors": ["font-color", "text-color", "spacing", "padding", "border"],
                "explanation": "{answer} is used to {action} {reason}."
            }
        ]
    },
    "System Design": {
        "categories": ["Scalability", "Load Balancing", "Caching", "Databases", "APIs", "Security"],
        "difficulty": {"Easy": 0.3, "Medium": 0.5, "Hard": 0.2},
        "templates": [
            {
                "question": "In system design, what is the purpose of {component}?",
                "variations": [
                    {"component": "a load balancer", "answer": "Distribute traffic across servers", "reason": "it helps distribute incoming network traffic"},
                    {"component": "a CDN", "answer": "Deliver content faster", "reason": "it caches content closer to users"},
                ],
                "distractors": [
                    "Store session data",
                    "Process background jobs",
                    "Handle database queries",
                    "Manage user authentication",
                    "Encrypt data"
                ],
                "explanation": "{answer} is the purpose of {component} {reason}."
            }
        ]
    },
    "Computer Science": {
        "categories": ["Algorithms", "Data Structures", "OS", "Networking", "Databases", "Security"],
        "difficulty": {"Easy": 0.3, "Medium": 0.5, "Hard": 0.2},
        "templates": [
            {
                "question": "In computer science, what is {concept}?",
                "variations": [
                    {"concept": "Big O notation", "answer": "A measure of algorithm efficiency", "reason": "it describes the performance of an algorithm"},
                    {"concept": "a binary tree", "answer": "A tree data structure with at most two children per node", "reason": "each node has at most two children"},
                ],
                "distractors": [
                    "A programming language",
                    "A type of computer",
                    "A sorting algorithm",
                    "A database model",
                    "A network protocol"
                ],
                "explanation": "{answer} {reason}."
            }
        ]
    }
}

def generate_question(domain: str, question_id: int) -> Dict[str, Any]:
    """Generate a single MCQ question."""
    config = DOMAIN_CONFIGS[domain]
    template = random.choice(config["templates"])
    variation = random.choice(template["variations"])
    
    # Format the question
    question = template["question"].format(**variation)
    
    # Generate options
    correct_answer = variation["answer"]
    options = [correct_answer]
    
    # Add distractors (wrong answers)
    distractors = [d for d in template["distractors"] if d != correct_answer]
    options.extend(random.sample(distractors, min(4, len(distractors))))
    
    # Ensure we have at least 2 options
    while len(options) < 2:
        options.append(f"Option {len(options) + 1}")
    
    random.shuffle(options)
    
    # Get the index of the correct answer
    correct_idx = options.index(correct_answer)
    
    # Format explanation
    explanation_template = template.get("explanation", "The correct answer is {answer}.")
    # Create a safe dictionary with all variables, avoiding duplicates
    format_vars = {**variation, "answer": correct_answer}
    # Remove any duplicate keys to avoid the 'multiple values' error
    safe_vars = {k: v for k, v in format_vars.items() if k not in ('answer',) or k not in variation}
    safe_vars.update({"answer": correct_answer})  # Ensure answer is always included
    explanation = explanation_template.format(**safe_vars)
    
    # Determine difficulty based on configuration
    difficulty = random.choices(
        list(config["difficulty"].keys()),
        weights=config["difficulty"].values()
    )[0]
    
    return {
        "id": f"{domain[:3].upper()}{question_id:04d}",
        "question": question,
        "options": options,
        "correctAnswer": correct_idx,
        "explanation": explanation,
        "category": random.choice(config["categories"]),
        "difficulty": difficulty,
        "tags": [domain.lower(), difficulty.lower()] + [random.choice(config["categories"]).lower()]
    }

def main():
    output_dir = os.path.join(os.path.dirname(__file__), "mcqs")
    os.makedirs(output_dir, exist_ok=True)
    
    all_questions = []
    
    for domain in DOMAINS:
        print(f"\nGenerating {QUESTIONS_PER_DOMAIN} {domain} MCQs...")
        domain_questions = []
        
        for i in range(1, QUESTIONS_PER_DOMAIN + 1):
            try:
                question = generate_question(domain, i)
                domain_questions.append(question)
                if i % 100 == 0:
                    print(f"  Generated {i}/{QUESTIONS_PER_DOMAIN} questions")
            except Exception as e:
                print(f"Error generating question {i}: {str(e)}")
                continue
        
        # Save domain-specific questions
        domain_file = os.path.join(output_dir, f"{domain.lower().replace(' ', '_')}_mcqs.json")
        with open(domain_file, 'w', encoding='utf-8') as f:
            json.dump({
                "metadata": {
                    "domain": domain,
                    "totalQuestions": len(domain_questions),
                    "categories": DOMAIN_CONFIGS[domain]["categories"],
                    "difficultyDistribution": DOMAIN_CONFIGS[domain]["difficulty"],
                    "generatedOn": datetime.now().isoformat(),
                    "version": "1.0.0"
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
                "domains": DOMAINS,
                "generatedOn": datetime.now().isoformat(),
                "version": "1.0.0"
            },
            "questions": all_questions
        }, f, indent=2)
    
    print(f"\n🎉 Generated {len(all_questions)} MCQs in total!")
    print(f"📁 Individual domain files saved in: {os.path.abspath(output_dir)}")
    print(f"📄 Combined file saved as: {os.path.abspath(all_questions_file)}")

if __name__ == "__main__":
    main()
