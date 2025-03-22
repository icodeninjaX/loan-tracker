import "./globals.css";

export const metadata = {
  title: "Utang Tracker App",
  description: "Track your loans and debts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-900 font-['Inter',sans-serif]">
        <div className="max-w-6xl mx-auto">{children}</div>
      </body>
    </html>
  );
}
