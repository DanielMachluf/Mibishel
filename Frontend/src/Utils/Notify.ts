import { Notyf } from "notyf"; // npm i notyf

class Notify {

    private notyf = new Notyf({
        position: { x: "center", y: "top" },
        duration: 3000,
        dismissible: true,
        ripple: true // Ripple = אדווה = גל קטן
    });

    public success(message: string): void {
        this.notyf.success(message);
    }

    public error(err: unknown): void {
        const message = this.extractErrorMessage(err);
        this.notyf.error(message);
    }

    private extractErrorMessage(err: unknown): string {
        if(typeof err === "string") return err; // String error.

        if (typeof err === "object" && err !== null) {
            const maybeAxiosError = err as { response?: { data?: unknown }, message?: unknown };
            if(typeof maybeAxiosError.response?.data === "string") return maybeAxiosError.response.data; // Axios error

            const data = maybeAxiosError.response?.data;
            if (typeof data === "object" && data !== null) {
                const message = (data as { message?: unknown }).message;
                if(typeof message === "string") return message;
            }

            if(typeof maybeAxiosError.message === "string") return maybeAxiosError.message; // throw new Error("...")
        }

        return "Some error, please try again.";
    }

}

export const notify = new Notify();
