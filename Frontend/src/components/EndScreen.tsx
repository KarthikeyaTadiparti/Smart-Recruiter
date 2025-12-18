import { StopCircle } from "lucide-react";

interface EndScreenProps {
    interview : any;
    tabSwitches : number;
}
function EndScreen({interview, tabSwitches}: EndScreenProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
            <div className="max-w-md w-full bg-white rounded-xl p-8 border border-gray-200 text-center shadow-lg">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <StopCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Interview Completed</h2>
                <p className="text-gray-500 mb-6">Thank you for attending the technical round.</p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-3 border border-gray-100">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-mono font-medium">{interview.interviewDuration} mins</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Questions Answered:</span>
                        <span className="font-mono font-medium">{interview.questions.length}/{interview.noOfQuestions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Violations Detected:</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-sm ${tabSwitches > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {tabSwitches}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-primary hover:opacity-90 text-white py-2.5 rounded-lg transition-colors font-medium shadow-sm"
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
}

export default EndScreen