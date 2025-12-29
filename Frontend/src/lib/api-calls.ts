import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

const apiUrl = import.meta.env.VITE_API_URL;

/**
 * API Helper Behavior Contract
 * -----------------------------
 * All HTTP helper functions (Get, GetAll, Post, Put, Patch, Delete)
 * follow the same predictable behavior described below.
 *
 * 1. Successful response (2xx)
 *    - Axios resolves the request.
 *    - The helper returns the FULL AxiosResponse object.
 *    - Caller can safely access:
 *        response.status
 *        response.data
 *        response.headers
 *
 * 2. Server responded with an error (non-2xx)
 *    - Axios throws and control moves to `catch`.
 *    - If `error.response` exists, the request reached the server.
 *    - The helper RETURNS `error.response` instead of throwing.
 *    - This allows the caller to inspect status and data without crashing the app.
 *
 * 3. Authentication / Authorization errors (401 / 403)
 *    - Indicates expired session, invalid token, or insufficient permission.
 *    - Helper:
 *        - Shows toast: "Please Login Again"
 *        - Redirects user to `/login`
 *    - Still returns `error.response` for consistency.
 *
 * 4. Validation errors (422)
 *    - Used for form / input validation failures.
 *    - Helper DOES NOT handle these errors.
 *    - Simply returns `error.response` so the caller can read:
 *        response.data.errors
 *    - This keeps validation handling inside UI components.
 *
 * 5. Other server errors (400, 404, 500, etc.)
 *    - Helper displays the backend-provided error message if available.
 *    - Returns `error.response` so the caller can inspect it if needed.
 *
 * 6. Network / CORS / timeout errors (no server response)
 *    - `error.response` is undefined.
 *    - Request never reached the server.
 *    - Helper:
 *        - Shows toast: "Please check your network connection"
 *        - Returns null
 *
 * Return Value Summary
 * --------------------
 * - AxiosResponse → request reached server (success OR failure)
 * - null          → request failed before reaching server
 */


export async function Post(url: string, data: object, navigate: any) {
    try {
        const response = await axios({ method: 'POST', url: apiUrl + url, data, withCredentials: true });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError<any>;

            if (err.response) {
                const status = err.response.status;
                const message =
                    err.response.data?.message || "Something went wrong";

                if (status === 401) {
                    toast.error(message || "Please login again");
                    navigate("/login");
                }
                else if (status === 422 || status === 400) {
                    toast.error(message);
                }
                else {
                    toast.error(message);
                }

                return err.response;
            } else {
                toast.error("Please check your network connection");
                return null;
            }
        } else {
            toast.error("An unexpected error occurred");
            return null;
        }
    }
}

export async function Get(url: string, id: string, navigate: any) {
    try {
        const response = await axios.get(apiUrl + url + id, { withCredentials: true, });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError<any>;

            if (err.response) {
                const status = err.response.status;
                const message =
                    err.response.data?.message || "Something went wrong";

                if (status === 401 || status === 403) {
                    toast.error(message || "Please login again");
                    navigate("/login");
                } else if (status === 400 || status === 422) {
                    toast.error(message);
                } else {
                    toast.error(message);
                }

                return err.response;
            } else {
                toast.error("Please check your network connection");
                return null;
            }
        } else {
            toast.error("An unexpected error occurred");
            return null;
        }
    }
}

export async function GetAll(url: string, navigate: any) {
    try {
        const response = await axios.get(apiUrl + url, { withCredentials: true, });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError<any>;

            if (err.response) {
                const status = err.response.status;
                const message =
                    err.response.data?.message || "Something went wrong";

                if (status === 401 || status === 403) {
                    toast.error(message || "Please login again");
                    navigate("/login");
                } else if (status === 400 || status === 422) {
                    toast.error(message);
                } else {
                    toast.error(message);
                }

                return err.response;
            } else {
                toast.error("Please check your network connection");
                return null;
            }
        } else {
            toast.error("An unexpected error occurred");
            return null;
        }
    }
}

export async function Put(
    url: string,
    id: string,
    data: object,
    navigate: any
) {
    try {
        const response = await axios.put(apiUrl + url + id, data, { withCredentials: true, });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError<any>;

            if (err.response) {
                const status = err.response.status;
                const message =
                    err.response.data?.message || "Something went wrong";

                if (status === 401 || status === 403) {
                    toast.error(message || "Please login again");
                    navigate("/login");
                } else if (status === 400 || status === 422) {
                    toast.error(message);
                } else {
                    toast.error(message);
                }

                return err.response;
            } else {
                toast.error("Please check your network connection");
                return null;
            }
        } else {
            toast.error("An unexpected error occurred");
            return null;
        }
    }
}

export async function Patch(
    url: string,
    id: string,
    data: object,
    navigate: any
) {
    try {
        const response = await axios.patch(apiUrl + url + id, data, { withCredentials: true, });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError<any>;

            if (err.response) {
                const status = err.response.status;
                const message =
                    err.response.data?.message || "Something went wrong";

                if (status === 401 || status === 403) {
                    toast.error(message || "Please login again");
                    navigate("/login");
                } else if (status === 400 || status === 422) {
                    toast.error(message);
                } else {
                    toast.error(message);
                }

                return err.response;
            } else {
                toast.error("Please check your network connection");
                return null;
            }
        } else {
            toast.error("An unexpected error occurred");
            return null;
        }
    }
}

export async function Delete(
    url: string,
    id: string,
    navigate: any
) {
    try {
        const response = await axios.delete(apiUrl + url + id, { withCredentials: true, });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError<any>;

            if (err.response) {
                const status = err.response.status;
                const message =
                    err.response.data?.message || "Something went wrong";

                if (status === 401 || status === 403) {
                    toast.error(message || "Please login again");
                    navigate("/login");
                } else if (status === 400 || status === 422) {
                    toast.error(message);
                } else {
                    toast.error(message);
                }

                return err.response;
            } else {
                toast.error("Please check your network connection");
                return null;
            }
        } else {
            toast.error("An unexpected error occurred");
            return null;
        }
    }
}
