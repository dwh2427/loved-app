// components/storyblok/SendingReceivingClient.jsx
'use client';

import {Suspense, useEffect, useState } from "react";

export default function SendingReceivingClient({ data }) {
  const [storyData, setStoryData] = useState(data);

  useEffect(() => {
    setStoryData(data);
  }, [data]);

  if (!storyData || !storyData.story) {
    console.error('Error: Invalid data structure', storyData);
    return <div>Error: Invalid data structure</div>;
  }

  return (
    <div>
      <Suspense>
      <div className="min-h-screen flex flex-col items-center p-4">
        <div className="p-6 w-full max-w-3xl">
          <h1 className="text-4xl web-page-heading">{storyData.story.name}</h1>
          <p className="web-page-date">Last updated {storyData.story.content.updated}</p>
          <div className="web-page-paragraph">
                 {storyData.story.content.body}
          </div>
        </div>
      </div>
    </Suspense>
    </div>
  );
}
