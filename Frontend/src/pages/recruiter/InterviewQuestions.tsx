import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { Code, FolderOpen, HelpCircle, Lightbulb, Pencil, Trash2, UserRound } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { InterviewQuestion } from "@/redux/reducers/interview-reducer";
import type { RootState } from "@/redux/store";
import { toast } from "sonner";
import { _createInterview } from "@/redux/actions/interview-actions";

const getQuestionStyles = (typeString?: string) => {
    const type = (typeString || "").toLowerCase();
    if (type.includes("technical")) {
        return { badge: "bg-blue-100 text-blue-700 border-blue-200", Icon: Code };
    } else if (type.includes("behavioral")) {
        return { badge: "bg-green-100 text-green-700 border-green-200", Icon: UserRound };
    } else if (type.includes("scenario")) {
        return { badge: "bg-purple-100 text-purple-700 border-purple-200", Icon: Lightbulb };
    } else {
        return { badge: "bg-gray-100 text-gray-700 border-gray-200", Icon: HelpCircle };
    }
};

const InterviewQuestions: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();

    const interviewQuestions = useAppSelector((state: RootState) => state.interview.interviewQuestions);
    const questions = Array.isArray(interviewQuestions) ? interviewQuestions : [];


    const handleCreateInterview = async () => {
        try {
            const { payload } = await dispatch(_createInterview({ questions, id, navigate }));

            console.log("payload : ",payload);

            if (payload?.data?.status) {
                toast.success(payload?.data?.message || "Interview created");
                navigate(`/recruiter`);
            } else {
                toast.error(payload?.data?.message || "Failed to create interview");
            }
        } catch (err: any) {
            console.error("create interview error:", err);
            toast.error(err?.message ?? "Something went wrong");
        }
    };

    return (
        <main className="max-w-5xl mx-auto flex flex-1 flex-col p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Interview Questions</h1>
                <p className="text-gray-500 text-sm mt-1">Review the generated questions for the candidate.</p>
            </div>

            <div className="space-y-4">
                {questions.length > 0 ? (
                    questions.map((item: InterviewQuestion, index: number) => {
                        const { badge, Icon } = getQuestionStyles(item.type);
                        const key = (item as any).id ?? `${index}-${item.question?.slice(0, 20)}`;

                        return (
                            <div key={key} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
                                <div className="p-5 flex gap-4">
                                    <div className="flex-shrink-0 pt-1">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-500 text-sm font-semibold border border-gray-100 group-hover:bg-gray-100 transition-colors">
                                            {index + 1}
                                        </span>
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge}`}>
                                                <Icon className="w-3 h-3" />
                                                {item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : "Question"}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 leading-relaxed text-[15px]">{item.question}</p>
                                    </div>

                                    <div className="flex-shrink-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button className="text-gray-400 hover:text-blue-600 p-1" title="Edit">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button className="text-gray-400 hover:text-red-600 p-1" title="Delete">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="w-2xl h-[300px] flex flex-col items-center justify-center text-center py-10 text-gray-400 bg-white rounded-xl border-2 border-gray-200 border-dashed">
                        <FolderOpen className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                        <p>No interview questions found.</p>
                    </div>
                )}
            </div>

            {/* Create Interview button */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleCreateInterview}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-white bg-primary`}
                >
                    <span>Create Interview</span>
                </button>
            </div>
        </main>
    );
};

export default InterviewQuestions;
