import { Mic, MicOff, Video, VideoOff, Settings } from "lucide-react";
import { RefObject, useState } from "react";

type UserVideoProps = {
  videoRef: RefObject<HTMLVideoElement>;
  cameraError: string | null;
};

export default function UserVideo({ videoRef, cameraError }: UserVideoProps) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  return (
    <div className="relative flex-1 bg-gray-900 rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[200px] group">
      {/* Label */}
      <div className="absolute top-3 left-3 z-10 bg-black/50 px-2 py-1 rounded text-[10px] font-bold text-white uppercase">
        You
      </div>

      {/* Hover Controls */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 gap-4">
        <button
          onClick={() => setIsMicOn(!isMicOn)}
          className={`p-3 rounded-full ${
            isMicOn ? "bg-white text-gray-900" : "bg-red-500 text-white"
          } shadow-lg`}
        >
          {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-3 rounded-full ${
            isVideoOn ? "bg-white text-gray-900" : "bg-red-500 text-white"
          } shadow-lg`}
        >
          {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        <button className="p-3 rounded-full bg-gray-800/80 text-white hover:bg-gray-700 shadow-lg">
          <Settings size={20} />
        </button>
      </div>

      {/* Camera Error */}
      {cameraError ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100">
          <VideoOff size={32} className="mb-2 opacity-50" />
          <span className="text-xs">Camera Unavailable</span>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover transform scale-x-[-1] ${
            isVideoOn ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Fallback Avatar */}
      {!isVideoOn && !cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold text-xl">
            You
          </div>
        </div>
      )}
    </div>
  );
}
