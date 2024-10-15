'use client';

import React from 'react';
import { CirclesWithBar } from 'react-loader-spinner';

const LoadingScreen = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
      <CirclesWithBar
        height='100'
        width='100'
        color='#0056D2'
        outerCircleColor='#0056D2'
        innerCircleColor='#0056D2'
        barColor='#0056D2'
        ariaLabel='circles-with-bar-loading'
        wrapperStyle={{}}
        wrapperClass=''
        visible={true}
      />
    </div>
  );
};

export default LoadingScreen;
