import { errorResponse } from "@/lib/server-error";
import countrys from "@/public/countrys.json";
import ip2country from "ip2country";
import { headers } from "next/headers";

export async function GET(req) {
  const header = headers();
  //   const c = await detectCountry();
  const ip = (header.get("x-forwarded-for") ?? "103.120.203.195").split(",")[0];
  try {
    const country = ip2country(ip);
    let data = countrys.find((i) => i.country_code === country);
    if (!data) {
      data = countrys.find((i) => (i.country_code = "AU"));
    }
    console.log();
    return Response.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}
