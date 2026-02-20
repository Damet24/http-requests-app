import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(value) {
    if (!value) {
        return ""; // Handles empty strings safely
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
}