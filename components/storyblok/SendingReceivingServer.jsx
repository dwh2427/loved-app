// components/storyblok/SendingReceivingClient.jsx
'use client';

import { useEffect, useState } from "react";
import { StoryblokStory } from "@storyblok/react/rsc";

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
      <StoryblokStory story={storyData.story} />
      <div className="min-h-screen flex flex-col items-center p-4">
        <div className="p-6 w-full max-w-3xl">
          <h1 className="text-4xl font-bold text-dark-purple-700">Sending & Receiving Donations</h1>
          <p className="text-gray-500 mb-4">Last updated November 22 2024</p>
          <div className="space-y-4 text-gray-700">
            {/* Add your content here */}
          </div>
        </div>
      </div>
    </div>
  );
}
