import { z } from "zod";

import { env } from "@/env.mjs";

import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  create: adminProcedure.input(z.object({ name: z.string(), description: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.category.create({
      data: {
        name: input.name,
        description: input.description,
      },
    });
  }),

  update: adminProcedure.input(z.object({ id: z.string(), name: z.string(), description: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.category.update({
      where: { id: input.id },
      data: {
        name: input.name,
        description: input.description,
      },
    });
  }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.category.delete({ where: { id: input.id } });
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany({
      select: { id: true, name: true, products: { orderBy: { items: { _count: "desc" } } } },
    });

    return [
      ...categories.map((category) => ({
        id: category.id,
        data: {
          name: category.name,
          image: `${env.NEXT_PUBLIC_SUPABASE_URL}/${env.NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET}/${category.products[0]?.id ?? ""}/0.jpg`,
        },
      })),
    ];
  }),
});
