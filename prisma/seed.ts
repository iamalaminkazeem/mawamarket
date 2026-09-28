import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import seedData from "./seed-data.json";

const prisma = new PrismaClient();

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  // --- Site settings ---
  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: {},
    create: { id: "main" },
  });

  // --- Admin user (CHANGE THIS PASSWORD after first login) ---
  const passwordHash = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!",
    10
  );
  await prisma.adminUser.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL || "admin@mawamarket.com" },
    update: {},
    create: {
      email: process.env.SEED_ADMIN_EMAIL || "admin@mawamarket.com",
      passwordHash,
      name: "MaWa Market Admin",
    },
  });

  // --- Categories ---
  const categoryIds: Record<string, string> = {};
  for (let i = 0; i < seedData.categories.length; i++) {
    const name = seedData.categories[i];
    const slug = slugify(name);
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug, sortOrder: i },
    });
    categoryIds[name] = category.id;
  }

  // --- Products ---
  // Safe to re-run: if products already exist, don't import them a second time.
  const existingProducts = await prisma.product.count();
  if (existingProducts > 0) {
    console.log(`Found ${existingProducts} existing products — skipping product import.`);
    return;
  }

  let sortOrder = 0;
  for (const p of seedData.products) {
    const categoryId = categoryIds[p.category];
    if (!categoryId) {
      console.warn(`Skipping "${p.name}" — unknown category "${p.category}"`);
      continue;
    }
    await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        priceVaries: p.priceVaries,
        available: p.available,
        categoryId,
        notes: p.notes || null,
        sortOrder: sortOrder++,
      },
    });
  }

  console.log(`Seeded ${seedData.categories.length} categories and ${seedData.products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
