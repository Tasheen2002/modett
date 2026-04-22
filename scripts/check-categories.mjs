import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const cats = await prisma.category.findMany({
  select: { id: true, name: true, position: true },
  orderBy: { position: "asc" },
});

console.log("\nposition | type       | name");
console.log("---------|------------|------------------");
cats.forEach((c) => {
  const type = (c.position || 0) < 100 ? "CATEGORY  " : "COLLECTION";
  console.log(`   ${String(c.position ?? "null").padEnd(5)}  | ${type} | ${c.name}`);
});

await prisma.$disconnect();
