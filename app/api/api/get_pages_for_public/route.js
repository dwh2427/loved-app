import { getPaginatedData } from "@/lib/getPaginatedData";
import { errorResponse } from "@/lib/server-error";
import Loved from "@/models/loved";
import connectDB from "@/mongodb.config";
// Connect to MongoDB
connectDB();

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const pageNumber = parseInt(searchParams.get("pageNumber"), 10) || 1;
  const pageSize = parseInt(searchParams.get("pageSize"), 10) || 6;
  const searchText = searchParams.get("searchText");

  try {
    let aggregationPipeline;

    if (searchText) {
      aggregationPipeline = [
        {
          $addFields: {
            fullName: { $concat: ["$first_name", " ", "$last_name"] },
          },
        },
        {
          $match: {
            stripe_acc_id: { $ne: null },
            fullName: { $regex: searchText, $options: "i" },
          },
        },
        {
          $sort: {
            createdAt: -1, // Sort by 'createdAt' in descending order
          },
        },
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            paginatedResults: [
              { $skip: (pageNumber - 1) * pageSize },
              { $limit: pageSize },
            ],
          },
        },
      ];
    } else {
      aggregationPipeline = [
        {
          $match: {
            stripe_acc_id: { $ne: null },
          },
        },
        {
          $sort: {
            createdAt: -1, // Sort by 'createdAt' in descending order
          },
        },
        {
          $facet: {
            totalCount: [{ $count: "count" }],
            paginatedResults: [
              { $skip: (pageNumber - 1) * pageSize },
              { $limit: pageSize },
            ],
          },
        },
      ];
    }

    const [results] = await Loved.aggregate(aggregationPipeline);
    const totalDocuments = results.totalCount[0]
      ? results.totalCount[0].count
      : 0;
    console.log(totalDocuments);
    const {
      adjustedPageSize,
      hasToContinue,
      emptyResponse,
      totalPages,
      currentPage,
    } = getPaginatedData(totalDocuments, pageSize, pageNumber);

    if (!hasToContinue) {
      return Response.json(emptyResponse);
    }

    return Response.json({
      data: results.paginatedResults,
      currentPage,
      totalPages,
    });
  } catch (error) {
    if (error.raw) {
      error = error.raw;
    }
    return errorResponse(error);
  }
}
