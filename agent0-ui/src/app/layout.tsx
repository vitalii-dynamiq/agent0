import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent-0 | DGE Executive Platform",
  description: "Executive decision support platform for the Department of Government Enablement",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
};

// Inline script to set theme before hydration (prevents flash)
// Default is dark mode for Agent-0
const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('agent0-theme');
      // Default to dark mode if no preference is stored
      var theme = stored === 'light' ? 'light' : 'dark';
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // Default to dark on error
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
