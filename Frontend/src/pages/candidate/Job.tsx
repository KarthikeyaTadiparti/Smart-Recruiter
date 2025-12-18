import React, { useEffect, useState } from "react";
import {
    ChevronRight,
    MapPin,
    Briefcase,
    Clock,
    Globe,
    User,
    Mail,
    Calendar,
    CheckCircle,
    HelpCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { _getJob } from "@/redux/actions/job-actions";
import { Spinner } from "@/components/ui/spinner";
import { IndividualJob } from "@/types/types";

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}

function Job() {
    const { id } = useParams<{ id?: string }>();
    const [job, setJob] = useState<IndividualJob>({
        jobId: 0,
        jobRole: "",
        description: "",
        techStack: "",
        experience: 0,
        location: "",
        closedAt: "",
        interviewType: "",
        interviewDuration: 0,
        noOfQuestions: 0,
        comapnyName: "",
        companyDescription: "",
        website: "",
        recruiterName: "",
        email: "",
    });
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading } = useAppSelector((state) => state.job);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { payload } = await dispatch(_getJob({ id, navigate }));
                setJob(payload.data.job);
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            }
        };
        fetchJob();
    }, []);

    const handleNavigation = (jobId: number) => {
        navigate(`/interviews/${jobId}`);
    };

    const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="text-gray-400 mt-0.5">{icon}</div>
            <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {label}
                </p>
                <p className="text-sm font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    );
    return (
        <>
            {/* Spinner */}
            {loading.fetch && (
                <div className="absolute inset-0 z-50 grid place-items-center bg-white/70">
                    <Spinner className="size-8" />
                </div>
            )}

            <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                            {job.jobRole}
                        </h1>
                        <p className="text-gray-500 flex items-center gap-2">
                            Posted by{" "}
                            <span className="font-medium text-indigo-600">
                                {job.comapnyName}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Active
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            Full Time
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Job Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Overview Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Job Overview
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <InfoItem
                                    icon={<Briefcase size={18} />}
                                    label="Role"
                                    value={job.jobRole}
                                />
                                <InfoItem
                                    icon={<MapPin size={18} />}
                                    label="Location"
                                    value={job.location}
                                />
                                <InfoItem
                                    icon={<Clock size={18} />}
                                    label="Experience"
                                    value={`${job.experience} Year(s)`}
                                />
                                <InfoItem
                                    icon={<Calendar size={18} />}
                                    label="Apply By"
                                    value={job.closedAt}
                                />
                            </div>

                            <div className="prose prose-sm max-w-none text-gray-600">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Description
                                </h3>
                                <p className="mb-4">{job.description}</p>

                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Required Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.techStack
                                        .split(",")
                                        .map((tech, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-200"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Interview Details Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Interview Process
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                    <div className="flex items-center gap-2 mb-1 text-indigo-700 font-medium">
                                        <CheckCircle size={18} /> Type
                                    </div>
                                    <div className="text-gray-900 font-semibold capitalize">
                                        {job.interviewType}
                                    </div>
                                </div>
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                    <div className="flex items-center gap-2 mb-1 text-indigo-700 font-medium">
                                        <Clock size={18} /> Duration
                                    </div>
                                    <div className="text-gray-900 font-semibold">
                                        {job.interviewDuration} Minutes
                                    </div>
                                </div>
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                    <div className="flex items-center gap-2 mb-1 text-indigo-700 font-medium">
                                        <HelpCircle size={18} /> Questions
                                    </div>
                                    <div className="text-gray-900 font-semibold">
                                        {job.noOfQuestions} Questions
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Company & Recruiter Info */}
                    <div className="space-y-6">
                        {/* Company Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                About the Company
                            </h2>
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-xl shrink-0">
                                    {job.comapnyName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        {job.comapnyName}
                                    </h3>
                                    <a
                                        href={job.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                                    >
                                        <Globe size={14} /> Website
                                    </a>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                {job.companyDescription}
                            </p>
                        </div>

                        {/* Recruiter Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Recruiter Contact
                            </h2>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 capitalize">
                                        {job.recruiterName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Hiring Manager
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                                <Mail size={16} />
                                <a
                                    href={`mailto:${job.email}`}
                                    className="hover:text-indigo-600 transition-colors"
                                >
                                    {job.email}
                                </a>
                            </div>
                        </div>

                        {/* Join Button (Sticky on Mobile) */}
                        <div className="sticky bottom-4 md:static">
                            <button
                                onClick={() => handleNavigation(job.jobId)}
                                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Join Interview Session
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Job;
