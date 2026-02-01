"use client";

import { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  type ContentType,
  type AgeGroup,
  type Category,
  categories,
  ageGroups,
  contentTypes,
} from "@/lib/content-data";

interface FilterBarProps {
  showTypeFilter?: boolean;
  selectedType?: ContentType;
  selectedAgeGroup?: AgeGroup;
  selectedCategory?: Category;
  onTypeChange?: (type: ContentType | undefined) => void;
  onAgeGroupChange?: (ageGroup: AgeGroup | undefined) => void;
  onCategoryChange?: (category: Category | undefined) => void;
}

export function FilterBar({
  showTypeFilter = true,
  selectedType,
  selectedAgeGroup,
  selectedCategory,
  onTypeChange,
  onAgeGroupChange,
  onCategoryChange,
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = selectedType || selectedAgeGroup || selectedCategory;

  const clearAllFilters = () => {
    onTypeChange?.(undefined);
    onAgeGroupChange?.(undefined);
    onCategoryChange?.(undefined);
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">تصفية المحتوى</span>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4 ml-1" />
              مسح الكل
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`mt-4 space-y-4 overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-96" : "max-h-0 md:max-h-96"
        }`}
      >
        {/* Content Type Filter */}
        {showTypeFilter && (
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">نوع المحتوى</label>
            <div className="flex flex-wrap gap-2">
              {contentTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    onTypeChange?.(
                      selectedType === type.id ? undefined : type.id
                    )
                  }
                  className="btn-press touch-target"
                >
                  <span className="ml-1">{type.icon}</span>
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Age Group Filter */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">الفئة العمرية</label>
          <div className="flex flex-wrap gap-2">
            {ageGroups.map((age) => (
              <Button
                key={age.id}
                variant={selectedAgeGroup === age.id ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onAgeGroupChange?.(
                    selectedAgeGroup === age.id ? undefined : age.id
                  )
                }
                className="btn-press touch-target"
              >
                {age.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">التصنيف</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  onCategoryChange?.(
                    selectedCategory === cat.id ? undefined : cat.id
                  )
                }
                className="btn-press touch-target"
              >
                <span className="ml-1">{cat.icon}</span>
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Summary (Mobile) */}
      {hasActiveFilters && !isExpanded && (
        <div className="flex flex-wrap gap-2 mt-3 md:hidden">
          {selectedType && (
            <Badge variant="secondary" className="animate-pop-in">
              {contentTypes.find((t) => t.id === selectedType)?.label}
              <button
                onClick={() => onTypeChange?.(undefined)}
                className="mr-1"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedAgeGroup && (
            <Badge variant="secondary" className="animate-pop-in">
              {ageGroups.find((a) => a.id === selectedAgeGroup)?.label}
              <button
                onClick={() => onAgeGroupChange?.(undefined)}
                className="mr-1"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="animate-pop-in">
              {categories.find((c) => c.id === selectedCategory)?.label}
              <button
                onClick={() => onCategoryChange?.(undefined)}
                className="mr-1"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
