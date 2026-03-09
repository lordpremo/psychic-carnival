import "./../styles/globals.css";

export const metadata = {
  title: "BROKEN LORD SCRAPER",
  description: "Universal web scraper dashboard by Lord Broken"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
