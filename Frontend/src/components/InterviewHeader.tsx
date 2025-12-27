import Logo from "./Logo";

interface InterviewHeaderProps {
  jobRole: string;
  stopInterview: () => void;
}

export default function InterviewHeader({ jobRole, stopInterview }: InterviewHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <Logo />
        <div className="h-8 w-px bg-gray-200 mx-1"></div>
        <div>
          <h1 className="font-semibold text-sm text-gray-900">{jobRole}</h1>
          <div className="text-xs text-gray-500">Technical Assessment</div>
        </div>
      </div>

      <div className="flex items-center gap-4">

        <button
          onClick={stopInterview}
          className="ml-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
        >
          End Session
        </button>
      </div>
    </header>

  );
}
