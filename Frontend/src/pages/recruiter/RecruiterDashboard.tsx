import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Users, Clock8, TrendingUp, Code, BriefcaseBusiness } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { useNavigate } from "react-router-dom";
import { _getJobsByRecruiterId } from "@/redux/actions/job-actions";
import { limitWords } from "@/lib/utils";
import useCompany from "@/hooks/useCompany";
import CompanyDialog from "@/components/CompanyDialog";
import { Spinner } from "@/components/ui/spinner";

const getMetricData = (recruiterMetrics: any) => [
  {
    title: "Interviews Created",
    value: recruiterMetrics?.jobsCreated || 0,
    icon: BriefcaseBusiness,
  },
  {
    title: "Total Candidates",
    value: recruiterMetrics?.totalCandidatesInterviewed || 0,
    icon: Users,
  },
  {
    title: "Avg Candidate Score",
    value: recruiterMetrics?.avgOverallCandidatesScore?.toFixed(1) || "0.0",
    icon: TrendingUp,
  },
  {
    title: "Interview Minutes",
    value: recruiterMetrics?.interviewMinutes || 0,
    icon: Clock8,
  },
];

export default function RecruiterDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authData = useAppSelector((state) => state.auth)
  const userData = authData.userData;

  const [recruiterMetrics, setRecruiterMetrics] = useState<any>(null);
  const [recentInterviews, setRecentInterviews] = useState<any>([]);
  const metrics = getMetricData(recruiterMetrics);
  const jobsLoading = useAppSelector((state) => state.job.loading.fetchRecruiterJobs);

  const { loading, showCompanyDialog, companyForm, setCompanyForm, setShowCompanyDialog } = useCompany(authData);


  useEffect(() => {
    const fetchJobs = async () => {
      if (userData?.id) {
        try {
          const { payload } = await dispatch(_getJobsByRecruiterId({ id: userData.id, navigate }));
          setRecruiterMetrics(payload?.data?.metrics);
          setRecentInterviews(payload?.data?.jobs);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchJobs();
  }, [userData, dispatch, navigate]);

  if (showCompanyDialog) {
    {/* company dialog */ }
    return (<CompanyDialog
      loading={loading}
      showCompanyDialog={showCompanyDialog}
      companyForm={companyForm}
      setCompanyForm={setCompanyForm}
      setShowCompanyDialog={setShowCompanyDialog}
    />)
  }


  return (
    <div className="flex flex-1 flex-col gap-4 relative">

      {/* Spinner */}
      {(jobsLoading && recentInterviews.length === 0)
        && (<div className="absolute inset-0 z-60 grid place-items-center bg-white/70">
          <Spinner className="size-8" />
        </div>)}

      {/* Overview */}
      <section className="flex flex-col gap-4 my-4">
        <div>
          <h1 className="text-xl font-semibold">Overview</h1>
          <p className="text-muted-foreground">
            Key metrics for your recruitment activities
          </p>
        </div>
        <div className="flex gap-4">
          {metrics?.map((item: any) => {
            const Icon = item.icon;
            return (
              <Card
                className="flex flex-row flex-1 justify-between items-center h-[120px] px-4 py-8 rounded-sm"
                key={item.title}
                aria-label={`${item.title} metric`}
              >
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-muted-foreground font-semibold">
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

      {/* Interviews */}
      <section className="flex flex-col gap-4 my-4">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Recently Created Interviews</h1>
            <p className="text-muted-foreground">
              Manage and track your latest interview sessions
            </p>
          </div>
          <Button onClick={() => navigate("/recruiter/manage-interview")}>View All</Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {recentInterviews.map((item: any) => (
            <Card className="rounded-sm w-full" key={item.jobId} aria-label={item.jobRole}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="font-semibold text-lg">
                      {item.jobRole}
                    </CardTitle>
                    <div className="flex gap-4 mt-1 text-slate-500 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock8 className="h-3 w-3" /> {item.experience} years exp
                      </span>
                      <span className="flex items-center gap-1">
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1">
                        Expires: {new Date(item.closedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 px-2 py-1 text-sm rounded-full"
                  >
                    Active
                  </Badge>
                </div>

                <CardDescription className="flex flex-col gap-1 h-[50px] text-black">
                  <span className="text-sm text-balance">{limitWords(item.description, 20)}</span>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-1 items-center">
                    <Code className="h-4 text-muted-foreground" aria-hidden />
                    <span className="text-sm font-medium">Tech Stack:</span>
                  </div>

                  <div className="flex gap-2 items-center flex-wrap">
                    {item.techStack.split(",").map((tech: string, idx: number) => (
                      <Badge
                        key={`${item.jobId}-${tech}-${idx}`}
                        className="bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded-full"
                      >
                        {tech.trim()}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span> {item.interviewType}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span> {item.interviewDuration} mins
                    </div>
                    <div>
                      <span className="text-muted-foreground">Questions:</span> {item.noOfQuestions}
                    </div>
                  </div>

                  <div className="flex justify-end items-center">
                    <Button onClick={() => navigate(`/recruiter/manage-interview/${item.jobId}`)}>View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {recentInterviews.length === 0 && !jobsLoading && (
            <div className="col-span-2 text-center py-10 text-muted-foreground">
              No interviews found yet.
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
