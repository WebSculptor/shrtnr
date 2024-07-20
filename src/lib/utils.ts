import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
}

export function formatDateString(dateString: string) {
  const date = new Date(dateString);

  const options: any = { month: "short", day: "numeric", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return `${formattedDate} - ${formattedTime}`;
}

export function getInitials(value: string) {
  const nameParts = value.trim().split(" ");

  if (nameParts.length > 2) {
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  }

  const initials = nameParts.map((part) => part.charAt(0).toUpperCase());

  return initials.join("");
}

export function checkAdBlocker() {
  // Create an element to load an ad-related resource
  const adBlockerTestElement = document.createElement("div");
  adBlockerTestElement.innerHTML = "&nbsp;";
  adBlockerTestElement.className = "adsbox";
  adBlockerTestElement.style.position = "absolute";
  adBlockerTestElement.style.top = "-9999px";

  document.body.appendChild(adBlockerTestElement);

  // Check if the element is hidden (which would indicate ad blocking)
  setTimeout(() => {
    if (adBlockerTestElement.offsetHeight === 0) {
      // Ad blocker detected, prompt the user
      alert(
        "We have detected that you are using an ad blocker. Please disable it for a better experience."
      );
    }
    // Remove the test element
    document.body.removeChild(adBlockerTestElement);
  }, 100);
}
