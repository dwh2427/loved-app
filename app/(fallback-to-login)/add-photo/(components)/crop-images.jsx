
import { Button } from '@/components/ui/button';
import useClientError from '@/hooks/useClientError';
import getCroppedImg from '@/lib/handleCropedImage';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import Cropper from 'react-easy-crop';

const CropEasy = ({ photoURL, setOpenCrop, setPhotoURL, handlImageUpload }) => {
  // const { setAlert, setLoading } = useAuth();
  const [loading, setLoading] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const cropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleClientError = useClientError()
  const handleCropedImage = async () => {
    setLoading(true);
    try {
      const { file, url } = await getCroppedImg(
        photoURL,
        croppedAreaPixels,
        rotation
      );
      setPhotoURL(url);
      await handlImageUpload(file)
    } catch (error) {
      handleClientError(error)

    } finally {
      setOpenCrop(false);
      setLoading(false);
      setPhotoURL('')

    }
  };

  return (
    <>
      <div className=''>
        <Cropper
          image={photoURL}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={4 / 3}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          restrictPosition={true}
          onCropChange={setCrop}
          onCropComplete={cropComplete}
          classes={'rounded-lg'}
        />
      </div>
      <div>
        <Button
          variant={"default"}
          disabled={loading}
          onClick={handleCropedImage}
          className="mx-auto  w-full  rounded-[64.71px] bg-[#FF007A] px-[51.77px] py-[30px] text-center text-[32.36px] font-black text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] md:text-center md:text-[18px] md:font-black mt-5 "
        >
          {loading && <Loader2 className="mr-2 size-6 animate-spin" />}
          Crop and Upload
        </Button>

      </div>
    </>

  );
};

export default CropEasy;

const zoomPercent = (value) => {
  return `${Math.round(value * 100)}%`;
};