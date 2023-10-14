import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { z } from "zod";

import { env } from "@/env.mjs";
import { deleteFiles } from "@/lib/supabase";

import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ email: z.string(), password: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({ where: { email: input.email } });

      if (user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Account already exists",
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(input.password, salt);

      return ctx.prisma.user.create({ data: { name: input.name, email: input.email, password: hashedPassword } });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string(), password: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const data: { name?: string; password?: string } = { name: input.name };

      if (input.password) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(input.password, salt);
        data.password = hashedPassword;
      }

      const user = await ctx.prisma.user.update({ where: { id: input.id }, data });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Account doesnt exists",
        });
      }

      return user;
    }),

  delete: adminProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.delete({ where: { id: input.id } });

    await deleteFiles(env.NEXT_PUBLIC_USER_ICON_BUCKET, input.id);

    return user;
  }),

  forgotPassword: publicProcedure.input(z.object({ email: z.string() })).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({ where: { email: input.email } });

    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Account doesnt exists",
      });
    }

    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    async function SendEmail() {
      return new Promise((resolve) => {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: env.GMAIL_ADDRESS,
            pass: env.GMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: env.GMAIL_ADDRESS,
          to: input.email,
          subject: "One Time Password by The Coffee Shop",
          text: `You have requested for a One Time Password. Your OTP is ${OTP}, if this was not requested by you, contact us through this mail. Thank you!`,
        };

        transporter.sendMail(mailOptions, async function (error) {
          if (error) {
            resolve(false);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to send email",
            });
          } else {
            const salt = bcrypt.genSaltSync(10);
            const hashedOtp = bcrypt.hashSync(OTP, salt);

            await ctx.prisma.verification.deleteMany({ where: { userId: user?.id } });
            await ctx.prisma.verification.create({ data: { userId: user?.id ?? "", otp: hashedOtp } });

            resolve(true);
          }
        });
      });
    }

    await SendEmail();

    return user;
  }),

  resetPassword: publicProcedure
    .input(z.object({ email: z.string(), otp: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({ where: { email: input.email } });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Account doesnt exists",
        });
      }

      const request = await ctx.prisma.verification.findFirst({ where: { userId: user.id } });

      if (!request) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reset request not found",
        });
      }

      const otpVerified = bcrypt.compareSync(input.otp, request?.otp ?? "");

      if (!otpVerified) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid OTP",
        });
      }

      const ONE_HOUR = 60 * 60 * 1000;
      if (new Date(request?.createdAt ?? "").getTime() + ONE_HOUR < Date.now()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "OTP has expired",
        });
      }

      await ctx.prisma.verification.delete({ where: { id: request?.id } });

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(input.password, salt);

      return await ctx.prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });
    }),

  clearCart: protectedProcedure.input(z.object({ ids: z.array(z.string()) })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { cart: { disconnect: input.ids.map((id) => ({ id })) } },
    });
  }),
});
