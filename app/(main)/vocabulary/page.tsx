"use client";

import { useEffect, useState } from "react";
import { getVocabularySets } from "@/lib/api/vocabulary";
import type { VocabularySet } from "@/types/vocabulary";
import { Card, CardBody } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default function VocabularyPage() {
  const [sets, setSets] = useState<VocabularySet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getVocabularySets()
      .then(setSets)
      .catch(() => setError("Could not load vocabulary sets. Is the backend running?"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vocabulary</h1>
        <p className="text-gray-500 mt-1">
          Practice words and phrases with curated vocabulary sets.
        </p>
      </div>

      {isLoading && <LoadingSpinner />}

      {!isLoading && error && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      {!isLoading && !error && sets.length === 0 && (
        <p className="text-sm text-gray-500">No vocabulary sets available yet.</p>
      )}

      {!isLoading && !error && sets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sets.map((set) => (
            <Link key={set.id} href={`/vocabulary/${set.id}`}>
              <Card hoverable>
                <CardBody className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">{set.name}</h3>
                    <Badge color="indigo">{set.language}</Badge>
                  </div>
                  {set.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">{set.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">🔤 {set.itemCount} words</p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
