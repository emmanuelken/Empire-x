// src/app/history/page.js
'use client';

import React from 'react';
import withAuth from '@/components/withAuth';


const HistoryPage = () => {
  return(
    <div>
      <h1>Your Transaction History</h1>
    </div>
  )
};

export default withAuth(HistoryPage);
