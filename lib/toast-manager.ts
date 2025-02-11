import { toast } from "sonner"

interface makeToastInterface {
    type: "success" | "error" | "loading" | "promise" | "info";
    promise?: Promise<unknown>;
    message: string;
    description?: string;
    closeButton?: boolean;
}

export const makeToast = ({ type, message, promise, ...props }: makeToastInterface) => {
    if (type === "success") {
        toast.success(message, props);
    }
    if (type === "error") {
        toast.error(message, props);
    }
    if (type === "info") {
        toast.info(message, props);
    }
    if (type === "promise" && !!promise) {
        toast.promise(promise, {
            loading: 'Processing...',
            success: message,
            error: 'Error encountered!',
        });
    }
}