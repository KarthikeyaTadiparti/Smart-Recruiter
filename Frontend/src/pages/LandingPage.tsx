
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Mic, ShieldCheck, FileText, ChevronRight, UserCheck, Clock, BarChart, Bot, LayoutDashboard, BrainCircuit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            {/* Navbar */}
            <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-xs">
                <div className="container mx-auto px-6 w-[85%] h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Logo className="w-8 h-8 text-primary" />
                        <span className="text-2xl font-bold tracking-tight">Smart Recruiter</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate("/login")}>
                            Login
                        </Button>
                        <Button onClick={() => navigate("/signup")}>
                            Get Started
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 pt-16">
                {/* Hero Section */}
                <section className="relative py-20 lg:py-32 overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
                    <div className="container mx-auto px-6 text-center">
                        <Badge variant="outline" className="mb-6 py-1.5 px-4 text-sm bg-primary/5 border-primary/20 text-primary">
                            Reimagining Technical Interviews
                        </Badge>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Hire the Best Talent <br className="hidden md:block" />
                            <span className="text-primary relative">
                                on Autopilot
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Conduct consistent, unbiased AI voice interviews at scale. Save hundreds of hours and identify top talent faster with Smart Recruiter.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" onClick={() => navigate("/signup")}>
                                Start Hiring Now <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full border-primary/20 hover:bg-primary/5" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                                Learn More
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Statistics / Trust Section */}
                {/* <section className="py-12 border-y border-border/50 bg-secondary/30">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-muted-foreground">
                            <div className="space-y-2">
                                <h3 className="text-4xl font-bold text-foreground">50+</h3>
                                <p className="text-sm font-medium">Tech Stacks Supported</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-4xl font-bold text-foreground">90%</h3>
                                <p className="text-sm font-medium">Time Saved</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-4xl font-bold text-foreground">24/7</h3>
                                <p className="text-sm font-medium">Availability</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-4xl font-bold text-foreground">100%</h3>
                                <p className="text-sm font-medium">Anti-Cheat Protected</p>
                            </div>
                        </div>
                    </div>
                </section> */}

                {/* Problem vs Solution */}
                <section className="py-24 border-y border-border/50 bg-muted/50 w-full mx-auto">
                    <div className="container mx-auto px-6 w-[85%]">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Smart Recruiter?</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Traditional interviewing is broken. We fixed it.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                                        <Clock className="w-6 h-6 text-destructive" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">The Old Way</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Scheduling nightmares, hours spent on screening calls, inconsistent evaluation criteria, and unconscious bias affecting hiring decisions.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                                        <UserCheck className="w-6 h-6 text-destructive" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Subjective Feedback</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Manual notes are often incomplete or biased. Comparing candidates across different interviewers is nearly impossible.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-20" />
                                <Card className="relative border-primary/20 shadow-2xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-primary">
                                            <BrainCircuit className="w-6 h-6" />
                                            The Smart Way
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                                <Bot className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">AI Agent conducts interviews</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                                <BarChart className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">Instant, data-driven scoring</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                                <Globe className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium">Scale to thousands of candidates</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-background w-full mx-auto">
                    <div className="container mx-auto px-6 w-[85%]">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to hire Scale</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Powerful features designed to streamline your entire technical screening process.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                                        <Mic className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <CardTitle>AI Voice Agent</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        Powered by Vapi, our voice agent conducts natural, conversational interviews that feel human.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                                        <BrainCircuit className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <CardTitle>Dynamic Questions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        Gemini AI generates context-aware questions based on role, experience, and real-time responses.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                                        <ShieldCheck className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <CardTitle>Proctoring</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        Advanced anti-cheat detection including tab-switch monitoring and full-screen enforcement.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                                        <FileText className="w-6 h-6 text-green-500" />
                                    </div>
                                    <CardTitle>Detailed Reports</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        Comprehensive feedback on technical skills, communication, and confidence with actionable insights.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 w-full mx-auto bg-muted/30 border-t border-border/50">
                    <div className="container mx-auto px-6 w-[85%]">
                        <div className="rounded-3xl bg-primary text-primary-foreground p-8 md:p-16 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent" />

                            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to transform your hiring process?</h2>
                            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10 relative z-10">
                                Join forward-thinking companies using Smart Recruiter to hire better talent, faster.
                            </p>
                            <Button size="lg" variant="secondary" className="h-12 px-8 text-lg font-semibold rounded-full shadow-lg relative z-10" onClick={() => navigate("/signup")}>
                                Get Started Today
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-background border-t border-border/50 py-12 w-full mx-auto">
                <div className="container mx-auto px-6 w-[85%]">
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Logo className="w-6 h-6 text-primary" />
                                <span className="text-xl font-bold">Smart Recruiter</span>
                            </div>
                            <p className="text-muted-foreground max-w-sm">
                                AI-powered voice interview platform that automates screening and evaluation for the modern workforce.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} Smart Recruiter. All rights reserved.</p>
                        <div className="flex gap-4">
                            <LayoutDashboard className="w-5 h-5 hover:text-primary cursor-pointer" />
                            <Globe className="w-5 h-5 hover:text-primary cursor-pointer" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
