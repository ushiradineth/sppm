import { z } from "zod";

import { env } from "@/env.mjs";
import { deleteFiles } from "@/lib/supabase";

import { adminProcedure, createTRPCRouter } from "../trpc";

const productCreateValidation = z.object({
  name: z.string(),
  description: z.string(),
  available: z.boolean(),
  category: z.string(),
  price: z.number(),
});

const productUpdateValidation = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  available: z.boolean(),
  category: z.string(),
  price: z.number(),
});

export const productRouter = createTRPCRouter({
  create: adminProcedure.input(productCreateValidation).mutation(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        available: input.available,
        category: { connect: { id: input.category } },
      },
    });

    return product;
  }),

  update: adminProcedure.input(productUpdateValidation).mutation(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.update({
      where: { id: input.id },
      data: {
        name: input.name,
        description: input.description,
        available: input.available,
        category: { connect: { id: input.category } },
        price: input.price,
      },
    });

    return product;
  }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.delete({ where: { id: input.id } });

    await deleteFiles(env.NEXT_PUBLIC_PRODUCT_IMAGE_BUCKET, input.id);

    return product;
  }),
});
