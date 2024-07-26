
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex flex-col items-center">
        <div className="w-[90%] h-full">
        {children}
        </div>
    </div>
  );
}
