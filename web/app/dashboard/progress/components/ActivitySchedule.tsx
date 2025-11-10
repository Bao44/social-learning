"use client";

import { getActivityHeatmap } from "@/app/apiClient/learning/score/score";
import React, { useEffect, useState } from "react";
import ActivityCalendar from "react-activity-calendar";

interface ActivityHeatmapProps {
  user: any;
  t: (key: string) => string;
}

export default function ActivityHeatmap({ user, t }: ActivityHeatmapProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user, year]); // <== Lắng nghe năm thay đổi

  // const fetchData = async () => {
  //   setLoading(true);
  //   const res = await getActivityHeatmap(user?.id);
  //   // giả sử API trả về tất cả các năm, có thể lọc theo year hiện tại
  //   const filtered = res.filter(
  //     (item: any) => new Date(item.date).getFullYear() === year
  //   );

  //   const processedData = filtered.map((item: any) => ({
  //     date: item.date,
  //     count: item.count,
  //     level: Math.min(Math.ceil(item.count / 3), 4),
  //   }));

  //   setData(processedData);
  //   setLoading(false);
  // };

  const fetchData = async () => {
    setLoading(true);
    const res = await getActivityHeatmap(user?.id);

    // Lọc dữ liệu theo năm được chọn
    const filtered = res.filter(
      (item: any) => new Date(item.date).getFullYear() === year
    );

    // Tạo danh sách đầy đủ các ngày trong năm
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);
    const allDays: any[] = [];

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      const found = filtered.find((item: any) => item.date === dateStr);
      allDays.push({
        date: dateStr,
        count: found ? found.count : 0,
        level: found ? Math.min(Math.ceil(found.count / 3), 4) : 0,
      });
    }

    setData(allDays);
    setLoading(false);
  };

  const years = [2024, 2025]; // hoặc sinh động dựa vào dữ liệu API

  return (
    <div className="flex flex-col gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          {t("learning.activityHistory")}
        </h1>

        <select
          className="border border-gray-300 rounded-md px-3 py-1 dark:bg-gray-700"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {t("learning.year")} {y}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>{t("learning.loadingData")}</p>
      ) : data.length > 0 ? (
        <div className="m-auto">
          <ActivityCalendar
            data={data}
            blockSize={16} // ✅ tăng kích thước ô (mặc định là 10)
            blockMargin={4} // ✅ khoảng cách giữa các ô
            fontSize={14} // ✅ tăng font nếu có text hiển thị
            labels={{
              legend: { less: t("learning.less"), more: t("learning.more") },
              months: [
                `${t("learning.jan")}`,
                `${t("learning.feb")}`,
                `${t("learning.mar")}`,
                `${t("learning.apr")}`,
                `${t("learning.may")}`,
                `${t("learning.jun")}`,
                `${t("learning.jul")}`,
                `${t("learning.aug")}`,
                `${t("learning.sep")}`,
                `${t("learning.oct")}`,
                `${t("learning.nov")}`,
                `${t("learning.dec")}`,
              ],
              weekdays: [
                `${t("learning.sun")}`,
                `${t("learning.mon")}`,
                `${t("learning.tue")}`,
                `${t("learning.wed")}`,
                `${t("learning.thu")}`,
                `${t("learning.fri")}`,
                `${t("learning.sat")}`,
              ],
              totalCount: `{{count}} ${t("learning.activity")} {{year}}`,
            }}
            theme={{
              light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
            hideTotalCount={false}
            showWeekdayLabels
          />
        </div>
      ) : (
        <p>
          {t("learning.noDataInYear")} {year}.
        </p>
      )}
    </div>
  );
}
