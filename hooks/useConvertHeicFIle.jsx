"use client";
import { useEffect } from "react";

const useConvertHeicFile = () => {

  useEffect(() => {
    if (window) {
      function fileToBlob(file) {
        if (!file) return
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
      async function convertHeicToJpeg(file) {
        if (!file) return
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
    }
  }, [])


};
export default useConvertHeicFile;
