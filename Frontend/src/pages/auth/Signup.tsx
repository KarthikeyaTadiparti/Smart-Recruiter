import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState, FormEvent } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/hooks/use-redux"
import { toast } from "sonner"
import { _userSignup } from "@/redux/actions/auth-actions"

type Role = "candidate" | "recruiter";

interface Signup {
    name: string;
    email: string;
    password: string;
    role: Role;
}

function Signup() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [signup, setSignup] = useState<Signup>({
        name: '',
        email: '',
        password: '',
        role: "candidate"
    });

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const { payload } = await dispatch(_userSignup({ data: signup, navigate }));

        if (payload?.data?.status) {
            toast.success(payload.data.message)

            if (payload.data.user.role === 'candidate')
                navigate('/candidate')
            else
                navigate('/recruiter');
        }
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Tabs
                    defaultValue="candidate"
                    className="pb-4"
                    onValueChange={(value) =>
                        setSignup((prev) => ({ ...prev, role: value as Role }))
                    }
                >
                    <TabsList className="w-full h-[50px]">
                        <TabsTrigger value="candidate">Candidate</TabsTrigger>
                        <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
                    </TabsList>

                    <TabsContent value="candidate">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold text-center">
                                    Candidate Signup
                                </CardTitle>
                                <CardDescription className="text-center">
                                    Enter your details to create a candidate account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="name">User Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={signup.name}
                                                onChange={(e) =>
                                                    setSignup((prev) => ({ ...prev, name: e.target.value }))
                                                }
                                                placeholder="Enter your name"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={signup.email}
                                                onChange={(e) =>
                                                    setSignup((prev) => ({ ...prev, email: e.target.value }))
                                                }
                                                placeholder="abc@gmail.com"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={signup.password}
                                                onChange={(e) =>
                                                    setSignup((prev) => ({ ...prev, password: e.target.value }))
                                                }
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full">
                                            Sign Up
                                        </Button>
                                    </div>
                                    <div className="mt-4 text-center text-sm">
                                        Already have an account?{" "}
                                        <a href="/login" className="underline underline-offset-4">
                                            Login
                                        </a>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="recruiter">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold text-center">
                                    Recruiter Signup
                                </CardTitle>
                                <CardDescription className="text-center">
                                    Enter your details to create a recruiter account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="name">User Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={signup.name}
                                                onChange={(e) =>
                                                    setSignup((prev) => ({ ...prev, name: e.target.value }))
                                                }
                                                placeholder="Enter your name"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={signup.email}
                                                onChange={(e) =>
                                                    setSignup((prev) => ({ ...prev, email: e.target.value }))
                                                }
                                                placeholder="abc@gmail.com"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={signup.password}
                                                onChange={(e) =>
                                                    setSignup((prev) => ({ ...prev, password: e.target.value }))
                                                }
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full">
                                            Sign Up
                                        </Button>
                                    </div>
                                    <div className="mt-4 text-center text-sm">
                                        Already have an account?{" "}
                                        <a href="/login" className="underline underline-offset-4">
                                            Login
                                        </a>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Signup
