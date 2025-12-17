import { Clock, ShieldAlert } from "lucide-react";

type Question = {
  type: string;
  question: string;
};

type QuestionPanelProps = {
  question: Question;
  currentIndex: number;
  total: number;
  timeLeft: number;
  violations: number;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default function QuestionPanel({
  question,
  currentIndex,
  total,
  timeLeft,
  violations,
}: QuestionPanelProps) {
  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
        <div
          className="h-full bg-[oklch(0.21_0.006_285.885)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8 mt-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[oklch(0.21_0.006_285.885)] bg-gray-100 px-2 py-1 rounded uppercase">
            Question {currentIndex + 1} / {total}
          </span>

          {/* Violation Badge */}
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${
              violations > 0
                ? "bg-amber-50 text-amber-600 border-amber-100"
                : "bg-gray-50 text-gray-400 border-gray-100"
            }`}
          >
            <ShieldAlert size={12} />
            <span>
              {violations} Violation{violations !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded border ${
            timeLeft < 60
              ? "text-red-600 bg-red-50 border-red-100"
              : "text-gray-700 bg-gray-100 border-gray-200"
          }`}
        >
          <Clock size={16} />
          <span className="font-mono font-semibold text-sm">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center text-center px-4">
        <h2 className="text-2xl font-medium text-gray-800 leading-relaxed">
          {question.question}
        </h2>
      </div>
    </div>
  );
}
