import React from 'react';
import { CircleCheckBig, Download, Heart, ListMusic, Upload } from 'lucide-react';

function Nav() {
  return (
    <div className="text-sm text-neutral-800">
      <div className="text-xs text-gray-500 pl-5 h-7 mt-6">我的音乐</div>
      <div className="leading-6">
        <div className="flex items-center space-x-2 h-9 pl-5 cursor-pointer bg-[#e1e1e1] text-[#c55147]">
          <ListMusic strokeWidth={1} size={18} />
          <span>全部音乐</span>
        </div>
        <div className="flex items-center space-x-2 h-9 pl-5 cursor-pointer hover:bg-[#e1e1e1]">
          <Heart strokeWidth={1} size={18} />
          <span>我喜欢的音乐</span>
        </div>
        <div className="flex items-center space-x-2 h-9 pl-5 cursor-pointer hover:bg-[#e1e1e1]">
          <Heart strokeWidth={1} size={18} />
          <span>黄老哥喜欢的音乐</span>
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-8 h-7 pl-5">传输列表</div>
      <div className="leading-6">
        <div className="flex items-center space-x-2 h-9 pl-5 cursor-pointer hover:bg-[#e1e1e1]">
          <Upload strokeWidth={1} size={18} />
          <span>正在上传</span>
        </div>
        <div className="flex items-center space-x-2 h-9 pl-5 cursor-pointer hover:bg-[#e1e1e1]">
          <Download strokeWidth={1} size={18} />
          <span>正在下载</span>
        </div>
        <div className="flex items-center space-x-2 h-9 pl-5 cursor-pointer hover:bg-[#e1e1e1]">
          <CircleCheckBig strokeWidth={1} size={18} />
          <span>传输完成</span>
        </div>
      </div>
    </div>
  );
}

export default Nav;
