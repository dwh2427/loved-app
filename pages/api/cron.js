import Comments from "@/models/Comment";
import stripe from 'stripe'; // Import Stripe
import { ObjectId } from 'mongodb'; // Import ObjectId from mongodb
import { Twilio } from 'twilio';
import { ServerClient } from "postmark";
import connectDB from "@/mongodb.config";
import Loved from "@/models/loved";

connectDB(); // Ensure the database is connected
const stripeClient = new stripe(process.env.NEXT_STRIPE_SECRET_KEY); // Initialize Stripe with your secret key
const postmarkClient = new ServerClient(process.env.POSTMARK_API_KEY);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format (optional "+" followed by 1-15 digits)
const twilioClient = new Twilio(process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID, process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
    try {
        const now = new Date();
        
        // Find all comments where the transfer_time matches the current time (within 10 minutes before and 10 minutes after), is_paid is 0, and transfer_type is either 'directly' or 'notifications'
        const comments = await Comments.find({
          transfer_time: {
            $gte: new Date(now.getTime() - 10 * 60 * 1000), // 10 minutes before now
            $lt: new Date(now.getTime() + 10 * 60 * 1000),  // 10 minutes after now
          },
          is_paid: 0,
          transfer_type: {
            $in: ['directly', 'notification']
          }
        });

        for (const comment of comments) {
          if (comment.transfer_type === 'directly') {
            await handleTransfer(comment);
          } else if (comment.transfer_type === 'notification') {
            await handleNotification(comment);
          }
        }
    
        return res.status(200).json({ message: "Cron job executed successfully" });
    } catch (error) {
        console.error("Error in cron job:", error);
        return res.status(500).json({ message: error.message });
    }
}

async function handleTransfer(comment) {
    try {
        const page = await Loved.findOne({ user: new ObjectId(comment.comment_by), stripe_acc_id: { $ne: null } });
        if (!page) {
            console.error("Page not found or Stripe account ID is missing");
            return;
        }

        const charge = await stripeClient.charges.retrieve(comment.charge_id);
        const tipAmountCents = Math.round(comment.tipAmount * 100);
        const transfer = await stripeClient.transfers.create({
            amount: tipAmountCents,
            currency: charge.currency, // Adjust as necessary
            destination: page.stripe_acc_id,
            source_transaction: comment.charge_id,
        });

        comment.is_paid = 1;
        await comment.save();
    } catch (error) {
        console.error("Error in handleTransfer:", error);
    }
}

async function handleNotification(comment) {
    try {
        if (emailRegex.test(comment.notify_to)) {
            const customTemplateModel = {
                page_owner_name: "",
                customer_name: comment.username,
                amountDonate: true,
                transaction_date: comment.createdAt,
                tip_amount: Number(comment.tipAmount).toFixed(2),
                logo_link: `${process.env.NEXT_BUSINESS_URL}new-logo.png`,
                page_link: `${process.env.NEXT_BUSINESS_URL}/login?verify=${comment.uniqueId}`,
                image_link: comment.image,
                comment: comment.comment,
            };

            await postmarkClient.sendEmailWithTemplate({
                From: "admin@loved.com",
                To: comment.notify_to,
                TemplateId: 36908249,
                TemplateModel: customTemplateModel,
            });
        } else if (phoneRegex.test(comment.notify_to)) {
            const decodedURL = decodeURIComponent(`${process.env.NEXT_BUSINESS_URL}/login?verify=${comment.uniqueId}`);
            const messageBody = `You have received love from ${comment.username}. ${decodedURL}`;

            await twilioClient.messages.create({
                body: messageBody,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: comment.notify_to,
            });
        }
    } catch (error) {
        console.error("Error in handleNotification:", error);
    }
}
