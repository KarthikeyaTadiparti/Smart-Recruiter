import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/hooks/use-redux";
import { FormEvent } from "react";
import { toast } from "sonner";
import { _userLogin } from "@/redux/actions/auth-actions"

type Role = "candidate" | "recruiter";

interface Login {
    email: string;
    password: string;
    role: Role;
}

function Login() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [login, setLogin] = useState<Login>({
        email: '',
        password: '',
        role: "candidate"
    });

    // useEffect(() => {
    //     console.log(login);
    // }, [login]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const { payload } = await dispatch(_userLogin({ data: login, navigate }));

        if (payload && payload.data && payload.data.status) {
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
                        setLogin((prev) => ({ ...prev, role: value as Role }))
                    }
                >
                    <TabsList className='w-full h-[50px]'>
                        <TabsTrigger value="candidate">Candidate</TabsTrigger>
                        <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
                    </TabsList>

                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl font-semibold text-center">
                                    <TabsContent value="candidate">Candidate Login</TabsContent>
                                    <TabsContent value="recruiter">Recruiter Login</TabsContent>
                                </CardTitle>
                                <CardDescription className="text-center">
                                    Enter your email below to login to your account
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={login.email}
                                                onChange={(e) => setLogin((prev) => ({ ...prev, email: e.target.value }))}
                                                placeholder="abc@gmail.com"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password</Label>
                                                <a
                                                    href="#"
                                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                                >
                                                    Forgot your password?
                                                </a>
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={login.password}
                                                onChange={(e) => (setLogin((prev) => ({ ...prev, password: e.target.value })))}
                                                required />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <Button type="submit" className="w-full">
                                                Login
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center text-sm">
                                        Don&apos;t have an account?{" "}
                                        <a href="#" className="underline underline-offset-4">
                                            Sign up
                                        </a>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}

export default Login
