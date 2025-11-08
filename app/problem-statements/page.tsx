import HackathonProblems from "@/components/HackathonProblems";

export default function ProblemStatementsPage() {
  return (
    <div className="pt-24 px-8 pb-8 bg-black text-white min-h-screen">
      <h1 className="font-alata text-4xl font-bold text-white mb-8">Problem Statements</h1>
      <HackathonProblems />
    </div>
  );
}
