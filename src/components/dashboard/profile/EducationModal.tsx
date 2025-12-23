
import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal/Modal';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { CandidateEducation } from '@/types/candidate';

interface EducationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (edu: CandidateEducation) => void;
    initialData?: CandidateEducation | null;
}

export const EducationModal: React.FC<EducationModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<CandidateEducation>({
        schoolName: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                schoolName: '',
                degree: '',
                major: '',
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
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Cập nhật học vấn" : "Thêm học vấn"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label>Trường học <span className="text-red-500">*</span></Label>
                    <Input name="schoolName" value={formData.schoolName} onChange={handleChange} placeholder="VD: Đại học Bách Khoa" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Bằng cấp</Label>
                        <Input name="degree" value={formData.degree} onChange={handleChange} placeholder="VD: Cử nhân" />
                    </div>
                    <div>
                        <Label>Chuyên ngành</Label>
                        <Input name="major" value={formData.major} onChange={handleChange} placeholder="VD: CNTT" />
                    </div>
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
                    <Label>Mô tả thêm</Label>
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
