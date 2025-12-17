"use client";

import React, { useState, useEffect } from "react";
import { SocialMediaList } from "@/components/dashboard/SocialMediaList";
import { candidateService } from "@/services/candidate.service";
import { useToast } from "@/context/ToastContext";
import { CandidateProfile } from "@/types/candidate";

export default function SocialLinksSettingsPage() {
  const { success, error } = useToast();
  const [socialLinks, setSocialLinks] = useState<{ id: number; platform: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await candidateService.getProfile();
        if (res.success && res.data) {
          setSocialLinks(res.data.socialLinks || []);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-6">Đang tải thông tin...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90 mb-6">
        Liên kết mạng xã hội
      </h3>

      <SocialMediaList
        initialLinks={socialLinks}
        onSave={async (links) => {
          try {
            const response = await candidateService.updateSocialLinks(links);
            if (response.success) {
              success("Cập nhật mạng xã hội thành công!");
              setSocialLinks(links.map((l, i) => ({ id: i, ...l })));
            }
          } catch (err) {
            error("Cập nhật thất bại");
          }
        }}
      />
    </div>
  );
}
