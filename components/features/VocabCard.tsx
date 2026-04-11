import type { VocabularyItem } from "@/types/vocabulary";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const difficultyColor = {
  EASY: "green",
  MEDIUM: "yellow",
  HARD: "red",
} as const;

interface VocabCardProps {
  item: VocabularyItem;
  showTranslation?: boolean;
  onToggle?: () => void;
}

export function VocabCard({ item, showTranslation = true, onToggle }: VocabCardProps) {
  return (
    <Card hoverable={!!onToggle} onClick={onToggle} className="min-h-[120px]">
      <CardBody className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-lg font-semibold text-gray-900">{item.word}</p>
            {item.phonetic && (
              <p className="text-sm text-gray-400 italic">{item.phonetic}</p>
            )}
          </div>
          <Badge color={difficultyColor[item.difficulty]}>{item.difficulty}</Badge>
        </div>

        {showTranslation && (
          <p className="text-base text-indigo-700 font-medium">{item.translation}</p>
        )}

        {item.exampleSentence && (
          <p className="text-sm text-gray-500 italic border-l-2 border-indigo-200 pl-3 mt-1">
            {item.exampleSentence}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
