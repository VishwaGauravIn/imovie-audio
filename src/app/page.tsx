"use client";

import {
  IconArrowBackUp,
  IconCamera,
  IconHelp,
  IconMicrophone,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlus,
  IconSettings,
  IconWaveSine,
} from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { Tooltip } from "react-tooltip";

interface AudioFile {
  id: number;
  name: string;
  url: string;
  duration: number;
  width: string;
  artist: string;
  albumArt: string;
}

export default function page() {
  // assuming that timeline is of 10min

  const [audioFiles, setAudioFiles] = useState<any[]>([]);
  const [timelineWidth, setTimelineWidth] = useState<number>(0);
  const [bufferTime, setBufferTime] = useState<number>(0); // [0, 600] 10min timeline assuming
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timelineWidthRef = useRef<Draggable>(null);

  const handleAddAudio = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
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
    const timelineElement = document.getElementById("timeline");
    const timelineRect = timelineElement.getBoundingClientRect();
    const percentage = (e.clientX - timelineRect.left) / timelineRect.width;
    let durationInSec = percentage * 600; // Assuming 10 minutes timeline
    if (durationInSec > 600) durationInSec = 600; // handle max duration

    let cumulativeDuration = 0;
    let selectedAudioIndex = -1;
    for (let i = 0; i < audioFiles.length; i++) {
      if (cumulativeDuration + audioFiles[i].duration >= durationInSec) {
        selectedAudioIndex = i;
        break;
      }
      cumulativeDuration += audioFiles[i].duration;
    }

    if (selectedAudioIndex !== -1) {
      const selectedAudio = audioFiles[selectedAudioIndex];
      const currentTimeInSelectedAudio = durationInSec - cumulativeDuration;

      audioRef.current.src = selectedAudio.url;
      audioRef.current.currentTime = currentTimeInSelectedAudio;
      audioRef.current.load();
      audioRef.current.play();

      setTimelineWidth(e.clientX);
      setIsDragging(false);
    }
  }

  function handleTimeUpdate() {
    if (isDragging) return;
    setTimelineWidth(
      ((audioRef.current?.currentTime + bufferTime) / 600) *
        document.getElementById("timeline")?.clientWidth
    );
  }

  function handleEnded() {
    const currentAudioIndex = audioFiles.findIndex(
      (audio) => audio.url === audioRef.current.src
    );
    if (currentAudioIndex === audioFiles.length - 1 && audioRef.current) {
      setBufferTime(0);
      setTimelineWidth(0);
      audioRef.current.src = audioFiles[0].url;
      audioRef.current.load();
      audioRef.current.play();
    }
    if (
      audioFiles &&
      audioFiles.length > 0 &&
      currentAudioIndex >= 0 &&
      currentAudioIndex < audioFiles.length
    ) {
      let sum = 0;
      for (let i = 0; i <= currentAudioIndex; i++) {
        sum += audioFiles[i].duration;
      }
      setBufferTime(sum);
    }
    if (audioRef.current && currentAudioIndex < audioFiles.length - 1) {
      const nextAudio = audioFiles[currentAudioIndex + 1];
      audioRef.current.src = nextAudio.url;
      audioRef.current.load();
      audioRef.current.play();
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  function handlePlayPauseButtonClick() {
    if (audioFiles.length === 0) return;
    setIsPlaying((prevState) => !prevState);
  }

  const onAudioTrackDragStop = (e, trackIndex) => {
    setIsDragging(true);
    const timelineElement = document.getElementById("timeline");
    const timelineRect = timelineElement.getBoundingClientRect();
    const percentage = (e.clientX - timelineRect.left) / timelineRect.width;
    let durationInSec = percentage * 600; // Assuming 10 minutes timeline
    if (durationInSec > 600) durationInSec = 600; // handle max duration

    let cumulativeDuration = 0;
    let newIndex = -1;
    let newCumulativeDuration = 0;
    for (let i = 0; i < audioFiles.length; i++) {
      if (i === trackIndex) {
        newCumulativeDuration = cumulativeDuration + durationInSec;
      }
      if (cumulativeDuration >= newCumulativeDuration && newIndex === -1) {
        newIndex = i;
      }
      cumulativeDuration += audioFiles[i].duration;
    }

    const draggedTrack = audioFiles[trackIndex];
    const updatedAudioFiles = [...audioFiles];
    updatedAudioFiles.splice(trackIndex, 1);
    updatedAudioFiles.splice(newIndex, 0, draggedTrack);

    timelineWidthRef.current?.props.position.x; //

    setAudioFiles(updatedAudioFiles);
    respositionTracks();
    setIsDragging(false);
  };

  function respositionTracks() {
    const timelineElement = document.getElementById("timeline");
    const timelineRect = timelineElement.getBoundingClientRect();
    const percentage =
      (timelineWidthRef.current?.props.position.x - timelineRect.left) /
      timelineRect.width;
    let durationInSec = percentage * 600; // Assuming 10 minutes timeline
    if (durationInSec > 600) durationInSec = 600; // handle max duration

    let cumulativeDuration = 0;
    let selectedAudioIndex = -1;
    for (let i = 0; i < audioFiles.length; i++) {
      if (cumulativeDuration + audioFiles[i].duration >= durationInSec) {
        selectedAudioIndex = i;
        break;
      }
      cumulativeDuration += audioFiles[i].duration;
    }

    if (selectedAudioIndex !== -1) {
      const selectedAudio = audioFiles[selectedAudioIndex];
      const currentTimeInSelectedAudio = durationInSec - cumulativeDuration;

      audioRef.current.src = selectedAudio.url;
      audioRef.current.currentTime = currentTimeInSelectedAudio;
      audioRef.current.load();
      audioRef.current.play();
    }
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
        <div
          id="timeline"
          className="h-[calc(100% - 56px)] px-2 absolute w-full"
        >
          <Draggable
            axis="x"
            bounds="parent"
            position={{ x: timelineWidth, y: 0 }}
            onStart={() => setIsDragging(true)}
            onStop={onTimelineDragStop}
            ref={timelineWidthRef}
          >
            <div className="w-1 h-48 bg-amber-500 opacity-50 active:opacity-75 rounded-full"></div>
          </Draggable>
        </div>

        <div id="timeline-track" className="flex px-3">
          {audioFiles.map((audio, index) => (
            <Draggable
              key={audio.id}
              axis="x"
              bounds="parent"
              position={{ x: 0, y: 0 }}
              onStop={(e) => onAudioTrackDragStop(e, index)}
            >
              <div
                className="rounded-xl h-16 overflow-hidden p-1 ring audio-track"
                style={{ width: audio.width, maxWidth: audio.width }}
              >
                {audio.name}
              </div>
            </Draggable>
          ))}
        </div>

        {/*  */}
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls
          onSeeked={() => {
            const currentAudioIndex = audioFiles.findIndex(
              (audio) => audio.url === audioRef.current.src
            );
            if (audioFiles && audioFiles.length > 0 && currentAudioIndex > 0) {
              let sum = 0;
              for (let i = 0; i <= currentAudioIndex - 1; i++) {
                sum += audioFiles[i].duration;
              }
              console.log(sum);
              setBufferTime(sum);
            } else {
              setBufferTime(0);
            }
          }}
          className="absolute -top-20"
        ></audio>
      </div>
      <Tooltip id="tooltip" />
    </main>
  );
}
