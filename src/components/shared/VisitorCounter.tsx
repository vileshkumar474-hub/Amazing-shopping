'use client';

import { useEffect, useState } from 'react';

export default function VisitorCounter() {
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
    const initialVisitors = Math.floor(Math.random() * (1500 - 1200 + 1)) + 1200;
    setVisitors(initialVisitors);

    const interval = setInterval(() => {
      setVisitors(prev => prev + 1);
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm text-muted-foreground">
      <span className="font-semibold text-primary">{visitors.toLocaleString()}</span> people are currently online
    </div>
  );
}
