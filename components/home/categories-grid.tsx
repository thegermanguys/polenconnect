import { SectionHeader } from "@/components/shared/section-header";
import { CategoryCard } from "@/components/shared/category-card";
import { getCategories } from "@/lib/data/categories";

const CLUB_GROUPS = new Set(["sports", "community"]);

export async function CategoriesGrid() {
  const categories = await getCategories();
  return (
    <section className="container py-20">
      <SectionHeader
        eyebrow="Browse"
        title="Everything a Polish person in Germany needs"
        description="From weekend football to cultural festivals — find your people and your places, organised by category."
      />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {categories.map((category) => {
          const href = CLUB_GROUPS.has(category.group)
            ? `/cities/berlin/${category.slug}`
            : `/${category.slug}`;
          return <CategoryCard key={category.id} category={category} href={href} />;
        })}
      </div>
    </section>
  );
}
