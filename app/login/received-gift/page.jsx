'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { toast } from "@/components/ui/use-toast";
import useApiCaller from "@/hooks/useApiCaller";
import { Loader2 } from "lucide-react";


const OtpHeader = dynamic(() => import("@/components/loved-box/otpHeader"), {
  ssr: false,
});


export default function LovedGift() {
  const [pageLink, setPageLink] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [tipAmount, setTipAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [verifyValue, setVerifyValue] = useState(null);
  const apiCaller = useApiCaller();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedVerifyValue = localStorage.getItem('verifyValue');
      setVerifyValue(storedVerifyValue);
    }
  }, []);

  useEffect(() => {
    if (verifyValue) {
      axios
        .get(`/login/received-gift/api?unique_id=${verifyValue}`)
        .then((res) => {
          const { comment } = res.data;
          console.log(comment);
          if (comment) {
            setCustomerName(comment.username);
            setTipAmount(comment.tipAmount);
            setTransactionDate(new Date(comment.createdAt).toLocaleDateString());
            setPageLink(comment.page_name || '/default-link');
          } else {
            console.error('No comment found');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [verifyValue]);

  const handleAcceptGift = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("uniqueId", verifyValue);
      const response =  await apiCaller.post(`/login/received-gift/confirm`, formData);

      if(response.status === 200){
        setIsLoading(false);
        toast({
          variant: "success",
          title: response.data.message,
        });
        window.location.href = response.data.url;
      } else {
        toast({
          variant: "error",
          title: response.data.message,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setIsLoading(false);
      toast({
        variant: "error",
        title: errorMessage,
      });
      // console.error('Error accepting gift:', error);
    }
  };
  
  return (
    <Suspense>
      <OtpHeader pageLink={pageLink} />
      <div>
        <div style={{
          maxWidth: '600px',
          margin: '40px auto',
          backgroundColor: '#2E266F',
          color: "#fff",
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          position: 'relative'
        }}>
          <div style={{
            textAlign: 'center',
            paddingTop: '60px'
          }}>
            <h1 style={{ fontSize: '28px', color: '#FFFFFF', margin: '10px 20px' }}>
              You’ve received love from {customerName}
            </h1>
            <p style={{ fontSize: '16px', color: '#FFFFFF', margin: '10px 20px' }}>
              Hey!
            </p>
            {tipAmount > 0 && (
              <p style={{ fontSize: '16px', color: '#FFFFFF', margin: '10px 20px' }}>
                ${tipAmount} Received
              </p>
            )}
            <p style={{ fontSize: '16px', color: '#FFFFFF', margin: '10px 20px' }}>
              By {customerName} at {transactionDate}
            </p>
            <br />
            <button
              onClick={handleAcceptGift}
              style={{
                display: 'inline-block',
                padding: '10px 60px',
                fontSize: '18px',
                color: '#ffffff',
                backgroundColor: '#f40294',
                textDecoration: 'none',
                borderRadius: '30px',
                marginTop: '20px',
                marginBottom: '20px',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              {isLoading && <Loader2 className="mr-2 size-6 animate-spin" />}
              Continue to Accept Loved Gift
            </button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
