import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import {
  Users,
  CircleCheckBig,
  MessageCircleMore,
  CodeXml,
  CalendarFold,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "@/components/ui/badge";
import { _getApplicationsByCandidateId } from "@/redux/actions/application-actions";
import { useNavigate } from "react-router-dom";
import { Application, CandidateMetrics, Metric } from "@/types/types";
import { Spinner } from "@/components/ui/spinner";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { formatDate, limitWords } from "@/lib/utils";
import { RootState } from "@/redux/reducers";


export default function CandidateDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userData } = useAppSelector((state: RootState) => state.auth);
  const { loading } = useAppSelector((state: RootState) => state.application);

  const [candidateApplications, setCandidateApplications] = useState<Application[]>([]);
  const [candidateMetrics, setCandidateMetrics] = useState<CandidateMetrics | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (userData.id) {
        try {
          const { payload } = await dispatch(_getApplicationsByCandidateId({ id: userData.id, navigate }));
          setCandidateMetrics(payload.data.metrics);
          setCandidateApplications(payload.data.applications);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetch();
  }, [dispatch, userData.id, navigate]);

  const metrics: Metric[] = [
    {
      title: "Total Interviews",
      value: candidateMetrics?.interviewsAttended?.toString() || "0",
      icon: Users,
    },
    {
      title: "Average \n Technical Score",
      value: candidateMetrics?.avgTechnicalScore || "0",
      icon: CodeXml,
    },
    {
      title: "Average \n Communication Score",
      value: candidateMetrics?.avgCommunicationScore || "0",
      icon: MessageCircleMore,
    },
    {
      title: "Average \n Confidence Score",
      value: candidateMetrics?.avgConfidenceScore || "0",
      icon: CircleCheckBig,
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4">

      {(loading.fetch && candidateApplications.length === 0)
        && (<div className="absolute inset-0 z-60 grid place-items-center bg-white/70">
          <Spinner className="size-8" />
        </div>)}

      {/* metrics */}
      <section className="flex flex-col gap-4 my-4">
        <div>
          <h1 className="text-xl font-semibold">Overview</h1>
          <p className="text-muted-foreground">
            Key insights into your job applications
          </p>
        </div>

        <div className="flex gap-4">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                className="flex flex-row flex-1 justify-between items-center h-[120px] px-4 py-8 rounded-sm"
                key={item.title}
                aria-label={`${item.title} metric`}
              >
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-muted-foreground font-semibold whitespace-pre-line">
                    {item.title}
                  </div>
                  <div className="text-2xl font-bold">{item.value}</div>
                </div>

                <div className="rounded-sm bg-gray-200 p-2">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* recent interviews */}
      <section className="flex flex-col gap-4 my-4">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">
              Recently Attended Interviews
            </h1>
            <p className="text-muted-foreground">
              Track your upcoming and past interviews
            </p>
          </div>
          <Button onClick={() => navigate("/candidate/my-interviews")}>View All</Button>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          {candidateApplications.map((item) => (
            <Card
              className="rounded-sm w-full"
              key={item.applicationId}
              aria-label={item.jobRole}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="font-semibold text-lg">
                    {item.jobRole}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${(!item.status || item.status === 'pending') ? 'bg-amber-50 text-amber-600 border-amber-200' : item.status === 'selected' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}
                  >
                    {(!item.status || item.status === 'pending') ? 'Under Review' : item.status === 'selected' ? 'Selected' : 'Rejected'}
                  </Badge>
                </div>

                <CardDescription className="flex gap-1 items-center">
                  <CalendarFold className="h-4" aria-hidden />{" "}
                  {formatDate(item.createdAt)}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="flex-1">
                      <h3 className="text-md font-semibold">Technical</h3>
                      <p className="text-md text-muted-foreground">
                        {item.technicalScore}/10
                      </p>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-md font-semibold">Communication</h3>
                      <p className="text-md text-muted-foreground">
                        {item.communicationScore}/10
                      </p>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-md font-semibold">Confidence</h3>
                      <p className="text-md text-muted-foreground">
                        {item.confidenceScore}/10
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-semibold">Feedback Summary</h3>
                    <p className="text-md text-muted-foreground">
                      {limitWords(item.feedback, 30)}
                    </p>
                  </div>

                  <Button
                    className="w-auto self-end"
                    onClick={() => navigate(`/candidate/my-interviews/${item.applicationId}`)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {candidateApplications.length === 0 && !loading.fetch && (
            <div className="col-span-2 text-center py-10 text-muted-foreground">
              No interview feedbacks found yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
