/** 1. Tag it as a client component */
"use client";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";
 
/** 2. Initialize it as usual */
storyblokInit({
  accessToken: "k6otqdPfCMgHyEFnpdcxHQtt",
  use: [apiPlugin],
  apiOptions: {
    region: "us"
  },
});
 
export default function StoryblokProvider({ children }) {
  return children;
}