import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/layout';
import { useStore } from '@/store';
import { MusicInfo } from '@shared/models';
import { MonitorUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster } from './components/ui/toaster';

function App() {
  const { toast } = useToast();
  const setCurrentMusic = useStore((state) => state.setCurrentMusic);
  const currentMusic = useStore((state) => state.currentMusic);
  console.log(currentMusic, 'currentMusic');
  const [musics, setMusics] = useState<MusicInfo[]>([]);

  useEffect(() => {
    const init = async () => {
      const _musics = await window.context.getMusics();
      console.log(_musics, '_musics');
      setMusics(_musics);
      const res = await window.context.playMusic(_musics[0].filePath);
      setCurrentMusic(res);
    };
    init();
  }, []);

  const onImport = async () => {
    try {
      await window.context.importMusic();
      const _musics = await window.context.getMusics();
      setMusics(_musics);
      toast({ description: '上传完成' });
    } catch (err) {
      console.log(err);
    }
  };

  // const onDelete = async (id: string) => {
  //   await window.context.deleteMusic(id);
  //   const _musics = await window.context.getMusics();
  //   setMusics(_musics);
  // };

  return (
    <Layout>
      <div className="w-full">
        <div className="m-2.5 text-sm font-medium mt-6">全部音乐</div>
        <div className="text-xs flex items-center space-x-2 text-gray-500 m-2.5 mt-6">
          <span>磁盘容量</span>
          <Progress value={10} className="w-32 bg-gray-200" />
          <span>1.5G/150G</span>
        </div>
        <div className="bg-[#cd4e3f] w-28 space-x-2 text-white text-sm h-7 flex items-center justify-center rounded-full m-2.5 mt-6">
          <MonitorUp strokeWidth={0} size={18} />
          <span className="cursor-pointer" onClick={onImport}>
            上传音乐
          </span>
        </div>
        {/* <div className="bg-[#cd4e3f] w-28 space-x-2 text-white text-sm h-7 flex items-center justify-center rounded-full m-2.5 mt-6">
          <Trash2 strokeWidth={0} size={18} />
          <span
            className="cursor-pointer"
            onClick={() => onDelete('768e6e8c-f4f9-440d-84c6-d1a9677b04ba')}
          >
            删除音乐
          </span>
        </div> */}
        <div>
          <Table className="text-xs">
            <TableHeader>
              <TableHead></TableHead>
              <TableHead>音乐标题</TableHead>
              <TableHead>歌手</TableHead>
              <TableHead>专辑</TableHead>
              <TableHead>格式</TableHead>
              <TableHead>大小</TableHead>
              <TableHead>上传时间</TableHead>
            </TableHeader>

            <TableBody>
              {musics?.length === 0 && (
                <TableRow className="text-gray-500 text-center">
                  <TableCell colSpan={7}>暂无数据</TableCell>
                </TableRow>
              )}
              {musics.map((music, index) => {
                console.log(music, 'music');
                return (
                  <TableRow
                    onDoubleClick={async () => {
                      try {
                        const res = await window.context.playMusic(
                          music.filePath,
                        );
                        console.log(res, 'res');
                        setCurrentMusic(res);
                      } catch (error) {
                        toast({
                          title: '提示',
                          description: error.message,
                        });
                      }
                    }}
                    key={index}
                    className="cursor-pointer"
                    data-state={index === 0 ? 'selected' : ''}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{music.title}</TableCell>
                    <TableCell>{music.artist}</TableCell>
                    <TableCell>{music.album}</TableCell>
                    <TableCell>{music.genre}</TableCell>
                    <TableCell>{music.duration}</TableCell>
                    <TableCell>{music.uploadTime}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      <Toaster />
    </Layout>
  );
}

export default App;
