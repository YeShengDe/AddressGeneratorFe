'use client';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

function Footer() {
  const [hostname, setHostname] = useState<string>('');
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      setHostname(window.location.hostname);
    }
  }, []);
  return (
    <footer
      className="md:w-auto w-full rounded-none md:rounded-tl-lg  text-[10px] z-[800] bg-[rgba(0,0,0,.6)] fixed bottom-0 right-0 px-4  text-white  flex-wrap flex justify-center items-center pt-[3px]"
      data-map-control
    >
      <a
        href="https://github.com/YeShengDe/AddressGeneratorFe"
        target="_blank"
        className=" mr-1"
        rel="noopener noreferrer"
      >
        <span className="underline-hover">Github</span>
      </a>
      <a
        href="https://onenav.twaliray.com/store"
        target="_blank"
        className=" mr-1"
        rel="noopener noreferrer"
      >
        <span className="underline-hover">Onenav</span>
      </a>
      <div className=" h-full flex justify-center items-center ">
        © 2023 - {dayjs().format('YYYY')} {hostname} All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
