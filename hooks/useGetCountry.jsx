import axios from "axios";
import { useEffect, useState } from "react";

export default function useGetCountry() {
    // console.log(countryOptions)
    const [data, setData] = useState()
    const [countryLoading, setDataLoading] = useState(true)
    useEffect(() => {
        // Fetch country code from API
        axios.get('/api/api/country_by_ip')
            .then(response => {
                setData(response.data)
                setDataLoading(false)
            })
            .catch(error => {
                console.error('Error fetching country code:', error);
            });
    }, []);
    return { data, countryLoading }
}

