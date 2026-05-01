import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" }
    ]
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https://images.unsplash.com https://*.public.blob.vercel-storage.com",
          "font-src 'self' data:",
          "connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://api.stripe.com https://*.neon.tech https://*.resend.com",
          "frame-src https://*.clerk.accounts.dev https://*.clerk.com https://checkout.stripe.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "upgrade-insecure-requests"
        ].join("; ")
      }
    ];

    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      }
    ];
  }
};

export default nextConfig;
