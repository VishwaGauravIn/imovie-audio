import React from "react";
import Draggable from "react-draggable";

export default function TimelineTrack({
  audioFiles,
  setIsDragging,
  setAudioFiles,
  audioRef,
  timelineWidthRef,
}) {
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
  return (
    <div id="timeline-track" className="flex px-3 gap-1">
      {audioFiles.map((audio, index) => (
        <Draggable
          key={audio.id}
          axis="x"
          bounds="parent"
          position={{ x: 0, y: 0 }}
          onStop={(e) => onAudioTrackDragStop(e, index)}
        >
          <div
            className="rounded-xl h-16 p-4 ring-1 audio-track ring-zinc-700 bg-zinc-800 flex items-center overflow-hidden select-none cursor-move"
            style={{ width: audio.width, maxWidth: audio.width }}
          >
            <div className="text-ellipsis whitespace-nowrap max-w-full overflow-hidden">
              {audio.name}
            </div>
          </div>
        </Draggable>
      ))}
    </div>
  );
}
