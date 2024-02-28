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
import React, { useRef } from "react";
import Draggable from "react-draggable";
import { Tooltip } from "react-tooltip";

export default function page() {
  // assuming that timeline is of 10min

  const [audioFiles, setAudioFiles] = React.useState<any[]>([]);
  const [timelineWidth, setTimelineWidth] = React.useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleAddAudio = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "audio/*";
    input.addEventListener("change", handleFileChange);
    input.click();
  };

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    const updatedAudioFiles = files.map((file, index) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const audioElement = document.createElement("audio");
        audioElement.src = reader.result as string;
        audioElement.onloadedmetadata = () => {
          const audio: any = {
            id: audioFiles.length + index + 1,
            name: file.name,
            url: reader.result as string,
            duration: audioElement.duration,
            width: (audioElement.duration / (60 * 10)) * 100 + "%", // 10min timeline assuming
            artist: "", // You can extract artist info if available
            albumArt: "", // You can extract album art if available
          };
          setAudioFiles((prevState) => [...prevState, audio]);
          if (audioFiles.length === 0) {
            if (audioRef.current) {
              audioRef.current.src = audio.url;
              audioRef.current.load();
              audioRef.current.play();
            }
          }
        };
      };
    });
  };

  function onTimelineDragStop(e) {
    const percentage =
      (e.clientX / document.getElementById("timeline")?.clientWidth) * 100;
    let durationInSec = (percentage / 100) * 60 * 10; // 10min timeline assuming
    if (durationInSec > 600) durationInSec = 600; // handle max duration
    console.log(durationInSec, percentage);
    audioRef.current.currentTime = durationInSec;
    setTimelineWidth(e.clientWidth);
  }

  function handleTimeUpdate() {
    setTimelineWidth(
      (audioRef.current?.currentTime / 600) *
        document.getElementById("timeline")?.clientWidth
    );
  }
  console.log(audioFiles);

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
            onClick={handleAddAudio}
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
      <div className="h-2/4 text-white relative">
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
        <div
          id="timeline"
          className="h-[calc(100% - 56px)] px-2 absolute w-full"
        >
          <Draggable
            axis="x"
            bounds="parent"
            position={{ x: timelineWidth, y: 0 }}
            onStop={onTimelineDragStop}
          >
            <div className="w-1 h-48 bg-amber-500 opacity-50 active:opacity-75 rounded-full"></div>
          </Draggable>
        </div>

        {audioFiles.map((audio) => (
          <div
            className="rounded-xl h-16 overflow-hidden p-1"
            style={{ width: audio.width, maxWidth: audio.width }}
          >
            {audio.name}
          </div>
        ))}

        {/*  */}
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          controls
          className="absolute -top-20"
        ></audio>
      </div>
      <Tooltip id="tooltip" />
    </main>
  );
}
