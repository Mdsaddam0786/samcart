import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@samcart.dev" },
    update: {},
    create: { name: "Admin", email: "admin@samcart.dev", password, role: "ADMIN" },
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@samcart.dev" },
    update: {},
    create: { name: "Sam Seller", email: "seller@samcart.dev", password, role: "SELLER" },
  });

  await prisma.user.upsert({
    where: { email: "buyer@samcart.dev" },
    update: {},
    create: { name: "Bailey Buyer", email: "buyer@samcart.dev", password, role: "BUYER" },
  });

  const products = [
    {
      title: "Wireless Noise-Cancelling Headphones",
      description:
        "Over-ear headphones with active noise cancellation and 30-hour battery life.",
      price: 19999,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      category: "Electronics",
      stock: 25,
    },
    {
      title: "Minimalist Leather Backpack",
      description: "Handcrafted full-grain leather backpack with padded laptop compartment.",
      price: 8999,
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      category: "Bags",
      stock: 15,
    },
    {
      title: "Ceramic Pour-Over Coffee Set",
      description: "Hand-glazed ceramic dripper and carafe set for the perfect morning brew.",
      price: 4499,
      imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
      category: "Home",
      stock: 40,
    },
    {
      title: "Mechanical Keyboard, Hot-Swappable",
      description: "75% layout mechanical keyboard with hot-swappable switches and RGB.",
      price: 12999,
      imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      category: "Electronics",
      stock: 30,
    },
    {
      title: "Organic Cotton Throw Blanket",
      description: "Soft, breathable throw blanket woven from 100% organic cotton.",
      price: 5999,
      imageUrl: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800",
      category: "Home",
      stock: 20,
    },
    {
      title: "Stainless Steel Water Bottle",
      description: "Insulated 32oz bottle that keeps drinks cold for 24 hours.",
      price: 2999,
      imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
      category: "Outdoors",
      stock: 60,
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { title: product.title } });
    if (!existing) {
      await prisma.product.create({ data: { ...product, sellerId: seller.id } });
    }
  }

  console.log("Seed complete.");
  console.log("Admin login:  admin@samcart.dev / password123");
  console.log("Seller login: seller@samcart.dev / password123");
  console.log("Buyer login:  buyer@samcart.dev / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
