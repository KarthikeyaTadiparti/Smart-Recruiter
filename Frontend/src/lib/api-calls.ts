import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Helper behavior (consistent across all functions):
 * - On success: returns the full Axios response object.
 * - If server replied with non-2xx: returns err.response (so caller can inspect status/data).
 * - If no server response (network, CORS, timeout): shows toast and returns null.
 * - 401/403: navigate('/login') and toast "Please Login Again".
 * - 422: returned as err.response so caller can read validation errors (response.data).
 */

export async function Post(url: string, data: object, navigate: any) {
    try {
        const response = await axios({ method: 'POST', url: apiUrl + url, data, withCredentials: true });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError;
            if (err.response) {
                const status = err.response.status;
                if (status === 401 || status === 403) {
                    navigate('/login');
                    toast.error("Please Login Again");
                } else if (status === 422) {
                    return err.response;
                } else {
                    toast.error("Please Try Again");
                }
                return err.response;
            } else {
                toast.error("Please Check Your Network");
                return null;
            }
        } else {
            // Non-axios error (rare)
            toast.error("An unexpected error occurred");
            return null;
        }
    }
};

export async function Get(url: string, id: string, navigate: any) {
    try {
        const response = await axios({ method: 'GET', url: apiUrl + url + id, withCredentials: true });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError;
            if (err.response) {
                const status = err.response.status;
                if (status === 401 || status === 403) {
                    navigate('/login');
                    toast.error("Please Login Again");
                } else if (status === 422) {
                    return err.response;
                } else {
                    toast.error("Please Try Again");
                }
                return err.response;
            } else {
                toast.error("Please Check Your Network");
                return null;
            }
        } else {
            toast.error("An unexpected error occurred");
            return null;
        }
    }
};

export async function GetAll(url: string, navigate: any) {
    try {
        const response = await axios({ method: 'GET', url: apiUrl + url, withCredentials: true });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError;
            if (err.response) {
                const status = err.response.status;
                if (status === 401 || status === 403) {
                    navigate('/login');
                    toast.error("Please Login Again");
                } else if (status === 422) {
                    return err.response;
                } else {
                    toast.error("Please Try Again");
                }
                return err.response;
            } else {
                toast.error("Please Check Your Network");
                return null;
            }
        } else {
            toast.error("An unexpected error occurred");
            return null;
        }
    }
};

export async function Put(url: string, id: string, data: object, navigate: any) {
    try {
        const response = await axios({ method: 'PUT', url: apiUrl + url + id, data, withCredentials: true });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError;
            if (err.response) {
                const status = err.response.status;
                if (status === 401 || status === 403) {
                    navigate('/login');
                    toast.error("Please Login Again");
                } else if (status === 422) {
                    return err.response;
                } else {
                    toast.error("Please Try Again");
                }
                return err.response;
            } else {
                toast.error("Please Check Your Network");
                return null;
            }
        } else {
            toast.error("An unexpected error occurred");
            return null;
        }
    }
};

export async function Patch(url: string, id: string, data: object, navigate: any) {
    try {
        console.log("id in patch:",id);
        const response = await axios({ method: 'PATCH', url: apiUrl + url + id, data, withCredentials: true });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError;
            if (err.response) {
                const status = err.response.status;
                if (status === 401 || status === 403) {
                    navigate('/login');
                    toast.error("Please Login Again");
                } else if (status === 422) {
                    return err.response;
                } else {
                    toast.error("Please Try Again");
                }
                return err.response;
            } else {
                toast.error("Please Check Your Network");
                return null;
            }
        } else {
            toast.error("An unexpected error occurred");
            return null;
        }
    }
};

export async function Delete(url: string, id: string, navigate: any) {
    try {
        const response = await axios({ method: 'DELETE', url: apiUrl + url + id, withCredentials: true });
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const err = error as AxiosError;
            if (err.response) {
                const status = err.response.status;
                if (status === 401 || status === 403) {
                    navigate('/login');
                    toast.error("Please Login Again");
                } else if (status === 422) {
                    return err.response;
                } else {
                    toast.error("Please Try Again");
                }
                return err.response;
            } else {
                toast.error("Please Check Your Network");
                return null;
            }
        } else {
            toast.error("An unexpected error occurred");
            return null;
        }
    }
};
