"use client";

import {
  IconArrowBackUp,
  IconCamera,
  IconHelp,
  IconMicrophone,
  IconPlayerPlayFilled,
  IconPlus,
  IconSettings,
  IconWaveSine,
} from "@tabler/icons-react";
import React from "react";
import { Tooltip } from "react-tooltip";

export default function page() {
  return (
    <main className="min-h-[100vh] h-[100vh] flex flex-col justify-between relative">
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
      <div className="h-3/4 w-full flex justify-center items-center">
        <img
          src="https://source.unsplash.com/random/480x288/?abstract"
          alt=""
          className="h-full aspect-[480/288] bg-zinc-800"
        />
      </div>
      <hr className="w-full border-4 border-[#121212]" />
      <div className="h-2/4 text-white">
        <div className="w-full h-14 flex justify-between p-2">
          <div className="flex gap-4">
            <IconMicrophone
              data-tooltip-id="tooltip"
              data-tooltip-content="Record"
              className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer"
            />
            <IconCamera
              data-tooltip-id="tooltip"
              data-tooltip-content="Capture"
              className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer"
            />
          </div>
          {/* Play Pause field : tbi */}
          <div className="">
            <IconPlayerPlayFilled
              data-tooltip-id="tooltip"
              data-tooltip-content="Play"
              className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer"
            />
          </div>
          <div className="flex gap-4">
            <IconArrowBackUp
              data-tooltip-id="tooltip"
              data-tooltip-content="Undo"
              className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer"
            />
            {/* TODO: Replace this with animated waves */}
            <IconWaveSine className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer text-cyan-300" />
          </div>
        </div>
      </div>
      <Tooltip id="tooltip" />
    </main>
  );
}
