import React from 'react';
import ProgressBar from '../component/ProgressBar/ProgressBar.js';

export default {
    title: 'ProgressBar',
    component: ProgressBar
}

export const Empty = () => <ProgressBar progress={0} color={'greenyellow'} description='loading assets...' />;

export const Half = () => <ProgressBar progress={50} color='pink' description='loading assets...' />;

export const Full = () => <ProgressBar progress={100} color='pink' description='loading assets...' />;