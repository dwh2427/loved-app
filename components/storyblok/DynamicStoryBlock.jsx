// components/storyblok/SendingReceivingClient.jsx
'use client';

import { Suspense, useEffect, useState } from "react";

export default function DynamicStoryBlock({ data }) {
  const [storyData, setStoryData] = useState(data);

  useEffect(() => {
    setStoryData(data);
  }, [data]);

  // Enhanced logging to check the structure of storyData
  if (!storyData || !storyData.story) {
    console.error('Error: Invalid data structure', storyData);
    return <div>Error: Invalid data structure</div>;
  }

  const { name, content } = storyData.story;

  // Check if content is defined before accessing properties
  if (!content) {
    console.error('Error: Missing content in storyData', storyData);
    return <div>Error: Missing content in storyData</div>;
  }

  const { updated, body } = content;

  // Check if the fields being accessed are valid
  console.log('Story Name:', name);
  console.log('Content Updated:', updated);
  console.log('Content Body:', body);

  // Further validation
  if (typeof body !== 'string' && !Array.isArray(body)) {
    console.error('Error: Body is not a string or array', body);
    return <div>Error: Invalid body format</div>;
  }

  return (
    <div>
      <Suspense>
        <div className="min-h-screen flex flex-col items-center p-4">
          <div className="p-6 w-full max-w-3xl">
            <h1 className="text-4xl web-page-heading">{name}</h1>
            <p className="web-page-date">Last updated {updated}</p>
            <div className="web-page-paragraph">
              {Array.isArray(body) ? body.join(' ') : body}
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
