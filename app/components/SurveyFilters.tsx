import React from 'react';
import { MagnifyingGlassIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/app/components/ui/Input';

interface SurveyFiltersProps {
    titleFilter: string;
    setTitleFilter: (value: string) => void;
    startDate: string;
    setStartDate: (value: string) => void;
    endDate: string;
    setEndDate: (value: string) => void;
}

export function SurveyFilters({
    titleFilter,
    setTitleFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate
}: SurveyFiltersProps) {
    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Filter Surveys</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                type="text"
                                value={titleFilter}
                                onChange={e => setTitleFilter(e.target.value)}
                                placeholder="Search surveys..."
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CalendarIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CalendarIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 