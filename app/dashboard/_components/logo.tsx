import Image from 'next/image';
import React from 'react';

const Logo = () => {
  return <Image height={160} width={160} alt='Logo' src='/logo.png' />;
};

export default Logo;
