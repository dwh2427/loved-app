import axios from "axios";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    if (!file) {
      console.log("Please select an image");
      return;
    }

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=29eef69d086ebb4ad0539a9e9bd5e0fb`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.data.data.url) {
      return response.data.data.url;
    } else {
      console.error("Image upload failed");
    }
  } catch (error) {
    console.log("Error uploading image:");
  }
};
