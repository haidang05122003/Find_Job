
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal/Modal';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { CandidateExperience } from '@/types/candidate';

interface ExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (exp: CandidateExperience) => void;
    initialData?: CandidateExperience | null;
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<CandidateExperience>({
        companyName: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                companyName: '',
                position: '',
                startDate: '',
                endDate: '',
                description: ''
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Cập nhật kinh nghiệm" : "Thêm kinh nghiệm"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label>Công ty <span className="text-red-500">*</span></Label>
                    <Input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="VD: Google Inc" required />
                </div>
                <div>
                    <Label>Vị trí</Label>
                    <Input name="position" value={formData.position} onChange={handleChange} placeholder="VD: Senior Developer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Từ ngày</Label>
                        <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Đến ngày</Label>
                        <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <Label>Mô tả công việc</Label>
                    <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        rows={3}
                    />
                </div>
                <div className="flex justify-end pt-4">
                    <Button type="button" variant="outline" onClick={onClose} className="mr-2">Hủy</Button>
                    <Button type="submit">Lưu</Button>
                </div>
            </form>
        </Modal>
    );
};
