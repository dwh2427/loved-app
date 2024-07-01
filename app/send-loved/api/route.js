import { errorResponse } from "@/lib/server-error";
import { uploadImage } from "@/lib/uploadImage";
import Comments from "@/models/Comment";
import Loved from "@/models/loved";
import User from "@/models/user";
import connectDB from "@/mongodb.config";
import { ServerClient } from "postmark";

connectDB();

export async function POST(req) {
  const postmarkClient = new ServerClient(process.env.POSTMARK_API_KEY);
  const form = await req.formData();
  const file = form?.get("image");
  const username = form.get("username");
  const comment = form.get("comment");
  const tipAmount = form.get("tipAmount");
  const application_fee = form.get("application_fee");
  const clientEmail = form.get("email");
  const page_name = form.get("page_name");
  const uid = form.get("page_owner_id");
  let imageUrl = "";
  try {
    if (file && file.size > 0) {
      imageUrl = await uploadImage(file);
    } else {
      imageUrl = "";
    }

    // get user email by page owner id
    const res = await User.findOne({ uid });
    const email = res?.email;

    const newComment = new Comments({
      username,
      comment,
      image: imageUrl,
      page_name,
    });
    await newComment.save();
    if (Number(tipAmount) > 0) {
      // sending email to service provider
        const serviceProviderTemplateModel = {
          page_owner_name: res.first_name + " " + res.last_name,
          customer_name: username,
          transaction_date: newComment.createdAt,
          tip_amount: tipAmount,
          logo_link: `https://loved-project.vercel.app/new-logo.png`,
          page_link: `https://loved-project.vercel.app/${page_name}`,
          image_link: imageUrl,
          comment: comment,
        };
  
        console.log("Service Provider Template Model:", serviceProviderTemplateModel);
  
        const sendPageOwnerEmail = await postmarkClient.sendEmailWithTemplate({
          From: "admin@loved.com",
          To: email,
          TemplateId: 36283661, // Your template ID
          templateModel: serviceProviderTemplateModel,
        });
      // sending email to client
      const totalAmount = Number(tipAmount) + Number(application_fee);
      const clientTemplateModel = {
        name: username,
        page_name: page_name,
        date: newComment.createdAt,
        description: comment,
        amount: Number(tipAmount).toFixed(2),
        logo_link: `https://loved-project.vercel.app/new-logo.png`,
        page_link: `https://loved-project.vercel.app/${page_name}`,
        tipAmount: Number(application_fee).toFixed(2),
        image_link: imageUrl,
        total: totalAmount.toFixed(2),
      };

      console.log(sendPageOwnerEmail);
      console.log("Client Template Model:", clientTemplateModel);

      clientEmail &&
        (await postmarkClient.sendEmailWithTemplate({
          From: "admin@loved.com",
          To: clientEmail,
          TemplateId: 36341904,
          templateModel: clientTemplateModel,
        }));
    }

    return Response.json({
      data: newComment,
      message: "Comment created successfully",
    });
  } catch (error) {
    console.error("Error:", error.message);
    // If an error occurs, return an error response
    return errorResponse(error);
  }
}

export async function GET(req) {
  try {
    const data = await Loved.find({ stripe_acc_id: { $ne: null } });
    if (data) {
      return Response.json(data);
    }
    return Response.json({ status: false, message: "No data found" });
  } catch (error) {
    console.log(error);
  }
}
