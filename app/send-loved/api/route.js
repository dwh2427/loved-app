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
    if (file) {
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

    await postmarkClient.sendEmailWithTemplate({
      From: "admin@loved.com",
      To: email,
      TemplateId: 36035802, // Your template ID
      templateModel: {
        body: comment,
        attachment_details: [
          {
            attachment_url: imageUrl,
            attachment_name: "Comment Image",
            attachment_size: "40KB",
            attachment_type: "image",
          },
        ],
        commenter_name: username,
        timestamp: new Date().toLocaleString(),
        action_url: `https://loved-project.vercel.app/${page_name}`,
        notifications_url: "https://example.com/manage-notifications",
      },
    });

    if (Number(tipAmount) > 0) {
      // sending email to service provider
      await postmarkClient.sendEmailWithTemplate({
        From: "admin@loved.com",
        To: email,
        TemplateId: 36283661, // Your template ID
        templateModel: {
          page_owner_name: res.first_name + " " + res.last_name,
          customer_name: username,
          transaction_date: newComment.createdAt,
          tip_amount: tipAmount,
          comment: comment,
        },
      });

      // sending email to client
      clientEmail &&
        (await postmarkClient.sendEmailWithTemplate({
          From: "admin@loved.com",
          To: clientEmail,
          TemplateId: 36341904,
          templateModel: {
            name: username,
            page_name: res?.username,
            date: newComment.createdAt,
            description: comment,
            amount: Number(tipAmount) - Number(application_fee).toFixed(2),
            tipAmount: Number(application_fee).toFixed(2),
            total: tipAmount,
          },
        }));
    }

    return Response.json({
      data: newComment,
      message: "Comment created successfully",
    });
    // // Return a JSON response with the newly created comment data
  } catch (error) {
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
