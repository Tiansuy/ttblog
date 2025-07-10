import type { Metadata } from "next";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/components/i18n-provider";

const inter = Inter({ subsets: ["latin"] });
const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: "--font-orbitron" 
});
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-jetbrains-mono" 
});

export const metadata: Metadata = {
  title: "TTBlog - Personal CMS",
  description: "A modern personal content management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className,
          orbitron.variable,
          jetbrainsMono.variable
        )}
      >
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            themes={["dark"]}
            enableSystem={false}
            disableTransitionOnChange
            forcedTheme="dark"
          >
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
