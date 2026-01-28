import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import { _getApplication } from '@/redux/actions/application-actions';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Mail,
    MonitorOff,
    Calendar,
    MessageCircleMore,
    CodeXml,
    CircleCheckBig,
    Trophy
} from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { FeedbackData } from '@/types/types';


function Feedback() {
    const { id } = useParams<{ id: string }>();
    const { loading } = useAppSelector((state) => state.application);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState<FeedbackData | null>(null);
    const [isFetched, setIsFetched] = useState(false);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const { payload } = await dispatch(
                    _getApplication({ id: Number(id), navigate })
                );

                if (payload?.data?.status) {
                    setFeedback(payload.data);
                }
            } catch (error) {
                console.error("Error fetching feedback:", error);
            } finally {
                setIsFetched(true);
            }
        };

        fetchFeedback();
    }, [id, dispatch, navigate]);

    if (loading.fetch) {
        return (
            <div className="absolute inset-0 z-60 grid place-items-center bg-white/70">
                <Spinner className="size-8" />
            </div>
        );
    }


    if (isFetched && !feedback) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center h-[60vh] text-muted-foreground">
                <MessageCircleMore className="w-12 h-12 mb-4 opacity-20" />
                <p>No feedback details available.</p>
            </div>
        );
    }

    if (!feedback) {
        return null;
    }


    const { application, candidate } = feedback;

    return (
        <div className="flex flex-1 flex-col gap-6 p-2">
            {/* Header Section */}
            <section className="flex flex-col gap-6 my-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-sm p-6 rounded-sm border border-primary/10 gap-6">
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight capitalize">{candidate.name}'s Interview Results</h1>
                            <Badge className="bg-emerald-500 px-2 py-1 rounded-full text-white border-none hover:bg-emerald-600">Completed</Badge>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            <Mail className="h-4 w-4" /> {candidate.email}
                        </p>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            Interviewed on {new Date(application.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                    </div>

                    <div className="flex flex-row items-center gap-4 bg-white px-6 py-4 rounded-sm border shadow-sm min-w-[200px] justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Overall Score</span>
                            <div className="text-4xl font-black text-primary leading-tight">
                                {application.overallScore}
                                <span className="text-lg text-muted-foreground/50 ml-0.5 font-bold">/10</span>
                            </div>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-sm text-primary">
                            <Trophy className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Metrics Section */}
            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Performance Overview</h2>
                <div className="flex gap-4 flex-wrap">
                    <MetricCard
                        title="Technical Score"
                        value={application.technicalScore}
                        icon={CodeXml}
                    />
                    <MetricCard
                        title="Communication"
                        value={application.communicationScore}
                        icon={MessageCircleMore}
                    />
                    <MetricCard
                        title="Confidence"
                        value={application.confidenceScore}
                        icon={CircleCheckBig}
                    />
                    <MetricCard
                        title="Tab Switches"
                        value={application.tabSwitches.toString()}
                        icon={MonitorOff}
                        isWarning={application.tabSwitches > 3}
                    />
                </div>
            </section>

            {/* Q&A Section */}
            <section className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">Interview Q&A Transcript</h2>
                </div>
                <div className="flex flex-col gap-4">
                    {application.questionAnswers.map((qa, index) => (
                        <Card key={index} className="rounded-sm border shadow-sm">
                            <CardHeader>
                                <div className="flex gap-3">
                                    <div className="h-6 w-6 shrink-0 flex items-center justify-center rounded-sm bg-muted text-muted-foreground font-bold text-xs">
                                        Q{index + 1}
                                    </div>
                                    <CardTitle className="text-md font-semibold leading-snug">{qa.question}</CardTitle>
                                </div>
                            </CardHeader>
                            <hr className="mx-auto w-6xl" />
                            <CardContent className="px-6">
                                <div className="flex gap-3 items-start">
                                    <div className="h-6 w-6 shrink-0 flex items-center justify-center rounded-sm bg-primary/5 text-primary font-bold text-xs">
                                        A
                                    </div>
                                    <p className="text-muted-foreground text-sm font-medium leading-relaxed">{qa.answer}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>


            {/* Feedback Summary */}
            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Feedback Summary</h2>
                <Card className="rounded-sm border shadow-sm ">
                    <CardContent className="">
                        <p className="text-md leading-relaxed text-foreground font-medium italic">
                            "{application.feedback}"
                        </p>
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}

function MetricCard({ title, value, icon: Icon, isWarning }: { title: string, value: string, icon: any, isWarning?: boolean }) {
    return (
        <Card className="flex flex-row flex-1 min-w-[200px] justify-between items-center h-[100px] px-4 py-4 rounded-sm shadow-sm" aria-label={`${title} metric`}>
            <div className="flex flex-col gap-1">
                <div className="text-xs text-muted-foreground font-semibold whitespace-pre-line uppercase tracking-wider">
                    {title}
                </div>
                <div className="text-xl font-bold">{value}</div>
            </div>
            <div className={`rounded-sm p-2 ${isWarning ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                <Icon className="h-5 w-5" aria-hidden />
            </div>
        </Card>
    );
}

export default Feedback