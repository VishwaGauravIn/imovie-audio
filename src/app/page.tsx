import { IconHelp, IconPlus, IconSettings } from "@tabler/icons-react";
import React from "react";

export default function page() {
  return (
    <main>
      <nav className="bg-[#121212] shadow-xl justify-between items-center flex w-full h-14 p-2 text-white">
        <button className="opacity-75 hover:opacity-100 transition-all ease-in-out">
          Done
        </button>
        <p className="">The Ocean</p>
        <div className="flex gap-4">
          <IconHelp className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer" />
          <IconSettings className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer" />
          <IconPlus className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer" />
        </div>
      </nav>
    </main>
  );
}
