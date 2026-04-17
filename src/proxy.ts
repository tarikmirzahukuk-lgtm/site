import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
      const isLoginPage = req.nextUrl.pathname === "/admin/giris";

      if (isLoginPage) return true;
      if (isAdminRoute) return !!token;
      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
