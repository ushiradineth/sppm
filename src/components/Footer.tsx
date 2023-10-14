import { Facebook, Instagram } from "lucide-react";

import Image from "next/image";

export default function Footer() {
  return (
    <div className="flex flex-col-reverse items-center justify-center bg-teak-light-1 p-8 tablet:h-[300px] tablet:flex-row  tablet:items-center tablet:justify-evenly">
      <div className="flex flex-col items-center justify-center tablet:mb-4">
        <Image src="/icon.png" alt="icon" width={120} height={120} className="m-8 rounded-lg bg-peach-dark-1" />
        <h2 className="text-center text-h4">The Coffee Shop</h2>
      </div>
      <div className="mt-8 h-[1px] w-[90%] rounded bg-black tablet:mt-0 tablet:h-[90%] tablet:w-[1px]" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center tablet:block">
          <h3 className="text-h5">Our socials</h3>
          <div className="flex gap-4">
            <div className="w-fit rounded-sm bg-peach-dark-1 p-[2px]">
              <Facebook />
            </div>
            <div className="w-fit rounded-sm bg-peach-dark-1 p-[2px]">
              <Instagram />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center tablet:block">
          <h3 className="text-h5">Contact Us</h3>
          <p className="text-label">+ 94 77 123 1234</p>
          <p className="text-label">email@thecoffeeshop.com</p>
        </div>
      </div>
    </div>
  );
}
