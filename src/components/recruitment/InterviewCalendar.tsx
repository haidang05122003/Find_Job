"use client";

import React from "react";
import ComponentCard from "../common/ComponentCard";

import {
  applications,
  ApplicationStatusEnum,
  candidateProfiles,
  jobPosts,
} from "@/data/mockRecruitment";

const upcomingInterviews = applications
  .filter(
    (application) =>
      application.status === ApplicationStatusEnum.INTERVIEW &&
      application.interviewAt
  )
  .sort(
    (a, b) =>
      new Date(a.interviewAt ?? "").getTime() -
      new Date(b.interviewAt ?? "").getTime()
  )
  .map((application) => {
    const candidate = candidateProfiles.find(
      (profile) => profile.userId === application.candidateId
    );
    const job = jobPosts.find((post) => post.id === application.jobId);

    return {
      id: application.id,
      time: application.interviewAt
        ? new Date(application.interviewAt).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "--:--",
      date: application.interviewAt
        ? new Date(application.interviewAt).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
          })
        : "",
      candidate: candidate?.fullName ?? "Ứng viên",
      position: job?.title ?? "Tin tuyển dụng",
      type: "Online",
    };
  });

type InterviewCalendarProps = {
  onInterviewClick?: (
    interview: (typeof upcomingInterviews)[number],
    applicationId: number
  ) => void;
};

const InterviewCalendar: React.FC<InterviewCalendarProps> = ({ onInterviewClick }) => {
  return (
    <ComponentCard
      title="Lịch phỏng vấn sắp diễn ra"
      desc="Dữ liệu lấy từ các ứng viên đang ở trạng thái INTERVIEW."
    >
      <div className="space-y-4">
        {upcomingInterviews.map((slot) => (
          <button
            key={slot.id}
            onClick={() => onInterviewClick?.(slot, slot.id)}
            className="flex w-full items-center gap-4 rounded-2xl border border-gray-100 p-4 text-left transition hover:border-brand-200 hover:bg-brand-50/40 dark:border-gray-800 dark:hover:border-brand-500/20 dark:hover:bg-brand-500/10"
          >
            <div className="flex flex-col items-center justify-center rounded-xl bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-600 dark:bg-brand-400/15 dark:text-brand-300">
              <span>{slot.time}</span>
              <span className="text-xs font-normal text-brand-500/80 dark:text-brand-300/80">
                {slot.date}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                {slot.candidate}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {slot.position} · {slot.type}
              </p>
            </div>
            <div className="text-sm text-gray-400 dark:text-gray-500">
              Chuẩn bị câu hỏi phỏng vấn
            </div>
          </button>
        ))}
        {upcomingInterviews.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Hiện chưa có lịch phỏng vấn nào. Khi ứng viên chuyển sang trạng thái INTERVIEW, lịch sẽ hiển thị tại đây.
          </div>
        )}
      </div>
    </ComponentCard>
  );
};

export default InterviewCalendar;
