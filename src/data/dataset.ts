// This file contains the dataset for the chat functionality
// It's imported directly in the API route for use in the Edge Runtime

interface DatasetItem {
  instruction: string;
  input: string;
  output: string;
}

const dataset: DatasetItem[] = [
  {
    "instruction": "Write a Python function to reverse a singly linked list.",
    "input": "",
    "output": "def reverse_linked_list(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev"
  },
  {
    "instruction": "Write an SQL query to find second highest salary.",
    "input": "",
    "output": "SELECT MAX(salary) FROM employees WHERE salary < (SELECT MAX(salary) FROM employees);"
  },
  {
    "instruction": "Explain context switching.",
    "input": "",
    "output": "Context switching is saving the state of a CPU-bound process/thread and loading the state of another, allowing multitasking. It involves overhead for saving registers, memory mapping, and switching kernel structures."
  },
  {
    "instruction": "What is a process vs a thread?",
    "input": "",
    "output": "A process is an independent program with its own memory space. A thread is a lightweight unit of execution within a process sharing the same memory space; threads allow concurrency with lower overhead."
  },
  {
    "instruction": "Explain OOP principles: Encapsulation, Inheritance, Polymorphism, Abstraction.",
    "input": "",
    "output": "Encapsulation hides internal state, providing interfaces. Inheritance allows classes to derive from others. Polymorphism allows methods to behave differently. Abstraction models essential features."
  }
];

export default dataset;
