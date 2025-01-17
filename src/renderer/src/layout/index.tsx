import Nav from '@/components/Nav';
import { Slider } from '@/components/ui/slider';
import { useStore } from '@/store';
import { formatTime } from '@/utils';
import {
  CirclePause,
  CirclePlay,
  Heart,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { IAudioMetadata } from 'music-metadata';
import { ComponentProps, useEffect, useRef, useState } from 'react';

function Index(props: ComponentProps<'div'>) {
  // 使用解构方式从useStore中提取所需的状态和方法
  const { currentMusic, musics, setCurrentMusic, setCurrentIndex } = useStore(
    (state) => ({
      currentMusic: state.currentMusic,
      musics: state.musics,
      setCurrentMusic: state.setCurrentMusic,
      setCurrentIndex: state.setCurrentIndex,
    }),
  );
  // 音乐元数据
  const [metadata, setMetadata] = useState<IAudioMetadata | null>(null);
  // 音频元素
  const audioRef = useRef<HTMLAudioElement>(null);
  // 是否正在播放
  const [isPlaying, setIsPlaying] = useState(false);
  // 专辑封面
  const [imgURL, setImgURL] = useState(null);
  // 当前播放时间
  const [currentTime, setCurrentTime] = useState(0);

  // 播放/暂停
  function togglePlayPause() {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  // 初始化
  useEffect(() => {
    const init = async () => {
      // 没有音乐，直接返回
      if (!currentMusic) return;
      const blob = new Blob([currentMusic.fileBuffer]);
      const audioURL = URL.createObjectURL(blob);

      const pic = currentMusic.metadata.common.picture?.[0];
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
      setMetadata(currentMusic.metadata);
    };
    init();
  }, [currentMusic]);

  // 监听音频播放时间和结束事件
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    // 处理音频播放结束
    const handleEnded = () => {
      playPrevOrNext(true); // 播放下一首
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioRef.current, currentMusic]); // 添加 currentMusic 作为依赖

  const progress = (currentTime / metadata?.format?.duration) * 100 || 0;

  const setCurrentTimeRef = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // 播放上一首或者下一首
  const playPrevOrNext = async (isNext: boolean) => {
    if (!currentMusic || !musics.length) return;
    const currentIndex = musics.findIndex((m) => m.id === currentMusic.id);
    const nextIndex = isNext
      ? (currentIndex + 1) % musics.length
      : (currentIndex - 1 + musics.length) % musics.length; // 循环播放
    const nextMusic = musics[nextIndex];
    const res = await window.context.playMusic(
      nextMusic.id,
      nextMusic.filePath,
    );
    setCurrentMusic(res);
    setCurrentIndex(nextIndex);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex flex-auto overflow-hidden">
        <div className="w-52 bg-[#ededed]">
          <Nav />
        </div>
        <div className="flex-auto h-full">{props.children}</div>
      </div>
      <div className="h-14">
        <Slider
          value={[progress]}
          max={100}
          step={1}
          className="bg-blue-500"
          onValueChange={(newValue) => {
            const _v = ((metadata?.format?.duration || 0) * newValue[0]) / 100;
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
                {metadata?.common?.title} -{metadata?.common?.artist}
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
                onClick={() => playPrevOrNext(false)}
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
                onClick={() => playPrevOrNext(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
