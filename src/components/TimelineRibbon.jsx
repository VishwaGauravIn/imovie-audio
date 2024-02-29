import { IconArrowBackUp, IconCamera, IconMicrophone, IconPlayerPauseFilled, IconPlayerPlayFilled, IconWaveSine } from "@tabler/icons-react";
import React from "react";

export default function TimelineRibbon({isPlaying, handlePlayPauseButtonClick}) {
  return (
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
      {/* Play Pause field */}
      <div
        className="active:scale-95 ease-in-out transition-all"
        onClick={handlePlayPauseButtonClick}
      >
        {isPlaying ? (
          <IconPlayerPauseFilled
            data-tooltip-id="tooltip"
            data-tooltip-content="Pause"
            className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer"
          />
        ) : (
          <IconPlayerPlayFilled
            data-tooltip-id="tooltip"
            data-tooltip-content="Play"
            className="stroke-1 w-7 h-7 opacity-75 hover:opacity-100 transition-all ease-in-out cursor-pointer"
          />
        )}
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
  );
}
