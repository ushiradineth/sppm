import { createTRPCRouter } from "@/server/api/trpc";

import { adminRouter } from "./routers/admin";
import { categoryRouter } from "./routers/category";
import { productRouter } from "./routers/product";
import { userRouter } from "./routers/user";
import { orderRouter } from "./routers/order";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  admin: adminRouter,
  order: orderRouter,
  product: productRouter,
  category: categoryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
