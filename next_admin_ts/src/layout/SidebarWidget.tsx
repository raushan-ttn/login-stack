import Image from 'next/image';
import React from 'react';

export default function SidebarWidget() {
  return (
    <div className="flex mt-4 items-center">
      <Image
        src="/images/favicon.ico"
        alt="Newers World"
        height={20}
        width={20}
      />
      <span className="footer-text ms-1">TO THE NEW © 2025</span>
    </div>
  );
}
