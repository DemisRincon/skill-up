import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;
export type Rating = typeof RATING_OPTIONS[number];

interface SurveyQuestionProps {
    question: string;
    index: number;
    value?: number;
    onChange: (index: number, value: number) => void;
}

const RatingLabel = ({ value, selected }: { value: number; selected: boolean }) => (
    <div className={cn(
        "flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-200",
        selected
            ? "bg-primary text-primary-foreground scale-110 shadow-lg ring-2 ring-primary/20"
            : "bg-secondary hover:bg-secondary/80 cursor-pointer hover:scale-105"
    )}>
        <span className={cn(
            "text-lg font-semibold transition-all duration-200",
            selected && "scale-110"
        )}>{value}</span>
    </div>
);

export const SurveyQuestion = ({
    question,
    index,
    value,
    onChange
}: SurveyQuestionProps) => (
    <div className="space-y-4 p-4 rounded-lg border border-border/40 hover:border-primary/30 transition-colors duration-200 bg-card">
        <Label className="text-lg font-medium">{question}</Label>
        <RadioGroup
            className="flex flex-row justify-between gap-2 p-2"
            defaultValue={value?.toString()}
        >
            {RATING_OPTIONS.map((rating) => (
                <div key={rating} onClick={() => onChange(index, rating)}>
                    <RadioGroupItem
                        value={rating.toString()}
                        id={`question-${index}-${rating}`}
                        className="sr-only"
                        label={`Rating ${rating}`}
                    />
                    <RatingLabel value={rating} selected={value === rating} />
                </div>
            ))}
        </RadioGroup>
    </div>
); 