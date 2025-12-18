import { Maximize, ShieldAlert } from 'lucide-react';

interface StartScreenProp {
    interview: any;
    startInterview: () => void;
}

function StartScreen({ interview, startInterview }: StartScreenProp) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
            <div className="max-w-lg w-full bg-white rounded-xl p-8 border border-gray-200 text-center shadow-lg">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert size={32} />
                </div>
                <h1 className="text-2xl font-bold mb-2 text-gray-900">Technical Assessment</h1>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    You are about to start a <strong>{interview.interviewDuration} minute</strong> technical interview for the <strong>{interview.jobRole}</strong> role.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left border border-gray-200">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Proctoring Rules</h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-3">
                            <Maximize size={18} className="text-primary mt-0.5" />
                            <span><strong>Fullscreen Mode:</strong> The interview must be taken in fullscreen. Exiting will be recorded as a violation.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <ShieldAlert size={18} className="text-primary mt-0.5" />
                            <span><strong>Tab Switching:</strong> Moving to another tab or window is monitored and will be flagged.</span>
                        </li>
                    </ul>
                </div>

                <button
                    onClick={startInterview}
                    className="w-full bg-primary hover:opacity-90 text-white py-3 rounded-lg text-lg font-medium shadow-md transition-all flex items-center justify-center gap-2"
                >
                    Start Interview
                </button>
            </div>
        </div>
    );
}

export default StartScreen