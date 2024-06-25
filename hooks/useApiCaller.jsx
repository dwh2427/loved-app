import { auth } from "@/firebase/config";
import axios from "axios";
import { signOut } from "firebase/auth";

import { useState } from "react";

const useApiCaller = () => {
    const [apiCaller] = useState(() => {
        const instance = axios.create({
            baseURL: "/", // Your API base URL
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Add a request interceptor to set the authorization token
        instance.interceptors.request.use(
            async (config) => {
                const accessToken = localStorage.getItem("accToken");
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add a response interceptor to handle common response logic
        instance.interceptors.response.use(
            (response) => {
                // Custom logic for successful responses
                return response;
            },
            (error) => {
                // Custom logic for handling errors
                const errorResponse = error.response
                if (errorResponse.status === 401) {
                    signOut(auth);
                    sessionStorage.removeItem("user");
                    localStorage.clear();
                    localStorage.removeItem("accToken");
                    localStorage.removeItem("pageId");
                    localStorage.removeItem("pageName");
                    localStorage.removeItem("username");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("email");
                    window.location.replace("/");
                }
                return Promise.reject(error);
            }
        );

        return instance;
    });

    return apiCaller;
};

export default useApiCaller;
