import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import { RootState } from '@/redux/store';
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { _getFeedbacksByCandidateId } from '@/redux/actions/feedback-actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarFold } from 'lucide-react'
import { Application } from '@/types/types';

function MyInterviews() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userData } = useAppSelector((state: RootState) => state.auth);
  const { loading } = useAppSelector((state: RootState) => state.feedback);

  const [candidateApplications, setCandidateApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (userData.id) {
        try {
          const { payload } = await dispatch(_getFeedbacksByCandidateId({ id: userData.id, navigate }));
          setCandidateApplications(payload.data.applications);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetch();
  }, [dispatch, userData.id, navigate]);
  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* spinner */}
      {(loading.fetch && candidateApplications.length === 0)
        &&
        (<div className="absolute inset-0 z-60 grid place-items-center bg-white/70">
          <Spinner className="size-8" />
        </div>
        )}

      <section className="flex flex-col gap-4 my-4">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">
              My Interviews
            </h1>
            <p className="text-muted-foreground">
              Your interview history and performance at a glance
            </p>
          </div>
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
                    className="bg-green-100 text-green-700 px-2 py-1 text-sm rounded-full"
                  >
                    Completed
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
  )
}
import { formatDate, limitWords } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

export default MyInterviews