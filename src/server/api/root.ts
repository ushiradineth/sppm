import { createTRPCRouter } from "@/server/api/trpc";

import { adminRouter } from "./routers/admin";
import { cartRouter } from "./routers/cart";
import { categoryRouter } from "./routers/category";
import { orderRouter } from "./routers/order";
import { productRouter } from "./routers/product";
import { userRouter } from "./routers/user";

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
  cart: cartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
