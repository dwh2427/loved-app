"use client";
import { useEffect, useRef } from "react";

const useConvertHeicFile = () => {
  const windowRef = useRef(null)
  useEffect(() => {
    if (window !== undefined) {
      windowRef.current === window
    }
  }, [])
  if (!windowRef.current) return null

  function fileToBlob(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(new Blob([reader.result], { type: file.type }));
      };

      reader.onerror = () => {
        reject(new Error("Failed to convert file to Blob"));
      };

      reader.readAsArrayBuffer(file);
    });
  }
  return async function convertHeicToJpeg(file) {
    try {
      const blob = await fileToBlob(file);

      // const convertJpeg = await heic2any({
      //   blob,
      //   toType: "image/jpeg",
      //   quality: 0.5, // cuts the quality and size by half
      // });

      const convertedFile = new File(
        [convertJpeg],
        `${file.name.split(".")[0]}${Date.now()}.jpeg`,
        {
          type: convertJpeg.type,
        },
      );
      return convertedFile;

      // Convert HEIC file buffer to Blob
    } catch (error) {
      console.error("Error occurred during conversion:", error);
      throw error;
    }
  };
};
export default useConvertHeicFile;
