"use client";

import { getActivityHeatmap } from "@/app/apiClient/learning/score/score";
import useAuth from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import ActivityCalendar from "react-activity-calendar";

export default function ActivityHeatmap() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user, year]); // <== Lắng nghe năm thay đổi

  const fetchData = async () => {
    setLoading(true);
    const res = await getActivityHeatmap(user?.id);
    // giả sử API trả về tất cả các năm, bạn có thể lọc theo year hiện tại
    const filtered = res.filter(
      (item: any) => new Date(item.date).getFullYear() === year
    );

    const processedData = filtered.map((item: any) => ({
      date: item.date,
      count: item.count,
      level: Math.min(Math.ceil(item.count / 3), 4),
    }));

    setData(processedData);
    setLoading(false);
  };

  const years = [2023, 2024, 2025]; // hoặc sinh động dựa vào dữ liệu API

  return (
    <div className="flex flex-col gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Lịch sử học tập</h1>

        <select
          className="border border-gray-300 rounded-md px-3 py-1 dark:bg-gray-700"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              Năm {y}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : data.length > 0 ? (
        <ActivityCalendar
          data={data}
          labels={{
            legend: { less: "Ít", more: "Nhiều" },
            months: [
              "Thg 1",
              "Thg 2",
              "Thg 3",
              "Thg 4",
              "Thg 5",
              "Thg 6",
              "Thg 7",
              "Thg 8",
              "Thg 9",
              "Thg 10",
              "Thg 11",
              "Thg 12",
            ],
            weekdays: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
            totalCount: "{{count}} hoạt động trong {{year}}",
          }}
          theme={{
            light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
            dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
          }}
          hideTotalCount={false}
          showWeekdayLabels
        />
      ) : (
        <p>Không có dữ liệu cho năm {year}.</p>
      )}
    </div>
  );
}
