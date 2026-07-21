import { useEffect, useState, useCallback } from "react";
import { getSpots, createSpot, SpotPayload } from "@/services/apis/yourspot/spots";
import nestApi from "@/services/apis/nest/nest";
import { getSession } from "@/services/auth/session";

export function useSpots() {
  const [spots, setSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpots = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSpots();
      setSpots(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  async function addSpot(payload: SpotPayload) {
    try {
      const newSpot = await createSpot(payload);
      setSpots((prev) => [...prev, newSpot]);
      return newSpot;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function updateSpot(updated: any) {
    try {
      const token = (await getSession()) || "";
      const res = await nestApi.put(`/spots/${updated.id}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const spot = res.data;
      setSpots((prev) => prev.map((s) => (s.id === spot.id ? spot : s)));
      return spot;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function deleteSpot(id: number) {
    try {
      const token = (await getSession()) || "";
      await nestApi.delete(`/spots/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpots((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  return { spots, loading, error, addSpot, updateSpot, deleteSpot, fetchSpots };
}