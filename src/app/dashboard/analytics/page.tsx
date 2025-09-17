"use client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RoleGuard } from "@/components/auth/RoleGuard";
import AnalyticsApiInstance, { AnalyticsTotals } from "@/api/AnalyticsApi";

export default function BlogAnalyticsPage() {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["analytics", { from, to }],
    queryFn: async () =>
      await AnalyticsApiInstance.adminAnalyticsOverview({
        from: from ? new Date(from).toISOString() : undefined,
        to: to ? new Date(to).toISOString() : undefined,
      }),
  });

  const stats = data?.data;
  const totals = stats?.totals || {} as AnalyticsTotals;
  const series = stats?.series || [];

  return (
    <RoleGuard permissions={["analytics:view_basic", "analytics:view_advanced"]} showFallback={true}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Blog Analytics</h2>
          <div className="ml-auto flex items-center gap-2">
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <Button
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
            >
              Apply
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Views</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {totals.views || 0}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reads</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {totals.reads || 0}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Completion Rate</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {(stats?.completionRate || 0) + "%"}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Shares</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {totals.shares || 0}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Views vs Reads</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="views" dot={false} />
                <Line type="monotone" dataKey="reads" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
