import React from 'react';
import { Layers, Bot, Globe, Database, Zap, Sparkles } from 'lucide-react';

export interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
}

interface CategoryFilterProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (slug: string) => {
    switch (slug) {
      case 'ai-ml':
        return Bot;
      case 'mern-stack':
        return Layers;
      case 'web-development':
        return Globe;
      case 'management-systems':
        return Database;
      case 'real-time':
        return Zap;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory('')}
        className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border flex items-center space-x-1.5 ${
          selectedCategory === ''
            ? 'bg-primary-600 text-white border-primary-500 shadow-glow-sm'
            : 'bg-surface/80 text-gray-300 border-border/80 hover:bg-surface-hover hover:text-white'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>All Categories</span>
      </button>

      {categories.map((cat) => {
        const IconComponent = getIcon(cat.slug);
        const isSelected = selectedCategory === cat.slug;
        return (
          <button
            key={cat._id}
            onClick={() => onSelectCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border flex items-center space-x-1.5 ${
              isSelected
                ? 'bg-primary-600 text-white border-primary-500 shadow-glow-sm'
                : 'bg-surface/80 text-gray-300 border-border/80 hover:bg-surface-hover hover:text-white'
            }`}
          >
            <IconComponent className="w-3.5 h-3.5" />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};
