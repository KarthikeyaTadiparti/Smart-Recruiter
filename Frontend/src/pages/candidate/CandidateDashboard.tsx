import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Users, CircleCheckBig, MessageCircleMore, CodeXml, CalendarFold } from 'lucide-react'
import { Button } from '../../components/ui/button';
import { Badge } from "@/components/ui/badge"

const metrics = [
  {
    title: 'Total Interviews',
    value: '12',
    icon: Users
  },
  {
    title: 'Average \n Technical Score',
    value: '8.2',
    icon: CodeXml
  },
  {
    title: 'Average \n Communication Score',
    value: '7.7',
    icon: MessageCircleMore
  },
  {
    title: 'Average \n Confidence Score',
    value: '8.2',
    icon: CircleCheckBig
  }
];

const recentInterviews = [
  {
    title: 'Senior Frontend Developer',
    date: 'Aug 1,2025',
    status: 'Completed',
    technical: '8.2',
    communication: '7.7',
    confidence: '8.2',
    feedback: 'Excellent problem-solving skills demonstrated with the React component challenge. Communication was clear and concise. Could elaborate more on system design choices',
  },
  {
    title: 'Senior Frontend Developer',
    date: 'Aug 1,2025',
    status: 'Completed',
    technical: '8.2',
    communication: '7.7',
    confidence: '8.2',
    feedback: 'Excellent problem-solving skills demonstrated with the React component challenge. Communication was clear and concise. Could elaborate more on system design choices',
  },
  {
    title: 'Senior Frontend Developer',
    date: 'Aug 1,2025',
    status: 'Completed',
    technical: '8.2',
    communication: '7.7',
    confidence: '8.2',
    feedback: 'Excellent problem-solving skills demonstrated with the React component challenge. Communication was clear and concise. Could elaborate more on system design choices',
  },
];

function CandidateDashboard() {
  return (
    <div className='flex flex-1 flex-col gap-4'>
      <section className='flex flex-col gap-4 my-4'>
        <div>
          <h1 className='text-xl font-semibold'>Overview</h1>
          <p className='text-muted-foreground'>Key insights into your job applications</p>
        </div>

        <div className='flex gap-4'>
          {metrics.map((item) => (
            <Card className="flex flex-row flex-1 justify-between items-center h-[120px] px-4 py-8 rounded-sm" key={item.title}>
              <div className="flex flex-col gap-1">
                <div className="text-sm text-muted-foreground font-semibold whitespace-pre-line">{item.title}</div>
                <div className="text-2xl font-bold">{item.value}</div>
              </div>

              <div className="rounded-sm bg-gray-200 p-2">
                <item.icon />
              </div>
            </Card>

          ))}
        </div>
      </section>

      <section className='flex flex-col gap-4 my-4'>
        <div className='flex flex-row justify-between items-center'>
          <div>
            <h1 className='text-xl font-semibold'>Recently Attended Interviews</h1>
            <p className='text-muted-foreground'>Track your upcoming and past interviews
            </p>
          </div>
          <Button>View All</Button>
        </div>

        <div className='grid grid-cols-2 gap-4 w-full'>
          {recentInterviews.map((item,index) => (
            <Card className='rounded-sm w-full' key={index}>
              <CardHeader>
                <div className='flex justify-between'>
                  <CardTitle className='font-semibold text-lg'>{item.title}</CardTitle>
                  <Badge variant="outline" className='bg-green-100 text-green-700 px-2 py-1 text-sm rounded-full'>{item.status}</Badge>
                </div >

                <CardDescription className='flex gap-1 items-center'> <CalendarFold className='h-4' /> {item.date}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className='flex flex-col gap-4'>
                  <div className='flex flex-row gap-2 items-center'>
                    <div className='flex-1'>
                      <h3 className='text-md font-semibold'>Technical</h3>
                      <p className='text-md text-muted-foreground'>{item.technical}/10</p>
                    </div>

                    <div className='flex-1'>
                      <h3 className='text-md font-semibold'>Communication</h3>
                      <p className='text-md text-muted-foreground'>{item.communication}/10</p>
                    </div>

                    <div className='flex-1'>
                      <h3 className='text-md font-semibold'>Confidence</h3>
                      <p className='text-md text-muted-foreground'>{item.confidence}/10</p>
                    </div>
                  </div>

                  <div>
                    <h3 className='text-md font-semibold'>Feedback Summary</h3>
                    <p className='text-md text-muted-foreground'>{item.feedback}</p>
                  </div>

                  <Button className="w-auto self-end">View Details</Button>

                </div>
              </CardContent>
            </Card>
          ))}

        </div>
      </section>
    </div>
  )
}

export default CandidateDashboard