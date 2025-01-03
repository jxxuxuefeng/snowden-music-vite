import Nav from '@/components/Nav';
import { Slider } from '@/components/ui/slider';
import { useStore } from '@/store';
import {
  CirclePause,
  CirclePlay,
  Heart,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import React, { ComponentProps, useEffect, useRef, useState } from 'react';

function formatTime(time: number) {
  const minutes =
    Math.floor(time / 60) < 10
      ? `0${Math.floor(time / 60)}`
      : Math.floor(time / 60);
  const seconds =
    Math.floor(time % 60) < 10
      ? `0${Math.floor(time % 60)}`
      : Math.floor(time % 60);
  return `${minutes}:${seconds}`;
}

function Index(props: ComponentProps<'div'>) {
  const currentMusic = useStore((state) => state.currentMusic);
  const [metadata, setMetadatao] = useState({});
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgURL, setImgURL] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  function togglePlayPause() {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  useEffect(() => {
    const init = async () => {
      if (!currentMusic) return;
      const res = currentMusic;
      console.log(res, 'res');
      const blob = new Blob([res.fileBuffer]);
      const audioURL = URL.createObjectURL(blob);

      const pic = res?.metadata?.common?.picture?.[0];
      if (pic) {
        const imgBlob = new Blob([pic.data]);
        const imgUrl = URL.createObjectURL(imgBlob);
        setImgURL(imgUrl);
      } else {
        setImgURL(null);
      }
      audioRef.current.src = audioURL;
      audioRef.current.play();
      setIsPlaying(true);
      setMetadatao(res.metadata);
    };
    init();
  }, [currentMusic]);

  useEffect(() => {
    const audio = audioRef.current;
    // console.log(audio, 'audi00o');
    audio.addEventListener('timeupdate', () => {
      // console.log(audioRef.current.currentTime, 'audioRef.current.currentTime');
      setCurrentTime(audioRef.current.currentTime);
    });

    return () => {
      audio.removeEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
      });
    };
  }, [audioRef]);

  const progress = (currentTime / metadata?.format?.duration) * 100 || 0;

  const setCurrentTimeRef = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex flex-auto">
        <div className="w-52 bg-[#ededed]">
          <Nav />
        </div>
        <div className="w-full">{props.children}</div>
      </div>
      <div className="h-14">
        <Slider
          value={[progress]}
          max={100}
          step={1}
          className="bg-blue-500"
          onValueChange={(newValue) => {
            console.log('onDragStart', newValue);
            const _v = (metadata?.format?.duration * newValue) / 100;
            setCurrentTime(_v);
            setCurrentTimeRef(_v);
          }}
        />

        <div className="flex bg-white p-2.5">
          <div className="bg-gray-100 w-9 h-9">
            <img className="w-full h-full" src={imgURL} />
          </div>
          <div>
            <div className="text-xs text-gray-500 pl-2">
              <div className="text-sm text-gray-600 truncate w-40">
                {metadata?.common?.album} -{metadata?.common?.artist}
              </div>
            </div>
            <div className="text-xs pl-2 text-gray-400">
              {formatTime(currentTime)} /{' '}
              {formatTime(metadata?.format?.duration)}
            </div>
          </div>
          <audio controls ref={audioRef} className="hidden" />
          <div className="flex ml-52 items-center">
            <div>
              <Heart className="w-4 text-gray-500 mr-8" />
            </div>
            <div className="flex items-center space-x-4">
              <SkipBack
                color="#c3473a"
                strokeWidth={1}
                className="cursor-pointer"
              />
              {isPlaying ? (
                <CirclePause
                  color="#c33737"
                  strokeWidth={1}
                  size={38}
                  onClick={togglePlayPause}
                  className="cursor-pointer"
                />
              ) : (
                <CirclePlay
                  color="#c33737"
                  strokeWidth={1}
                  size={38}
                  onClick={togglePlayPause}
                  className="cursor-pointer"
                />
              )}
              <SkipForward
                color="#c3473a"
                strokeWidth={1}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
