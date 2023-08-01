import { z } from "zod";

import { type Status } from "@/utils/validators";

import { adminProcedure, createTRPCRouter } from "../trpc";

export const orderRouter = createTRPCRouter({
  create: adminProcedure
    .input(z.object({ items: z.array(z.string()), delivery: z.boolean(), status: z.string(), total: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.order.create({
        data: {
          items: {
            connect: input.items.map((id) => ({ id })),
          },
          delivery: input.delivery,
          status: input.status,
          total: input.total,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        orderId: z.string(),
        userId: z.string(),
        delivery: z.boolean(),
        status: z.string(),
        items: z.object({ id: z.string(), productId: z.string(), quantity: z.number() }).array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const status = input.status as Status;

      return await ctx.prisma.order.update({
        where: { id: input.orderId },
        data: {
          delivery: input.delivery,
          status: input.status,
          completedAt: status === "Completed" || status === "Cancelled" ? new Date() : undefined,
          items: {
            connectOrCreate:
              input.items
                .filter((item) => item.id === "" && item.quantity > 0)
                .map((item) => {
                  return {
                    create: {
                      user: { connect: { id: input.userId } },
                      product: { connect: { id: item.productId } },
                      quantity: item.quantity,
                    },
                    where: { id: item.id },
                  };
                }) || [],
            update:
              input.items
                .filter((item) => item.id !== "" && item.quantity > 0)
                .map((item) => {
                  return {
                    data: {
                      user: { connect: { id: input.userId } },
                      product: { connect: { id: item.productId } },
                      quantity: item.quantity,
                    },
                    where: { id: item.id },
                  };
                }) || [],
            delete:
              input.items
                .filter((item) => item.id !== "" && item.quantity === 0)
                .map((item) => {
                  return { id: item.id };
                }) ?? [],
          },
        },
        select: {
          items: true,
        },
      });
    }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.order.delete({ where: { id: input.id } });
  }),
});
