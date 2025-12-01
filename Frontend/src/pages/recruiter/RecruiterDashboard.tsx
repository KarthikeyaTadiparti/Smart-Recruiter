// RecruiterDashboard.tsx
import React, { useEffect, useState, FormEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Users, Clock8, CircleCheckBig, TrendingUp, Code } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { useNavigate } from "react-router-dom";
import { _createCompany } from "@/redux/actions/auth-actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const metrics = [
  {
    title: "Total Interviews",
    value: "247",
    icon: Users,
  },
  {
    title: "On-going Interviews",
    value: "18",
    icon: Clock8,
  },
  {
    title: "Completed Interviews",
    value: "229",
    icon: CircleCheckBig,
  },
  {
    title: "Avg Candidate Score",
    value: "8.2",
    icon: TrendingUp,
  },
];

const recentInterviews = [
  {
    id: "intv-1",
    title: "Senior Frontend Developer",
    type: "Behavioural",
    status: "Active",
    techStack: ["React", "Next.js", "Tailwind CSS"],
    candidates: "2",
  },
  {
    id: "intv-2",
    title: "Senior Frontend Developer",
    type: "Behavioural",
    status: "Active",
    techStack: ["React", "Next.js", "Tailwind CSS"],
    candidates: "2",
  },
  {
    id: "intv-3",
    title: "Senior Frontend Developer",
    type: "Behavioural",
    status: "Active",
    techStack: ["React", "Next.js", "Tailwind CSS"],
    candidates: "2",
  },
  {
    id: "intv-4",
    title: "Senior Frontend Developer",
    type: "Behavioural",
    status: "Active",
    techStack: ["React", "Next.js", "Tailwind CSS"],
    candidates: "2",
  },
];

export default function RecruiterDashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userData = useAppSelector((state) => state.auth.userData?.data?.user);
  const company = useAppSelector((state) => state.auth.userData?.data?.company);

  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: "",
    description: "",
    website: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userData?.role === "recruiter" && !company) {
      setShowCompanyDialog(true);
    }
  }, [userData, company]);

  async function handleCompanySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!companyForm.name || !companyForm.description || !companyForm.website) return;
    setSubmitting(true);
    const { payload }: any = await dispatch(_createCompany({ data: companyForm, navigate }));
    setSubmitting(false);
    if (payload?.data?.status) {
      toast.success(payload.data.message);
      setShowCompanyDialog(false);
    }
  }
  return (
    <div className="flex flex-1 flex-col gap-4 relative">
      {showCompanyDialog && (
        <Dialog open={showCompanyDialog} onOpenChange={setShowCompanyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Company Details</DialogTitle>
              <DialogDescription>
                Please provide your company details to continue using the recruiter
                dashboard.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCompanySubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyForm.name}
                  onChange={(e) =>
                    setCompanyForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Acme Inc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-description">Description</Label>
                <textarea
                  id="company-description"
                  value={companyForm.description}
                  onChange={(e) =>
                    setCompanyForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Short description about your company"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-website">Website</Label>
                <Input
                  id="company-website"
                  type="url"
                  value={companyForm.website}
                  onChange={(e) =>
                    setCompanyForm((prev) => ({ ...prev, website: e.target.value }))
                  }
                  placeholder="https://www.example.com"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
      <section className="flex flex-col gap-4 my-4">
        <div>
          <h1 className="text-xl font-semibold">Overview</h1>
          <p className="text-muted-foreground">
            Key metrics for your recruitment activities
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

      <section className="flex flex-col gap-4 my-4">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Recently Created Interviews</h1>
            <p className="text-muted-foreground">
              Manage and track your latest interview sessions
            </p>
          </div>
          <Button>View All</Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {recentInterviews.map((item) => (
            <Card className="rounded-sm w-full" key={item.id} aria-label={item.title}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="font-semibold text-lg">
                    {item.title}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 px-2 py-1 text-sm rounded-full"
                  >
                    {item.status}
                  </Badge>
                </div>

                <CardDescription className="flex gap-1 items-center">
                  <Users className="h-4" aria-hidden /> {item.candidates} candidates
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-1 items-center">
                    <Code className="h-4 text-muted-foreground" aria-hidden />
                    <span className="text-sm font-medium">Tech Stack:</span>
                  </div>

                  <div className="flex gap-2 items-center flex-wrap">
                    {item.techStack.map((tech, idx) => (
                      <Badge
                        key={`${item.id}-${tech}-${idx}`}
                        className="bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded-full"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Type: {item.type}</p>

                    {/* keep the primary action visible on larger screens */}
                    <div className="hidden md:block">
                      <Button>View Details</Button>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end">
                {/* footer action always available (useful for small screens) */}
                <Button variant="ghost">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
