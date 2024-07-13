// lib/storyblok.js

import { getStoryblokApi } from "@storyblok/react/rsc";

export async function fetchData() {
  let sbParams = { version: "draft" };

  const storyblokApi = getStoryblokApi();
  const { data } = await storyblokApi.get(`cdn/stories/legal`, sbParams, { cache: "no-store" });

  return data;
}
