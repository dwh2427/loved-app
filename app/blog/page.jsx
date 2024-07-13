// app/sending-receiving/page.jsx
'use client'; // This marks the component as a Client Component

import { getStoryblokApi } from "@storyblok/react/rsc";
import DynamicStoryBlock from '@/components/storyblok/DynamicStoryBlock'; // Adjust the path as necessary
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

async function fetchData() {
  const storyblokApi = getStoryblokApi();
  let sbParams = { version: "draft" };
  const response = await storyblokApi.get(`cdn/stories/blog`, sbParams, { cache: "no-store" });
  return response.data;
}

export default function Blog() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    }
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Loader2 className="size-6 animate-spin text-center" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <DynamicStoryBlock data={data} />;
}
