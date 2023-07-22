import { z } from "zod";

import { type Status } from "@/utils/validators";

import { adminProcedure, createTRPCRouter } from "../trpc";

export const orderRouter = createTRPCRouter({
  create: adminProcedure
    .input(z.object({ productIds: z.array(z.string()), delivery: z.boolean(), status: z.string(), total: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.order.create({
        data: {
          products: {
            connect: input.productIds.map((id) => ({ id })),
          },
          delivery: input.delivery,
          status: input.status,
          total: input.total,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  update: adminProcedure
    .input(z.object({ orderId: z.string(), delivery: z.boolean(), status: z.string(), products: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const status = input.status as Status;

      return await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          delivery: input.delivery,
          status: input.status,
          completedAt: status === "Completed" || status === "Cancelled" ? new Date() : undefined,
          products: { connect: input.products.map((id) => ({ id })) || [] },
        },
      });
    }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.order.delete({ where: { id: input.id } });
  }),
});
