import { toast } from "@/components/ui/use-toast";

export default function copyToClipboardDynamic(shareUrl) {
  // Check if the browser supports the Clipboard API
  if (!navigator.clipboard) {
    console.error("Clipboard API not supported");
    return;
  }

  // Copy text to clipboard
  navigator.clipboard
    .writeText(shareUrl)
    .then(() => {
      toast({
        variant: "success",
        title: 'Link copied',
        description: shareUrl,
      });
    })
    .catch((error) => {
      console.error("Error copying text to clipboard:", error);
    });
}
