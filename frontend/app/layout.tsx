import "./globals.css";

export const metadata = {
  title: "CodeChronicle AI",
  description: "Engineering intelligence platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="app-body">{children}</body>
    </html>
  );
}
