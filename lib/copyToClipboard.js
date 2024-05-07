import { toast } from "@/components/ui/use-toast";

export default function copyToClipboard(text) {
  // Check if the browser supports the Clipboard API
  if (!navigator.clipboard) {
    console.error("Clipboard API not supported");
    return;
  }

  // Copy text to clipboard
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast({
        variant: "success",
        title: 'Link copied to clipboard',
      })
    
    })
    .catch((error) => {
      console.error("Error copying text to clipboard:", error);
    });
}
