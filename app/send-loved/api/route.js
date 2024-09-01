import { errorResponse } from "@/lib/server-error";
import { uploadImage } from "@/lib/uploadImage";
import Comments from "@/models/Comment";
import Loved from "@/models/loved";
import User from "@/models/user";
import connectDB from "@/mongodb.config";
import verifyIdToken from "@/lib/server-auth";
import { ServerClient } from "postmark";
import { Twilio } from 'twilio';
import { v4 as uuidv4 } from 'uuid';
import stripe from 'stripe'; // Import Stripe
const stripeClient = stripe(process.env.NEXT_STRIPE_SECRET_KEY); // Initialize Stripe with your secret key
import CustomerActivity from "@/models/CustomerActivity";  // Import the UserActivity model

connectDB();

const twilioClient = new Twilio(process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID, process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN);

export async function POST(req) {
  const user = await verifyIdToken(req);
  const postmarkClient = new ServerClient(process.env.POSTMARK_API_KEY);
  const form = await req.formData();
  const file = form?.get("image");
  const username = form.get("username");
  const comment = form.get("comment");
  let tipAmount = form.get("tipAmount") || 0;
  const application_fee = form.get("application_fee");
  const clientEmail = form.get("email");
  const page_name = form.get("page_name");
  const uid = form.get("page_owner_id");
  const paymentIntentId = form.get("paymentIntentId");
  const comment_to = form.get("inputValue");
  const stripeAccountId = form.get("stripe_acc_id");
  const scheduled_time = form.get("scheduled_time");
  const scheduled_date = form.get("scheduled_date");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format (optional "+" followed by 1-15 digits)
  const uniqueId = uuidv4();

  let imageUrl = "";
  let is_paid = 0;
  let charge_id = "";
  let transfer_time = null;
  let transfer_type = null;
  let notify_to = null;

  try {
    if (file && file.size > 0) {
      imageUrl = await uploadImage(file);
    }

    const nameParts = username.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' '); // handles cases with multiple words in the last name

    // Update user in the database
    const userToUpdate = await User.findById(user._id);
    if (userToUpdate) {
      userToUpdate.first_name = firstName;
      userToUpdate.last_name = lastName;
      userToUpdate.email = clientEmail; // Assuming clientEmail is the new email
      await userToUpdate.save();
    }

    // Get user email by page owner id
    const res = await User.findOne({ uid });
    const email = res?.email;
    tipAmount = isNaN(Number(tipAmount)) ? 0 : Number(tipAmount);


    if(paymentIntentId){
          // Log the sign-up activity

          const signUpActivity = new CustomerActivity({
            user: user._id,
            activityType: 'transaction',
            ip: req.headers.get('x-forwarded-for') || req.socket.remoteAddress,
          });
          await signUpActivity.save();

          const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

          // Retrieve the chargeId from the paymentIntent
           charge_id = paymentIntent.latest_charge;
  
           if (scheduled_time && scheduled_date) {
            const dateTimeString = `${scheduled_date} ${scheduled_time}`;
            // Create a Date object from the combined string
            transfer_time = new Date(dateTimeString);
          }

          if (paymentIntentId && stripeAccountId && stripeAccountId !== 'undefined') {
            if (scheduled_time && scheduled_date) {
              is_paid = 0;
              transfer_type = "directly";
              notify_to = email;
            }else{
              const tipAmountCents = Math.round((tipAmount ) * 100); // Convert to the smallest currency unit
      
              const transfer = await stripeClient.transfers.create({
                amount: tipAmountCents, // Transfer the full amount of the charge
                currency: paymentIntent.currency, // Use the currency from the charge
                destination: stripeAccountId, // Destination is the connected account ID
                source_transaction: charge_id, // The charge ID is used as the source
              // transfer_group: `ORDER_${uniqueId}`, // Optional transfer group identifier
              });
                // Update the page name
              is_paid = 1;
            }
        }else if(emailRegex.test(comment_to) || phoneRegex.test(comment_to)) {
          notify_to = comment_to;
          // as use phone or email to send new user
          if (scheduled_time && scheduled_date) {
            transfer_type ="notification";
          }
          
        }
    }

    
    let commentObj = {
      username,
      comment,
      comment_by: user._id,
      image: imageUrl,
      page_name,
      charge_id,
      tipAmount,
      comment_to,
      uniqueId,
      is_paid,
      transfer_time,
      transfer_type,
      notify_to
    };
    
    if (user?._id) {
      commentObj = { ...commentObj, comment_by: user._id };
    }
    
    const newComment = new Comments(commentObj);
    await newComment.save();
    

    if (Number(tipAmount) > 0) {

      // Sending email to service provider

      // this executes if there is donations

      if (email && stripeAccountId) {
  
        notify_to = email;
        const serviceProviderTemplateModel = {
          page_owner_name: `${res.first_name} ${res.last_name}`,
          customer_name: username,
          transaction_date: newComment.createdAt,
          tip_amount: tipAmount,
          logo_link: `${process.env.NEXT_BUSENESS_URL}new-logo.png`,
          page_link: `${process.env.NEXT_BUSENESS_URL}${page_name}`,
          image_link: imageUrl,
          comment: comment,
        };

        await postmarkClient.sendEmailWithTemplate({
          From: "admin@loved.com",
          To: email,
          TemplateId: 36283661, // Your template ID
          TemplateModel: serviceProviderTemplateModel,
        }).catch(console.log);
      } else {

        notify_to = comment_to;
        if (emailRegex.test(comment_to)) {
          const customTemplateModel = {
            page_owner_name: "",
            customer_name: username,
            amountDonate: true,
            transaction_date: newComment.createdAt,
            tip_amount: Number(tipAmount).toFixed(2),
            logo_link: `${process.env.NEXT_BUSENESS_URL}new-logo.png`,
            page_link: `${process.env.NEXT_BUSENESS_URL}/login?verify=${uniqueId}`,
            image_link: imageUrl,
            comment: comment,
          };

          await postmarkClient.sendEmailWithTemplate({
            From: "admin@loved.com",
            To: comment_to,
            TemplateId: 36908249, // Your template ID
            TemplateModel: customTemplateModel,
          }).catch(console.log);
        } else if (phoneRegex.test(comment_to)) {
        
          const decodedURL = decodeURIComponent(`${process.env.NEXT_BUSENESS_URL}/login?verify=${uniqueId}`);
          const messageBody = `You have received love from ${username}. ${decodedURL}`;
          
          await twilioClient.messages.create({
            body: messageBody,
            from: process.env.TWILIO_PHONE_NUMBER, // Replace with your Twilio number
            to: comment_to,
          });
        }
      }

      const totalAmount = Number(tipAmount) + Number(application_fee);

      const clientTemplateModel = {
        name: username,
        page_name: page_name,
        date: newComment.createdAt,
        description: comment,
        amount: Number(tipAmount).toFixed(2),
        logo_link: `${process.env.NEXT_BUSENESS_URL}new-logo.png`,
        page_link: `${process.env.NEXT_BUSENESS_URL}${page_name}`,
        tipAmount: Number(application_fee).toFixed(2),
        image_link: imageUrl,
        total: totalAmount.toFixed(2),
      };

      await postmarkClient.sendEmailWithTemplate({
        From: "admin@loved.com",
        To: clientEmail,
        TemplateId: 36341904, // Your template ID
        TemplateModel: clientTemplateModel,
      }).catch(console.log);
    }else{

      // this executes if there is no donations! Just comment to a specific user
      if (emailRegex.test(comment_to)) {
        const customTemplateModel = {
          page_owner_name: "",
          customer_name: username,
          amountDonate: false,
          transaction_date: newComment.createdAt,
          tip_amount: Number(tipAmount).toFixed(2),
          logo_link: `${process.env.NEXT_BUSENESS_URL}new-logo.png`,
          page_link: `${process.env.NEXT_BUSENESS_URL}/login?verify=${uniqueId}`,
          image_link: imageUrl,
          comment: comment,
        };

        await postmarkClient.sendEmailWithTemplate({
          From: "admin@loved.com",
          To: comment_to,
          TemplateId: 36908249, // Your template ID
          TemplateModel: customTemplateModel,
        }).catch(console.log);
      } else if (phoneRegex.test(comment_to)) {
      
        const decodedURL = decodeURIComponent(`${process.env.NEXT_BUSENESS_URL}/login?verify=${uniqueId}`);
        const messageBody = `You have received love from ${username}. ${decodedURL}`;
        
        await twilioClient.messages.create({
          body: messageBody,
          from: process.env.TWILIO_PHONE_NUMBER, // Replace with your Twilio number
          to: comment_to,
        });
      }

    }

    return Response.json({
      data: newComment,
      message: "Comment created successfully",
    });
  } catch (error) {
    console.error("Error:", error);
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
