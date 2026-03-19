import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Search,
    Eye,
    ShieldAlert,
    CheckCircle,
    AlertTriangle,
    Check,
    X,
} from 'lucide-react';
import { Post } from '@/lib/api-calls';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import { _getApplicationsByJobId } from '@/redux/actions/application-actions';
import { Spinner } from '@/components/ui/spinner';
import { FeedbackData } from '@/types/types';

const InterviewReport = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading } = useAppSelector((state) => state.application);
    const [applications, setApplications] = useState<FeedbackData[]>([]);
    const [sendingEmailState, setSendingEmailState] = useState<{ id: number, type: 'accept' | 'reject' } | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchApplications = async () => {
            if (id) {
                try {
                    const { payload } = await dispatch(_getApplicationsByJobId({ id, navigate }));
                    setApplications(payload.data.applications);
                }
                catch (error) {
                    console.error("create interview error:", error);
                }
            }
        }
        fetchApplications();
    }, [id, dispatch, navigate]);



    // Helper to determine status and cheating score
    const getApplicationStatus = (tabSwitches: number) => {
        if (tabSwitches === 0) return { label: 'Clean', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle };
        if (tabSwitches <= 3) return { label: 'Suspicious', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: AlertTriangle };
        return { label: 'Disqualified', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: ShieldAlert };
    };

    const handleNavigation = (applicationId: number) => {
        navigate(`/recruiter/application/${applicationId}`);
    }

    const handleSendEmail = async (applicationId: number, candidateEmail: string, candidateName: string, status: 'accept' | 'reject', jobRole: string) => {
        setSendingEmailState({ id: applicationId, type: status });
        const payload = {
            applicationId,
            candidateEmail,
            candidateName,
            status,
            jobRole,
        };
        const res = await Post('/applications/send-email', payload, navigate);
        if (res?.status === 200) {
            toast.success(`Successfully sent ${status} email to ${candidateName}`);
            
            setApplications(prev => prev.map(app => 
                app.application.applicationId === applicationId 
                    ? { ...app, application: { ...app.application, status: res.data.newStatus } }
                    : app
            ));
        }
        setSendingEmailState(null);
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.candidate.email.toLowerCase().includes(searchTerm.toLowerCase());

        const statusData = getApplicationStatus(app.application.tabSwitches);
        const matchesFilter = filter === 'All' || statusData.label === filter;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="flex flex-1 flex-col">

            {(loading.fetch || sendingEmailState) && (
                <div className="absolute inset-0 z-60 grid place-items-center bg-white/70">
                    <Spinner className="size-8" />
                </div>
            )}
            <div className="w-full mx-auto space-y-6">
                {/* Filters and Search Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
                        {['All', 'Clean', 'Suspicious', 'Disqualified'].map((f) => (
                            <Button
                                key={f}
                                variant="ghost"
                                className={`px-5 py-2 h-9 text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap ${filter === f
                                    ? "bg-[#0F172A] text-white shadow-md hover:bg-[#0F172A] hover:text-white"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </Button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                        <Input
                            placeholder="Search candidates..."
                            className="pl-11 h-11 bg-white border-slate-200 rounded-xl focus-visible:ring-slate-200 focus-visible:border-slate-300 transition-all shadow-sm text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Layout */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/30">
                                <TableHead className="py-5 px-8 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Candidate</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Overall Score</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Tab Switches</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Integrity</TableHead>
                                <TableHead className="py-5 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Actions</TableHead>
                                <TableHead className="py-5 px-8 text-right font-bold text-slate-400 uppercase text-[10px] tracking-widest">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredApplications.map((app) => {
                                const status = getApplicationStatus(app.application.tabSwitches);
                                // const cheatingScore = getCheatingScore(app.application.tabSwitches);

                                return (
                                    <TableRow
                                        key={app.application.applicationId}
                                        className="group hover:bg-slate-50/50 transition-colors duration-200 border-slate-100"
                                    >
                                        <TableCell className="py-6 px-8">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-semibold text-slate-900 text-[15px]">
                                                    {app.candidate.name}
                                                </span>
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {app.candidate.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex items-center gap-1 font-semibold text-slate-900 tabular-nums">
                                                <span className="text-[15px]">{Number(app.application.overallScore).toFixed(1)}</span>
                                                <span className="text-slate-500 text-xs mt-0.5">/10</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <span className="font-semibold text-slate-700 tabular-nums text-[15px]">
                                                {app.application.tabSwitches}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <Badge variant="outline" className={`${status.color} border px-4 py-1.5 font-bold text-[10px] uppercase tracking-wider rounded-full flex items-center gap-1.5 w-fit`}>
                                                <status.icon className="h-3 w-3" />
                                                {status.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    className="bg-primary text-white hover:bg-primary/80 hover:text-white font-semibold text-xs gap-2 rounded-lg transition-all shadow-sm h-9 px-4"
                                                    onClick={() => {
                                                        handleNavigation(app.application.applicationId);
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View Details
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6 px-8 min-w-[180px] text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {(!app.application.status || app.application.status === 'pending') ? (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            disabled={sendingEmailState?.id === app.application.applicationId}
                                                            className="bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 hover:text-emerald-700 font-semibold text-xs gap-1 rounded-lg transition-all shadow-sm h-8 px-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                                            onClick={() => {
                                                                handleSendEmail(app.application.applicationId, app.candidate.email, app.candidate.name, 'accept', app.application.jobRole || 'the specified role');
                                                            }}
                                                        >
                                                            <Check className="h-3 w-3" />
                                                            Accept
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            disabled={sendingEmailState?.id === app.application.applicationId}
                                                            className="bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 hover:border-rose-300 hover:text-rose-700 font-semibold text-xs gap-1 rounded-lg transition-all shadow-sm h-8 px-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                                            onClick={() => {
                                                                handleSendEmail(app.application.applicationId, app.candidate.email, app.candidate.name, 'reject', app.application.jobRole || 'the specified role');
                                                            }}
                                                        >
                                                            <X className="h-3 w-3" />
                                                            Reject
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Badge variant="outline" className={`px-4 py-1.5 font-bold text-[10px] uppercase tracking-wider rounded-full ${app.application.status === 'selected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                        {app.application.status === 'selected' ? 'Selected' : 'Rejected'}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {filteredApplications.length === 0 && (
                        <div className="py-24 flex flex-col items-center justify-center text-slate-400 space-y-4 bg-white">
                            <div className="p-4 bg-slate-50 rounded-full">
                                <Search className="h-8 w-8 text-slate-300 stroke-[1.5px]" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-slate-900 font-bold text-base">No results found</h3>
                                <p className="text-slate-400 text-sm">
                                    No candidates match your current search or filter.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewReport;