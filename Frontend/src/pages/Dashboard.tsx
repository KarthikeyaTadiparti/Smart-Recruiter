import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '../components/ui/card';
import { Users, Clock8, CircleCheckBig, TrendingUp, Code } from 'lucide-react'
import { Button } from '../components/ui/button';
import { Badge } from "@/components/ui/badge"

const metrics = [
    {
        title: 'Total Interviews',
        value: '247',
        icon: Users
    },
    {
        title: 'On-going Interviews',
        value: '18',
        icon: Clock8
    },
    {
        title: 'Completed Interviews',
        value: '229',
        icon: CircleCheckBig
    },
    {
        title: 'Avg Candidate Score',
        value: '8.2',
        icon: TrendingUp
    }
];

const recentInterviews = [
    {
        title: 'Senior Frontend Developer',
        type: 'Behavioural',
        status: 'Active',
        techStack: ['React', 'Next.js', 'Tailwind CSS'],
        candidates: '2',
    },
    {
        title: 'Senior Frontend Developer',
        type: 'Behavioural',
        status: 'Active',
        techStack: ['React', 'Next.js', 'Tailwind CSS'],
        candidates: '2',
    },
    {
        title: 'Senior Frontend Developer',
        type: 'Behavioural',
        status: 'Active',
        techStack: ['React', 'Next.js', 'Tailwind CSS'],
        candidates: '2',
    },
    {
        title: 'Senior Frontend Developer',
        type: 'Behavioural',
        status: 'Active',
        techStack: ['React', 'Next.js', 'Tailwind CSS'],
        candidates: '2',
    },

];

function Dashboard() {
    return (
        <div className='flex flex-1 flex-col gap-4'>
            <section className='flex flex-col gap-4'>
                <div>
                    <h1 className='text-2xl font-semibold'>Overview</h1>
                    <p className='text-muted-foreground'>Key metrics for your recruitment activities</p>
                </div>

                <div className='flex gap-4'>
                    {metrics.map((item) => (
                        <Card className="flex flex-row justify-between items-center w-[290px] px-4 py-8 rounded-sm" key={item.title}>
                            <div className="flex flex-col gap-1">
                                <div className="text-sm text-muted-foreground font-semibold">{item.title}</div>
                                <div className="text-2xl font-bold">{item.value}</div>
                            </div>

                            <div className="rounded-sm bg-gray-200 p-2">
                                <item.icon />
                            </div>
                        </Card>

                    ))}
                </div>
            </section>

            <section className='flex flex-col gap-4'>
                <div className='flex flex-row justify-between items-center'>
                    <div>
                        <h1 className='text-2xl font-semibold'>Recently Created Interviews</h1>
                        <p className='text-muted-foreground'>Manage and track your latest interview sessions
                        </p>
                    </div>
                    <Button>View All</Button>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    {recentInterviews.map((item) => (
                        <Card className='rounded-sm'>
                            <CardHeader>
                                <div className='flex justify-between'>
                                    <CardTitle className='font-semibold text-lg'>{item.title}</CardTitle>
                                    <Badge variant="outline" className='bg-green-100 text-green-700 px-2 py-1 text-sm rounded-full'>{item.status}</Badge>
                                </div >

                                <CardDescription className='flex gap-1 items-center'> <Users className='h-4' /> {item.candidates} candidates</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='flex flex-col gap-4'>
                                    <div className='flex gap-1 items-center'>
                                        <Code className='h-4 text-muted-foreground' />
                                        Tech Stack:
                                    </div>

                                    <div className='flex gap-2 items-center'>
                                        {item.techStack.map((tech) => (
                                            <Badge key={tech} className='bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded-full'>{tech}</Badge>
                                        ))}
                                    </div>

                                    <div className='flex justify-between'>
                                        <p className='text-sm text-muted-foreground'>
                                            Type: {item.type}
                                        </p>
                                        <Button>View Details</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                </div>
            </section>
        </div>
    )
}

export default Dashboard