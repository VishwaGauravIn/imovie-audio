import React from "react";

export default function DisplaySection() {
  return (
    <div className="h-3/4 w-full flex justify-center items-center">
      <img
        src="https://source.unsplash.com/random/480x288/?music"
        alt=""
        className="h-full aspect-[480/288] bg-zinc-800"
      />
    </div>
  );
}
