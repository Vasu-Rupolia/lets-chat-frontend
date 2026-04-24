// "use client";

// import { useEffect, useState } from "react";
// import Header from "@/components/Header";
// import Sidebar from "@/components/Sidebar";

// export default function ClientLayout({ children }: any) {

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     if (sidebarOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//   }, [sidebarOpen]);

//   return (
//     <>
//       <Header onMenuClick={() => setSidebarOpen(true)} />

//       <div className="pt-16 flex">
//         {/* <Sidebar
//           isOpen={sidebarOpen}
//           onClose={() => setSidebarOpen(false)}
//         /> */}

//         <main className="flex-1">{children}</main>
//       </div>
//     </>
//   );
// }

"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import { useEffect, useState } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideLayoutRoutes = ["/login", "/signup", "/forgot-password"];

  const hideLayout = hideLayoutRoutes.includes(pathname);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [sidebarOpen]);


  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="pt-16 flex">
        {/* <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        /> */}

        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}