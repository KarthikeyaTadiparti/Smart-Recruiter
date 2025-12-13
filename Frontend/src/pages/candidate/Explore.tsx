import React, { useEffect, useState } from "react";
import {
  Search,
  Building2,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/hooks/use-redux";
import { _getAllJobs } from "@/redux/actions/interview-actions";
import { useNavigate } from "react-router-dom";

/* ===============================
   Types
================================ */
type Job = {
  jobId: number;
  jobRole: string;
  description: string;
  techStack: string;
  experience: number;
  location: string;
  closedAt: string;
  companyId: number;
  companyName: string;
  interviewId: number;
  interviewType: string;
  interviewDuration: number;
  noOfQuestions: number;
};

/* ===============================
   Helpers
================================ */
const experienceText = (exp: number) =>
  exp === 0 ? "Fresher" : `${exp} yr${exp > 1 ? "s" : ""}`;

const techArray = (stack: string) =>
  stack.split(",").map((t) => t.trim());

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const isClosed = (date: string) =>
  new Date(date) < new Date();

const truncateWords = (text: string, maxWords = 12) => {
  if (!text) return "";

  const words = text.split(" ");
  if (words.length <= maxWords) return text;

  return words.slice(0, maxWords).join(" ") + "…";
};

/* ===============================
   Component
================================ */
function Explore() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const payload = await dispatch(_getAllJobs({ navigate })).unwrap();
        console.log(payload);
        setJobs(payload.data.jobs);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      }
    };

    fetchJobs();
  }, [dispatch]);

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div className="mt-4">
        <h1 className="text-xl font-semibold">Explore Jobs</h1>
        <p className="text-slate-500">
          Find interviews and hiring challenges from companies
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 border border-slate-200 px-4 py-2 rounded-md bg-white">
        <Search className="h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by role or tech stack"
          className="border-none shadow-none focus-visible:ring-0 p-0"
        />
      </div>

      {/* Jobs Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => {
          const closed = isClosed(job.closedAt);

          return (
            <div
              key={job.jobId}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              {/* Top */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <h3 className="text-lg font-semibold capitalize">
                    {job.jobRole}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{job.companyName}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-2">
                    {truncateWords(job.description, 30)}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={
                      job.experience === 0
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-700"
                    }
                  >
                    {experienceText(job.experience)}
                  </Badge>

                  <Badge variant="outline" className="capitalize">
                    {job.interviewType}
                  </Badge>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {techArray(job.techStack).map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-slate-100/80 border-slate-200"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Meta */}
                <div className="space-y-2 text-sm text-slate-500 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {job.noOfQuestions} questions
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {job.interviewDuration} min interview
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {closed ? (
                      <span className="text-red-600 font-medium">
                        Closed
                      </span>
                    ) : (
                      <span>Closes on {formatDate(job.closedAt)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button
                disabled={closed}
                className={`mt-6 w-full gap-2 ${closed
                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                  : "bg-slate-950 hover:bg-slate-800"
                  }`}
              >
                {closed ? "Closed" : "Join Interview"}
                {!closed && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default Explore;
