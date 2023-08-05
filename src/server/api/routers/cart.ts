import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const cartRouter = createTRPCRouter({
  update: protectedProcedure.input(z.object({ id: z.string(), quantity: z.number() })).mutation(async ({ ctx, input }) => {
    input.quantity === 0
      ? await ctx.prisma.item.delete({ where: { id: input.id } })
      : await ctx.prisma.item.update({
          where: { id: input.id },
          data: {
            quantity: input.quantity,
          },
        });

    return input.quantity;
  }),

  create: protectedProcedure.input(z.object({ id: z.string(), quantity: z.number() })).mutation(async ({ ctx, input }) => {
    return input.quantity === 0
      ? await ctx.prisma.item.delete({ where: { id: input.id } })
      : await ctx.prisma.item.update({
          where: { id: input.id },
          data: {
            quantity: input.quantity,
          },
        });
  }),
});
