import { prisma } from "@/lib/db/prisma";
import CategoryAdminTable from "@/components/admin/CategoryAdminTable";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-serif text-3xl font-bold mb-8">Categories</h1>
      <CategoryAdminTable initialCategories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
