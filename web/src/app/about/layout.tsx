import { AboutNavigation } from "./components/aboutnav";

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pl-[100px] flex flex-1">
      <AboutNavigation />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
} 