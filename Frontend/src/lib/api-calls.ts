import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { apiUrl } from '../config';

export async function Post(url: string, data: object, navigate: any) {
    try {
        const response = await axios({ method: 'POST', url: apiUrl + url, data: data, withCredentials: true })
        return response
    }
    catch (error: any) {
        const err = error
        if (err.response) {
            if (err.response.status < 200 || err.response.status >= 300) {
                if (err.response.status === 403 || err.response.status === 401) {
                    navigate('/login')
                    toast.error(err.response.data.message || "Please Login Again");
                }
                else if (err.response.status === 422) {
                    return null
                }
                else {
                    toast.error(err.response.data.message || "Please Try Again");
                }
            }
        }
        else {
            toast.error("Please Check Your Network")
        }
        return null
    }
};

export async function Get(url: string, id: string, navigate: any) {
    try {
        const response = await axios({ method: 'GET', url: apiUrl + url + id, withCredentials: true })
        return response
    }
    catch (error: any) {
        const err = error as AxiosError
        if (err.response) {
            if (err.response.status < 200 || err.response.status >= 300) {
                if (err.response.status === 403 || err.response.status === 401) {
                    navigate('/login')
                    toast.error("Please Login Again");
                }
                else if (err.response.status === 422) {
                    return null
                }
                else {
                    toast.error("Please Try Again");
                }
            }
        }
        else {
            toast.error("Please Check Your Network")
        }
        return null
    }
};

export async function GetAll(url: string, navigate: any) {

    try {
        const response = await axios({ method: 'GET', url: apiUrl + url, withCredentials: true })
        return response
    }
    catch (error: any) {
        const err = error as AxiosError
        if (err.response) {
            if (err.response.status < 200 || err.response.status >= 300) {
                if (err.response.status === 403 || err.response.status === 401) {
                    navigate('/login')
                    toast.error("Please Login Again");
                }
                else if (err.response.status === 422) {
                    return null
                }
                else {
                    toast.error("Please Try Again");
                }
            }
        }
        else {
            toast.error("Please Check Your Network")
        }
        return null
    }
};

export async function Put(url: string, id: string, data: object, navigate: any) {
    try {
        const response = await axios({ method: 'put', url: apiUrl + url + id, data: data, withCredentials: true })
        return response
    }
    catch (error: any) {
        const err = error as AxiosError
        if (err.response) {
            if (err.response.status < 200 || err.response.status >= 300) {
                if (err.response.status === 403 || err.response.status === 401) {
                    navigate('/login')
                    toast.error("Please Login Again");
                }
                else if (err.response.status === 422) {
                    return null
                }
                else {
                    toast.error("Please Try Again");
                }
            }
        }
        else {
            toast.error("Please Check Your Network")
        }
        return null
    }
};

export async function Delete(url: string, id: string, navigate: any) {

    try {
        const response = await axios({ method: 'delete', url: apiUrl + url + id, withCredentials: true })
        return response
    }
    catch (error: any) {
        const err = error as AxiosError
        if (err.response) {
            if (err.response.status < 200 || err.response.status >= 300) {
                if (err.response.status === 403 || err.response.status === 401) {
                    navigate('/login')
                    toast.error("Please Login Again");
                }
                else if (err.response.status === 422) {
                    return null
                }
                else {
                    toast.error("Please Try Again");
                }
            }
        }
        else {
            toast.error("Please Check Your Network")
        }
        return null
    }
};