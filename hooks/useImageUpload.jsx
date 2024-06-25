"use client";
import axios from "axios";
import { useState } from "react";
import useClientError from "./useClientError";

const useImageUpload = (pageData, setPageData) => {
  const [isUploading, setIsUploading] = useState(false);
  const handleClientError = useClientError();
  const [isCropping, setIsCropping] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const token = typeof window !== "undefined" && window.localStorage.getItem("accToken");

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("pageId", pageData?._id);
    try {
      const { data } = await axios.post(
        "/dashboard/api/image-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPageData(data.data);
    } catch (error) {
      handleClientError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64URL = reader.result;
        // setFile(selectedFile);
        setImageUrl(base64URL); // Assuming you have a state variable to store the image URL
        setIsCropping(true);
      };
      reader.readAsDataURL(selectedFile);
      setIsCropping(true);
    }
  };

  return {
    handleFileChange,
    handleFileUpload,
    isCropping,
    setIsCropping,
    isUploading,
    imageUrl,
    setImageUrl
    // setFile,
  };
};

export default useImageUpload