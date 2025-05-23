
import { useBlog, Category } from "@/contexts/BlogContext";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  selectedCategory: Category | null;
  onChange: (category: Category | null) => void;
}

const CategoryFilter = ({ selectedCategory, onChange }: CategoryFilterProps) => {
  const { categories } = useBlog();

  return (
    <div className="mb-8 flex flex-wrap items-center gap-2">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onChange(null)}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
