const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pwa-sistema-logistico-backend.onrender.com';

async function parseResponse(res) {
    const text = await res.text();
    try {
        return text ? JSON.parse(text) : null;
    } catch {
        return text;
    }
}

export async function apiPost(path, body = {}, opts = {}) {
    const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(opts.headers || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, {
        method: opts.method || 'POST',
        headers,
        body: JSON.stringify(body),
        credentials: opts.credentials || 'include',
    });

    const data = await parseResponse(response);
    if (!response.ok) {
        const err = new Error((data && data.message) || `Request failed with status ${response.status}`);
        err.status = response.status;
        err.response = data;
        throw err;
    }
    return data;
}

export async function apiGet(path, opts = {}) {
    const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(opts.headers || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: opts.credentials || 'include',
    });

    const data = await parseResponse(response);
    if (!response.ok) {
        const err = new Error((data && data.message) || `Request failed with status ${response.status}`);
        err.status = response.status;
        err.response = data;
        throw err;
    }
    return data;
}

export async function apiPatch(path, body = {}, opts = {}) {
    const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(opts.headers || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
        credentials: opts.credentials || 'include',
    });

    const data = await parseResponse(response);
    if (!response.ok) {
        const err = new Error((data && data.message) || `Request failed with status ${response.status}`);
        err.status = response.status;
        err.response = data;
        throw err;
    }
    return data;
}

export async function apiDelete(path, opts = {}) {
    const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(opts.headers || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers,
        credentials: opts.credentials || 'include',
    });

    const data = await parseResponse(response);
    if (!response.ok) {
        const err = new Error(
            (data && data.message) || `Request failed with status ${response.status}`
        );
        err.status = response.status;
        err.response = data;
        throw err;
    }
    return data;
}

export async function apiPut(path, body = {}, opts = {}) {
    const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(opts.headers || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
        credentials: opts.credentials || 'include',
    });

    const data = await parseResponse(response);
    if (!response.ok) {
        const err = new Error(
            (data && data.message) || `Request failed with status ${response.status}`
        );
        err.status = response.status;
        err.response = data;
        throw err;
    }
    return data;
}

export default {
    apiGet,
    apiPost,
    apiPatch,
    apiDelete,
    apiPut,
};
