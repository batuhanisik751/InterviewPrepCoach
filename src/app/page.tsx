import Link from "next/link";
import {
  GraduationCap,
  Target,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Target,
    title: "Tailored Questions",
    description:
      "AI analyzes your resume and job description to generate personalized interview questions targeting your specific gaps.",
    color: "text-[#2563eb]",
    bg: "bg-[#2563eb]/10",
  },
  {
    icon: BarChart3,
    title: "Smart Scoring",
    description:
      "Get detailed feedback with scores for clarity, structure, and depth. Behavioral questions include STAR method analysis.",
    color: "text-[#10b981]",
    bg: "bg-[#10b981]/10",
  },
  {
    icon: MessageSquare,
    title: "Mock Interviews",
    description:
      "Practice with an AI interviewer in a realistic chat-based format. Get real-time feedback and follow-up questions.",
    color: "text-[#8b5cf6]",
    bg: "bg-[#8b5cf6]/10",
  },
];

const steps = [
  {
    step: "1",
    title: "Paste Your Resume",
    description:
      "Upload or paste your resume to help the AI understand your experience.",
    icon: Sparkles,
  },
  {
    step: "2",
    title: "Add Job Description",
    description:
      "Provide the job listing you're targeting for personalized preparation.",
    icon: Target,
  },
  {
    step: "3",
    title: "Practice & Improve",
    description:
      "Answer questions, get scored, and track your improvement over time.",
    icon: Zap,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-foreground tracking-tight text-[1.05rem] font-semibold">
            Interview Prep Coach
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          AI-Powered Interview Preparation
        </div>
        <h1 className="text-foreground mb-6 tracking-tight font-bold leading-[1.15] text-[clamp(2rem,5vw,3.25rem)]">
          Ace your next interview
          <br />
          <span className="text-primary">with confidence</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg leading-[1.7]">
          Generate tailored interview questions from your resume and job
          description. Practice with an AI interviewer, get detailed scoring, and
          identify your weak spots — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="gap-2 px-8 h-12">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="px-8 h-12">
              Log In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="relative overflow-hidden border hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6 pt-6">
                <div
                  className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="text-foreground mb-2 text-[1.05rem] font-semibold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-[1.7]">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-foreground mb-3 text-[1.75rem] font-bold">
            How it works
          </h2>
          <p className="text-muted-foreground">
            Three simple steps to interview success
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={s.step} className="text-center relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
              )}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-xs text-primary mb-2 font-semibold">
                STEP {s.step}
              </div>
              <h3 className="text-foreground mb-2 text-[1.05rem] font-semibold">
                {s.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-[1.6]">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <Card className="bg-card border-0 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <CheckCircle2 key={s} className="w-5 h-5 text-[#10b981]" />
              ))}
            </div>
            <p className="text-foreground mb-4 italic text-[1.05rem] leading-[1.7]">
              &ldquo;Interview Prep Coach helped me identify gaps in my resume I
              didn&apos;t even know existed. The AI-generated questions were
              spot-on for my target role, and the scoring feedback was incredibly
              actionable.&rdquo;
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              — Alex Chen, Software Engineer at Stripe
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">
              Interview Prep Coach
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built with AI to help you land your dream job.
          </p>
        </div>
      </footer>
    </div>
  );
}
