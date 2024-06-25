export const getPaginatedData = (totalDocuments, pageSize, pageNumber) => {
    try {
        let hasToContinue = true;
        // Calculate total pages based on total documents and page size
        const totalPages = Math.ceil(totalDocuments / pageSize);

        // If requested page number is greater than total pages, throw an error
        if (pageNumber > totalPages) {
            hasToContinue = false;
            const emptyResponse = {
                data: [],
                currentPage: pageNumber,
                totalPages
            };
            return {
                hasToContinue,
                emptyResponse,
                totalPages,
                adjustedPageSize: 0,
                currentPage: pageNumber
            };
        }

        // Adjust page size if remaining documents are less than default page size
        const remainingDocuments = totalDocuments - (pageNumber - 1) * pageSize;
        const adjustedPageSize = remainingDocuments < pageSize ? remainingDocuments : pageSize;

        return {
            hasToContinue,
            adjustedPageSize,
            totalPages,
            currentPage: pageNumber
        };
    } catch (error) {
        throw error;
    }
};
