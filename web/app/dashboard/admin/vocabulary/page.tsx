"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import {
  loadDifficultWords,
  loadVocabularyOverview,
  loadVocabularyTopics,
} from "@/app/apiClient/admin/analytic";
import { Pagination } from "./components/Pagination";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BookOpen,
  Layers,
  GraduationCap,
  Filter,
  AlertTriangle,
  Search,
  FileText,
} from "lucide-react";
import { useLanguage } from "@/components/contexts/LanguageContext";

type Overview = {
  total_vocab_entries: number;
  total_topics: number;
  avg_mastery_score: number;
};

type DifficultWord = {
  word: string;
  error_type: string;
  skill: string;
  total_errors: number;
  affected_users: number;
};

type Topic = {
  id: number;
  name_en: string;
  name_vi: string;
  total_vocab: number;
  user_name: string;
  created_at: string;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-xl text-sm z-50">
        <p className="font-bold text-slate-800 mb-1 flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-500" /> {label}
        </p>
        <p className="text-slate-600">
          Errors:{" "}
          <span className="font-bold text-red-600">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ErrorBar = ({ value, max }: { value: number; max: number }) => {
  const percentage = Math.min((value / max) * 100, 100);
  let colorClass = "bg-blue-500";
  if (percentage > 70) colorClass = "bg-red-500";
  else if (percentage > 40) colorClass = "bg-orange-400";

  return (
    <div className="w-full flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-600 w-8 text-right">
        {value}
      </span>
    </div>
  );
};

export default function Vocabulary() {
  const { t } = useLanguage();
  const [skill, setSkill] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const [wordsPage, setWordsPage] = useState(1);
  const [topicsPage, setTopicsPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [overview, setOverview] = useState<Overview | null>(null);
  const [difficultWords, setDifficultWords] = useState<DifficultWord[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [overviewLoading, setOverviewLoading] = useState(true);
  const [wordsLoading, setWordsLoading] = useState(true);
  const [topicsLoading, setTopicsLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      setOverviewLoading(true);
      try {
        const response = await loadVocabularyOverview();
        if (response.success) setOverview(response.data);
        else toast.error(response.message);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setOverviewLoading(false);
      }
    };
    fetchOverview();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      setTopicsLoading(true);
      try {
        const response = await loadVocabularyTopics();
        if (response.success) setTopics(response.data);
        else toast.error(response.message);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setTopicsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const fetchDifficultWords = useCallback(async () => {
    setWordsLoading(true);
    try {
      const response = await loadDifficultWords({
        skill: skill || undefined,
        errorType: errorType || undefined,
      });
      if (response.success) setDifficultWords(response.data);
      else toast.error(response.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setWordsLoading(false);
    }
  }, [skill, errorType]);

  useEffect(() => {
    fetchDifficultWords();
  }, [fetchDifficultWords]);

  const paginatedWords = difficultWords.slice(
    (wordsPage - 1) * ITEMS_PER_PAGE,
    wordsPage * ITEMS_PER_PAGE
  );
  const totalWordsPages = Math.ceil(difficultWords.length / ITEMS_PER_PAGE);

  const paginatedTopics = topics.slice(
    (topicsPage - 1) * ITEMS_PER_PAGE,
    topicsPage * ITEMS_PER_PAGE
  );
  const totalTopicsPages = Math.ceil(topics.length / ITEMS_PER_PAGE);

  const chartData = difficultWords
    .sort((a, b) => b.total_errors - a.total_errors)
    .slice(0, 10);

  const maxErrors = Math.max(...difficultWords.map((w) => w.total_errors), 10);

  return (
    <div className="flex-1 pr-6 py-4 pl-12 space-y-6">
      {/*  Header & Overview Cards */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {t("dashboard.vocabularyAnalytics")}
          </h1>
          <p className="text-slate-500 mt-1">
            {t("dashboard.vocabularyAnalyticsDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 Total Entries */}
          <Card className="border-0 shadow-md ring-1 ring-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BookOpen size={80} className="text-blue-600" />
            </div>
            <CardContent className="p-6">
              {overviewLoading ? (
                <Skeleton className="h-16 w-1/2" />
              ) : (
                <div className="relative z-10">
                  <div className="p-2 bg-blue-100 w-fit rounded-lg text-blue-600 mb-4">
                    <BookOpen size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    {t("dashboard.totalVocabularyEntries")}
                  </p>
                  <h3 className="text-3xl font-black text-slate-800 mt-1">
                    {overview?.total_vocab_entries.toLocaleString() ?? 0}
                  </h3>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2 Topics */}
          <Card className="border-0 shadow-md ring-1 ring-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Layers size={80} className="text-purple-600" />
            </div>
            <CardContent className="p-6">
              {overviewLoading ? (
                <Skeleton className="h-16 w-1/2" />
              ) : (
                <div className="relative z-10">
                  <div className="p-2 bg-purple-100 w-fit rounded-lg text-purple-600 mb-4">
                    <Layers size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    {t("dashboard.activeTopics")}
                  </p>
                  <h3 className="text-3xl font-black text-slate-800 mt-1">
                    {overview?.total_topics.toLocaleString() ?? 0}
                  </h3>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3 Mastery Score */}
          <Card className="border-0 shadow-md ring-1 ring-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <GraduationCap size={80} className="text-emerald-600" />
            </div>
            <CardContent className="p-6">
              {overviewLoading ? (
                <Skeleton className="h-16 w-1/2" />
              ) : (
                <div className="relative z-10">
                  <div className="p-2 bg-emerald-100 w-fit rounded-lg text-emerald-600 mb-4">
                    <GraduationCap size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    {t("dashboard.avgMasteryScore")}
                  </p>
                  <h3 className="text-3xl font-black text-slate-800 mt-1">
                    {overview?.avg_mastery_score.toFixed(1) ?? 0}
                    <span className="text-lg text-slate-400 font-medium">
                      /100
                    </span>
                  </h3>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Difficult Words Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/*  Chart & Filters */}
        <Card className="xl:col-span-3 border-0 shadow-md ring-1 ring-slate-100">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle size={20} className="text-orange-500" />{" "}
                  {t("dashboard.difficultWordsAnalysis")}
                </CardTitle>
                <CardDescription>
                  {t("dashboard.difficultWordsAnalysisDescription")}
                </CardDescription>
              </div>

              {/* Filters Group */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <Filter size={16} className="text-slate-400" />
                  <Select
                    value={skill ?? "all"}
                    onValueChange={(val) =>
                      setSkill(val === "all" ? null : val)
                    }
                  >
                    <SelectTrigger className="w-[140px] h-8 border-none bg-transparent shadow-none focus:ring-0">
                      <SelectValue placeholder="Skill" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Skills</SelectItem>
                      <SelectItem value="listening">Listening</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="speaking">Speaking</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <AlertTriangle size={16} className="text-slate-400" />
                  <Select
                    value={errorType ?? "all"}
                    onValueChange={(val) =>
                      setErrorType(val === "all" ? null : val)
                    }
                  >
                    <SelectTrigger className="w-[160px] h-8 border-none bg-transparent shadow-none focus:ring-0">
                      <SelectValue placeholder="Error Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Errors</SelectItem>
                      <SelectItem value="spelling">Spelling</SelectItem>
                      <SelectItem value="grammar">Grammar</SelectItem>
                      <SelectItem value="pronunciation">
                        Pronunciation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart Area */}
              <div className="lg:col-span-1 h-[350px] w-full">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">
                  {t("dashboard.top10MostFrequentErrors")}
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="word"
                      type="category"
                      width={100}
                      tick={{ fontSize: 13, fontWeight: 600, fill: "#475569" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      content={<CustomTooltip />}
                    />
                    <Bar
                      dataKey="total_errors"
                      radius={[0, 4, 4, 0]}
                      barSize={24}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index < 3 ? "#ef4444" : "#fca5a5"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Table Area */}
              <div className="lg:col-span-2 rounded-xl border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>{t("dashboard.word")}</TableHead>
                      <TableHead>{t("dashboard.errorType")}</TableHead>
                      <TableHead>{t("dashboard.skill")}</TableHead>
                      <TableHead className="w-[180px]">
                        {t("dashboard.totalErrors")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("dashboard.affected")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wordsLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={5}>
                            <Skeleton className="h-8 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : paginatedWords.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-gray-500"
                        >
                          {t("dashboard.noDataFound")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedWords.map((word, i) => (
                        <TableRow key={i} className="hover:bg-slate-50/50">
                          <TableCell className="font-bold text-slate-700">
                            {word.word}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`
                                                        ${
                                                          word.error_type ===
                                                          "spelling"
                                                            ? "border-blue-200 text-blue-700 bg-blue-50"
                                                            : ""
                                                        }
                                                        ${
                                                          word.error_type ===
                                                          "grammar"
                                                            ? "border-purple-200 text-purple-700 bg-purple-50"
                                                            : ""
                                                        }
                                                        ${
                                                          word.error_type ===
                                                          "pronunciation"
                                                            ? "border-orange-200 text-orange-700 bg-orange-50"
                                                            : ""
                                                        }
                                                        capitalize font-medium
                                                    `}
                            >
                              {word.error_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize text-slate-600">
                            {word.skill}
                          </TableCell>
                          <TableCell>
                            <ErrorBar
                              value={word.total_errors}
                              max={maxErrors}
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium text-slate-700">
                            {word.affected_users}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                  {totalWordsPages > 1 && (
                    <Pagination
                      t={t}
                      currentPage={wordsPage}
                      totalPages={totalWordsPages}
                      onPageChange={setWordsPage}
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. User Vocabulary Topics Card */}
      <Card className="border-0 shadow-md ring-1 ring-slate-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers size={20} className="text-purple-500" />{" "}
                {t("dashboard.userVocabularyTopics")}
              </CardTitle>
              <CardDescription>
                {t("dashboard.userVocabularyTopicsDescription")}
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search topics..."
                className="pl-9 w-[250px] bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {topicsLoading ? (
            <div className="p-6">
              <Skeleton className="h-64 w-full" />
            </div>
          ) : paginatedTopics.length === 0 ? (
            <p className="text-center py-12 text-gray-500">
              {t("dashboard.noDataFound")}
            </p>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="pl-6">
                      {t("dashboard.topicName")}
                    </TableHead>
                    <TableHead>{t("dashboard.vietnameseName")}</TableHead>
                    <TableHead>{t("dashboard.totalVocab")}</TableHead>
                    <TableHead className="text-right pr-6">
                      {t("dashboard.dateCreated")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTopics.map((topic) => (
                    <TableRow key={topic.id} className="hover:bg-slate-50/50">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                            <FileText size={16} />
                          </div>
                          <span className="font-semibold text-slate-700">
                            {topic.name_en}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {topic.name_vi}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                        >
                          {topic.total_vocab} {t("dashboard.words")}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right pr-6 text-slate-500">
                        {new Date(topic.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 border-t border-slate-100 flex justify-end">
                {totalTopicsPages > 1 && (
                  <Pagination
                    t={t}
                    currentPage={topicsPage}
                    totalPages={totalTopicsPages}
                    onPageChange={setTopicsPage}
                  />
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
