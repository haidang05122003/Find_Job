import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import {
    TrashIcon,
    PlusIcon,
    FacebookIcon,
    GithubIcon,
    LinkedinIcon,
    TwitterIcon,
    InstagramIcon,
    YoutubeIcon,
    GlobeIcon,
    LinkIcon
} from "@/components/shared/icons";

interface SocialLink {
    platform: string;
    url: string;
}

interface SocialLinksManagerProps {
    initialLinks: { platform: string; url: string }[];
    onSave: (links: SocialLink[]) => Promise<void>;
}

const PLATFORMS = [
    { value: "GITHUB", label: "Github", icon: GithubIcon, color: "text-gray-900 dark:text-gray-100" },
    { value: "FACEBOOK", label: "Facebook", icon: FacebookIcon, color: "text-blue-600" },
    { value: "LINKEDIN", label: "LinkedIn", icon: LinkedinIcon, color: "text-blue-700" },
    { value: "TWITTER", label: "Twitter", icon: TwitterIcon, color: "text-sky-500" },
    { value: "INSTAGRAM", label: "Instagram", icon: InstagramIcon, color: "text-pink-600" },
    { value: "YOUTUBE", label: "Youtube", icon: YoutubeIcon, color: "text-red-600" },
    { value: "WEBSITE", label: "Website", icon: GlobeIcon, color: "text-emerald-500" },
    { value: "OTHER", label: "Khác", icon: LinkIcon, color: "text-gray-500" }
];

export const SocialMediaList: React.FC<SocialLinksManagerProps> = ({ initialLinks, onSave }) => {
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialLinks) {
            setLinks(initialLinks.map(l => ({ platform: l.platform, url: l.url })));
        }
    }, [initialLinks]);

    const handleAddLink = () => {
        setLinks([...links, { platform: "GITHUB", url: "" }]);
    };

    const handleRemoveLink = (index: number) => {
        const newLinks = [...links];
        newLinks.splice(index, 1);
        setLinks(newLinks);
    };

    const handleChange = (index: number, field: keyof SocialLink, value: string) => {
        const newLinks = [...links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setLinks(newLinks);
    };

    const handleSave = async () => {
        setIsLoading(true);
        await onSave(links);
        setIsLoading(false);
    };

    const getPlatformIcon = (platformValue: string) => {
        const platform = PLATFORMS.find(p => p.value === platformValue);
        const Icon = platform?.icon || LinkIcon;
        return <Icon className={`w-5 h-5 ${platform?.color || "text-gray-500"}`} />;
    };

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {links.map((link, index) => (
                    <div key={index} className="group relative flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 transition hover:border-brand-500 dark:hover:border-brand-500">
                        <div className="w-1/3 min-w-[140px]">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    {getPlatformIcon(link.platform)}
                                </div>
                                <select
                                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white appearance-none cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    value={link.platform}
                                    onChange={(e) => handleChange(index, 'platform', e.target.value)}
                                >
                                    {PLATFORMS.map(p => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex-1">
                            <Input
                                placeholder="https://..."
                                value={link.url}
                                onChange={(e) => handleChange(index, 'url', e.target.value)}
                                className="!mt-0"
                            />
                        </div>
                        <button
                            onClick={() => handleRemoveLink(index)}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                            title="Xóa liên kết"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            {links.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Chưa có liên kết mạng xã hội nào được thêm.</p>
                </div>
            )}

            <div className="flex justify-between items-center pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddLink}
                    className="flex items-center gap-2 border-dashed hover:border-solid hover:bg-brand-50 dark:hover:bg-brand-900/10 hover:text-brand-600 dark:hover:text-brand-400"
                >
                    <PlusIcon className="w-4 h-4" />
                    Thêm mạng xã hội
                </Button>

                {links.length > 0 && (
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isLoading}
                        className="min-w-[120px]"
                    >
                        {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                )}
            </div>
        </div>
    );
};
