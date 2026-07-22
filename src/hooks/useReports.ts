import { useEffect, useState, useCallback } from "react";
import { getReports, createReport, deleteReport, clearAllReports, ReportPayload } from "@/services/apis/yourspot/reports";

export function useReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getReports();
      setReports(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  async function addReport(payload: ReportPayload) {
    try {
      const newReport = await createReport(payload);
      setReports((prev) => [newReport, ...prev]);
      return newReport;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function removeReport(id: string | number) {
    try {
      await deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function clearHistory() {
    try {
      await clearAllReports();
      setReports([]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  return { reports, loading, error, addReport, removeReport, clearHistory, fetchReports };
}
