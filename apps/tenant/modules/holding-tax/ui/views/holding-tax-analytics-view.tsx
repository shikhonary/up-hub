"use client";

import React, { useState, useMemo } from "react";
import {
  useHoldingTaxAnalytics,
  useHoldingTaxReport,
  useFiscalYearsForSelection
} from "@workspace/api-client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  FileDown,
  Filter,
  Download,
  Calendar,
  MapPin,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  Receipt
} from "lucide-react";
import { enToBnNumber } from "@workspace/utils";
import { cn } from "@workspace/ui/lib/utils";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];
const STATUS_COLORS: Record<string, string> = {
  PAID: "#10b981",
  PARTIAL: "#f59e0b",
  UNPAID: "#ef4444",
};

export const HoldingTaxAnalyticsView = () => {
  const [fiscalYearId, setFiscalYearId] = useState<string>("all");
  const [wardNo, setWardNo] = useState<string>("all");

  const filters = useMemo(() => ({
    fiscalYearId: fiscalYearId === "all" ? null : fiscalYearId,
    wardNo: wardNo === "all" ? null : Number(wardNo),
  }), [fiscalYearId, wardNo]);

  const { data: analytics, isLoading } = useHoldingTaxAnalytics(filters);
  const { data: fiscalYears } = useFiscalYearsForSelection();
  const { data: reportData } = useHoldingTaxReport(filters);

  const stats = analytics?.overview;
  const collectionRate = stats ? ((stats.paidAmount || 0) / (stats.totalAmount || 1)) * 100 : 0;

  const handleExportPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    const title = "হোল্ডিং ট্যাক্স রিপোর্ট";
    const date = new Date().toLocaleDateString("bn-BD");

    doc.setFont("SiyamRupali", "normal"); // Assuming font is available or added
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(`তারিখ: ${date}`, 14, 22);

    const tableData = reportData?.allRecords?.map((item: any, index: number) => [
      index + 1,
      item.assessment?.fullNameBn,
      item.assessment?.holdingNo,
      item.assessment?.wardNo,
      item.fiscalYear?.nameBn,
      item.totalAmount,
      item.paidAmount,
      item.status === "PAID" ? "পরিশোধিত" : item.status === "PARTIAL" ? "আংশিক" : "অপরিশোধিত",
    ]) || [];

    autoTable(doc, {
      head: [["#", "নাম", "হোল্ডিং", "ওয়ার্ড", "অর্থবছর", "ধার্যকৃত", "পরিশোধিত", "অবস্থা"]],
      body: tableData,
      startY: 30,
      styles: { font: "SiyamRupali" },
    });

    doc.save(`holding-tax-report-${Date.now()}.pdf`);
  };

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-surface relative isolate pb-20">
      {/* Background blobs */}
      <div className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 pointer-events-none" />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        {/* Header & Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
          <div className="relative max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline">
              রিপোর্ট ও অ্যানালিটিক্স
            </h1>
            <div className="mt-2 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />
            <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70">
              হোল্ডিং ট্যাক্স সংগ্রহ ও ইউনিয়ন পরিষদের আর্থিক অবস্থার বিস্তারিত পরিসংখ্যান।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-surface-container-lowest p-2 rounded-2xl border border-outline/10 shadow-ambient animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <div className="flex items-center gap-2 px-3">
              <Filter size={16} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">ফিল্টার</span>
            </div>

            <Select value={fiscalYearId} onValueChange={setFiscalYearId}>
              <SelectTrigger className="w-[160px] h-10 rounded-xl bg-surface-container border-none shadow-none font-bold text-xs">
                <SelectValue placeholder="অর্থবছর" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                <SelectItem value="all">সকল অর্থবছর</SelectItem>
                {fiscalYears?.map((fy: any) => (
                  <SelectItem key={fy.id} value={fy.id}>{fy.nameBn}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={wardNo} onValueChange={setWardNo}>
              <SelectTrigger className="w-[130px] h-10 rounded-xl bg-surface-container border-none shadow-none font-bold text-xs">
                <SelectValue placeholder="ওয়ার্ড" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-outline/10 shadow-ambient">
                <SelectItem value="all">সকল ওয়ার্ড</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((w) => (
                  <SelectItem key={w} value={w.toString()}>{enToBnNumber(w)} নং ওয়ার্ড</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleExportPDF}
              className="h-10 px-6 rounded-xl bg-primary text-white font-black hover:bg-primary/90 shadow-glow transition-all active:scale-95 ml-2 border-0"
            >
              <FileDown size={16} className="mr-2" /> এক্সপোর্ট PDF
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700 delay-300">
          <StatCard
            label="ধার্যকৃত মোট ট্যাক্স"
            value={`৳${enToBnNumber(stats?.totalAmount ?? 0)}`}
            icon={<Receipt className="w-6 h-6" />}
            iconBgClass="bg-blue-500/10"
            iconTextClass="text-blue-600"
          />
          <StatCard
            label="মোট আদায়কৃত"
            value={`৳${enToBnNumber(stats?.paidAmount ?? 0)}`}
            icon={<CheckCircle2 className="w-6 h-6" />}
            iconBgClass="bg-emerald-500/10"
            iconTextClass="text-emerald-600"
          />
          <StatCard
            label="বকেয়া ট্যাক্স"
            value={`৳${enToBnNumber(stats?.dueAmount ?? 0)}`}
            icon={<AlertCircle className="w-6 h-6" />}
            iconBgClass="bg-rose-500/10"
            iconTextClass="text-rose-600"
          />
          <StatCard
            label="আদায়ের হার"
            value={`${enToBnNumber(collectionRate.toFixed(1))}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            iconBgClass="bg-amber-500/10"
            iconTextClass="text-amber-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ward-wise Bar Chart */}
          <Card className="lg:col-span-2 rounded-[32px] border-outline/5 shadow-ambient overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-black tracking-tight">ওয়ার্ড ভিত্তিক ট্যাক্স আদায়</CardTitle>
                  <CardDescription className="font-medium italic">প্রতি ওয়ার্ডে আদায়কৃত বনাম ধার্যকৃত ট্যাক্স</CardDescription>
                </div>
                <div className="flex gap-4">
                  <LegendItem color="#10b981" label="আদায়কৃত" />
                  <LegendItem color="#e2e8f0" label="ধার্যকৃত" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.wardWiseData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="ward"
                    tickFormatter={(val) => `${enToBnNumber(val)}`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 700, fill: "#64748b" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 700, fill: "#64748b" }}
                    tickFormatter={(val) => enToBnNumber(val)}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 rounded-2xl shadow-xl border border-outline/5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">ওয়ার্ড {enToBnNumber(payload?.[0]?.payload?.ward)}</p>
                            <div className="space-y-1">
                              <p className="text-sm font-black text-emerald-600">আদায়: ৳{enToBnNumber(payload?.[0]?.value as any)}</p>
                              <p className="text-sm font-bold text-slate-400">মোট: ৳{enToBnNumber(payload?.[1]?.value as any)}</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="paid" fill="#10b981" radius={[6, 6, 0, 0]} barSize={32} />
                  <Bar dataKey="total" fill="#f1f5f9" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Pie Chart */}
          <Card className="rounded-[32px] border-outline/5 shadow-ambient overflow-hidden">
            <CardHeader className="p-8 pb-4 text-center">
              <CardTitle className="text-xl font-black tracking-tight">পেমেন্ট স্ট্যাটাস</CardTitle>
              <CardDescription className="font-medium italic">করদাতার পেমেন্ট অবস্থা</CardDescription>
            </CardHeader>
            <CardContent className="p-8 h-[400px] flex flex-col items-center">
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="count"
                    >
                      {analytics?.statusDistribution?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || "#cbd5e1"} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-4 rounded-2xl shadow-xl border border-outline/5">
                              <p className="text-sm font-black tracking-tight">{payload?.[0]?.name === "PAID" ? "পরিশোধিত" : payload?.[0]?.name === "PARTIAL" ? "আংশিক" : "অপরিশোধিত"}</p>
                              <p className="text-xl font-black text-primary">{enToBnNumber(payload?.[0]?.value as any)} জন</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 w-full space-y-3">
                {analytics?.statusDistribution?.map((s) => (
                  <div key={s.status} className="flex justify-between items-center bg-surface-container/20 p-3 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.status] }} />
                      <span className="text-sm font-bold text-on-surface-variant">
                        {s.status === "PAID" ? "পরিশোধিত" : s.status === "PARTIAL" ? "আংশিক" : "অপরিশোধিত"}
                      </span>
                    </div>
                    <span className="text-sm font-black">{enToBnNumber(s.count)} জন</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fiscal Year Trend */}
        <Card className="rounded-[32px] border-outline/5 shadow-ambient overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-black tracking-tight">আর্থিক বছরের প্রবণতা</CardTitle>
            <CardDescription className="font-medium italic">বিগত বছরগুলোর তুলনায় ট্যাক্স আদায়ের চিত্র</CardDescription>
          </CardHeader>
          <CardContent className="p-8 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.fiscalYearTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="fiscalYearName"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 700, fill: "#64748b" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 700, fill: "#64748b" }}
                  tickFormatter={(val) => enToBnNumber(val)}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-4 rounded-2xl shadow-xl border border-outline/5">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{payload?.[0]?.payload?.fiscalYearName}</p>
                          <p className="text-lg font-black text-primary">৳{enToBnNumber(payload?.[0]?.value as any)}</p>
                          <p className="text-xs font-bold text-slate-400">{enToBnNumber(payload?.[0]?.payload?.count)} টি রেকর্ড</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="paidAmount"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{ r: 6, fill: "#10b981", strokeWidth: 3, stroke: "#fff" }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalAmount"
                  stroke="#cbd5e1"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  iconBgClass,
  iconTextClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconBgClass: string;
  iconTextClass: string;
}) => {
  return (
    <div className="bg-surface-container-lowest border border-outline/10 p-6 rounded-2xl shadow-ambient flex items-center gap-5 transition-all hover:shadow-ambient-double">
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
          iconBgClass,
          iconTextClass
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70">
          {label}
        </p>
        <p className="text-2xl font-black text-on-surface tracking-tight leading-none mt-1">{value}</p>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-xs font-bold text-on-surface-variant opacity-60">{label}</span>
  </div>
);

const AnalyticsSkeleton = () => (
  <div className="min-h-screen bg-surface relative isolate pb-20 animate-pulse">
    <div className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none" />
    
    <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded-xl bg-surface-container" />
          <Skeleton className="h-4 w-48 rounded-lg bg-surface-container opacity-60" />
        </div>
        <Skeleton className="h-14 w-full lg:w-[500px] rounded-2xl bg-surface-container-lowest border border-outline/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl bg-surface-container-lowest border border-outline/10" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="lg:col-span-2 h-[500px] rounded-[32px] bg-surface-container-lowest border border-outline/10" />
        <Skeleton className="h-[500px] rounded-[32px] bg-surface-container-lowest border border-outline/10" />
      </div>
    </main>
  </div>
);
