import countrys from '@/public/countrys.json';
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

export const useGetCountryByCountryCode = () => {
    const [country, setCountry] = useState(null)
    const [isLoading, seIsLoading] = useState(false)
    useEffect(() => {
        seIsLoading(true)
        const country_code = typeof window !== "undefined" && window.localStorage.getItem('country_code')
        let findcountry = countrys.find(i => i.country_code === country_code)
        if (findcountry) {
            findcountry = { ...findcountry, icon: `https:${findcountry.icon}` }
            setCountry(findcountry)
        }
        seIsLoading(false)

    }, [])
    return { country, isLoading }
}