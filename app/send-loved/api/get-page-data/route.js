import { errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username')
  
    try {
      const user = await Loved.findOne({
        username,
        stripe_acc_id: { $ne: null },
      });
  
      return Response.json({ data: user, success: true });
    } catch (error) {
      console.error('Error fetching user:', error);
      return errorResponse(error);
    }
  }
