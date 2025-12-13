import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { _generateQuestions } from "@/redux/actions/job-actions";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DatePickerButtonRHF from "@/components/DatePickerButtonRHF";


export interface Job {
  job_role: string;
  description: string;
  tech_stack: string;
  experience: number;
  location: string;
  closed_at: string; // "YYYY-MM-DD" or ""
  interview_duration: string;
  interview_type: string;
  no_of_questions: string;
}

function CreateInterview() {
  const form = useForm<Job>({
    defaultValues: {
      job_role: "",
      description: "",
      tech_stack: "",
      experience: 0,
      location: "",
      closed_at: "",
      interview_duration: "",
      interview_type: "",
      no_of_questions: "",
    },
  });
  const { userData } = useAppSelector((state) => state.auth);
  const company = userData.company;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Job> = async (data) => {
    console.log("form submit:", data);

    try {
      const { payload } = await dispatch(_generateQuestions({data: {...data,companyId: company.id}, navigate}));

      console.log("payload : ", payload?.data);

      if (payload?.data?.status) {
        toast.success(payload.data.message);
        navigate(`/recruiter/interview-questions/${payload.data.job.jobId}`);
      }
      else {
        toast.error(payload?.data?.message || "Failed to create interview");
      }
    } catch (err) {
      console.error("generateQuestions error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };



  return (
    <main className="flex flex-1 flex-col gap-4 relative p-4">

      <Card className="w-3/5 mx-auto px-6 py-8">
        <CardHeader className="px-0">
          <CardTitle className="text-xl font-medium">New Job Posting</CardTitle>
          <CardDescription className="text-gray-500 text-sm">Provide the role details, required skills, and interview details to publish your job opening.</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Job Role */}
            <FormField
              control={form.control}
              name="job_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Frontend Developer" {...field} className="py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the role..." {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tech Stack */}
            <FormField
              control={form.control}
              name="tech_stack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech Stack</FormLabel>
                  <FormControl>
                    <Input placeholder="React, Node, SQL..." {...field} className="py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Experience & Location */}
            <div className="flex gap-4 justify-center items-center">
              {/* Experience */}
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Experience (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2" {...field} className="py-6" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Hyderabad" {...field} className="py-6" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Closing Date & Questions */}
            <div className="flex gap-4 justify-center items-center">
              {/* Closing Date */}
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="closed_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <DatePickerButtonRHF field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* No of Questions */}
              <FormField
                control={form.control}
                name="no_of_questions"
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-2">
                    <FormLabel>No. of Questions</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full py-6">
                          <SelectValue placeholder="5 Questions" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        <SelectItem value="15">15 Questions</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Duration & Type */}
            <div className="flex gap-4 justify-center items-center">
              {/* Duration */}
              <FormField
                control={form.control}
                name="interview_duration"
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-2">
                    <FormLabel>Interview Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full py-6">
                          <SelectValue placeholder="5 Minutes" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">5 Minutes</SelectItem>
                        <SelectItem value="10">10 Minutes</SelectItem>
                        <SelectItem value="20">20 Minutes</SelectItem>
                        <SelectItem value="30">30 Minutes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name="interview_type"
                render={({ field }) => (
                  <FormItem className="flex-1 space-y-2">
                    <FormLabel>Interview Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full py-6">
                          <SelectValue placeholder="Technical" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="behavioural">Behavioural</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <div className="flex justify-end">
              <Button type="submit" className="py-6 px-8">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </Card>

    </main>
  );
}

export default CreateInterview;
