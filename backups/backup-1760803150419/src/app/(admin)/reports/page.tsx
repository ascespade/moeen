"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadReports = async () => {
    try {
      const response = await fetch("/api/reports");
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <Button>Generate Report</Button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Total Patients</h3>
            <p className="text-3xl font-bold">--</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Total Appointments</h3>
            <p className="text-3xl font-bold">--</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Revenue</h3>
            <p className="text-3xl font-bold">--</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Recent Reports</h3>
          {reports.length === 0 ? (
            <p className="text-gray-500">No reports generated yet.</p>
          ) : (
            <div className="space-y-2">
              {reports.map((report) => (
                <div key={report.id} className="border-b py-2">
                  <p className="font-medium">{report.title}</p>
                  <p className="text-sm text-gray-600">{report.created_at}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
