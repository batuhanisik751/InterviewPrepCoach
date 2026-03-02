"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  Search,
  FileText,
  ArrowRight,
  LayoutGrid,
  List,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/features/score-bar";

interface Session {
  id: string;
  job_title: string;
  company_name: string;
  status: string;
  overall_score: number | null;
  created_at: string;
}

interface HistoryClientProps {
  sessions: Session[];
}

export function HistoryClient({ sessions }: HistoryClientProps) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "grid">("table");
  const [sortField, setSortField] = useState<"date" | "score">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = sessions
    .filter(
      (s) =>
        (s.job_title || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.company_name || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === "date") {
        return sortDir === "desc"
          ? b.created_at.localeCompare(a.created_at)
          : a.created_at.localeCompare(b.created_at);
      }
      const aScore = a.overall_score ?? -1;
      const bScore = b.overall_score ?? -1;
      return sortDir === "desc" ? bScore - aScore : aScore - bScore;
    });

  const toggleSort = (field: "date" | "score") => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 7) return "text-[#10b981]";
    if (score >= 4) return "text-[#f59e0b]";
    return "text-[#ef4444]";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Session History
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sessions.length} sessions &middot;{" "}
            {sessions.filter((s) => s.status === "completed").length} completed
          </p>
        </div>
        <Link href="/session/new">
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" />
            New Session
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by job title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "table" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setView("table")}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-foreground font-semibold mb-2">
              No sessions found
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {search
                ? "Try a different search term."
                : "Start your first practice session to see it here."}
            </p>
            <Link href="/session/new">
              <Button className="gap-2">
                <PlusCircle className="w-4 h-4" />
                Create First Session
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : view === "table" ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead className="hidden sm:table-cell">Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <button
                    onClick={() => toggleSort("score")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Score <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <button
                    onClick={() => toggleSort("date")}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    Date <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <span className="text-foreground font-medium">
                      {session.job_title || "Untitled Session"}
                    </span>
                    {session.company_name && (
                      <span className="sm:hidden text-xs text-muted-foreground block">
                        {session.company_name}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {session.company_name || "-"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={
                        session.status as "draft" | "in_progress" | "completed"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {session.overall_score !== null ? (
                      <span
                        className={`font-semibold ${scoreColor(session.overall_score)}`}
                      >
                        {session.overall_score.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">&mdash;</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {new Date(session.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link href={`/session/${session.id}`}>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((session) => (
            <Link key={session.id} href={`/session/${session.id}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <StatusBadge
                      status={
                        session.status as "draft" | "in_progress" | "completed"
                      }
                    />
                    {session.overall_score !== null && (
                      <span
                        className={`text-lg font-bold ${scoreColor(session.overall_score)}`}
                      >
                        {session.overall_score.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-foreground font-semibold mb-1">
                    {session.job_title || "Untitled Session"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {session.company_name || "No company"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-auto pt-3">
                    {new Date(session.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
