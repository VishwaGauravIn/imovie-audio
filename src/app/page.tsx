"use client";

import { IconHelp, IconPlus, IconSettings } from "@tabler/icons-react";
import React from "react";
import { Tooltip } from "react-tooltip";

export default function page() {
  return (
    <main>
      <nav className="bg-[#121212] shadow-xl justify-between items-center flex w-full h-14 p-2 text-white">
        <button className="opacity-75 hover:opacity-100 transition-all ease-in-out">
          Done
        </button>
        <p className="">The Ocean</p>
        <div className="flex gap-4">
          <IconHelp
            data-tooltip-id="tooltip"
            data-tooltip-content="Help"
            className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer"
          />
          <IconSettings
            data-tooltip-id="tooltip"
            data-tooltip-content="Settings"
            className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer"
          />
          <IconPlus
            data-tooltip-id="tooltip"
            data-tooltip-content="Add Track"
            className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer"
          />
        </div>
      </nav>
      <Tooltip id="tooltip" />
    </main>
  );
}
