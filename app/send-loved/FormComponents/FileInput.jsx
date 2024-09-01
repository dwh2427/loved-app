import Image from "next/image";
import CameraIcon from "@/public/camera-icon.svg";
import { useState } from "react";

export default function FileInput({setImageFile}) {
  const [imageName, setImageName] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
    // Handles file selection and preview
    const handleFileChange = async (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        setImageName(selectedFile["name"]);
        const reader = new FileReader();
        reader.onload = () => {
          const base64URL = reader.result;
          setPreviewUrl(base64URL);
        };
        reader.readAsDataURL(selectedFile);
        setImageFile(selectedFile);
      }
    };
  
    
  return (
    <div className="form-group relative">
      <input onChange={handleFileChange} type="file" id="file" className="hidden" name="image" />
      <label
        htmlFor="file"
        className="block w-[330px] rounded-full bg-[#F1F1F1] p-2 pl-10"
        type="text"
        placeholder={`${imageName ? imageName : "Add photo"}`}
      >
        <span className="text-[#c5cad1]">Add photo</span>
      </label>
      <Image src={CameraIcon} alt="Search Bar" width={17} height={17} className="absolute left-3 top-3.5" />
      {previewUrl && (
        <Image
          src={previewUrl}
          alt="Preview"
          width={330}
          height={250}
          className="mt-4 h-[250px] w-[330px] rounded-[25px] object-cover"
        />
      )}
    </div>
  );
}
