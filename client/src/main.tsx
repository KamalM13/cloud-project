import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import { ThemeProvider } from "@/components/theme-provider";
import { App } from "@/App";
import { AuthProvider } from "@/components/auth-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <CookiesProvider>
            <AuthProvider>
              <SidebarProvider>{children}</SidebarProvider>
            </AuthProvider>
          </CookiesProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(
  <Providers>
    <App />
    <Toaster richColors />
  </Providers>
);
