const API_BASE = 'https://texhhive.onrender.com/api';

async function apiRequest(path, options = {}) {
    const config = {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    };

    if (options.body !== undefined) {
        config.body = typeof options.body === 'string'
            ? options.body
            : JSON.stringify(options.body);
    }

    const response = await fetch(`${API_BASE}${path}`, config);

    const text = await response.text();

    let data = {};
    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = { message: text };
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            `Request failed with status ${response.status}`
        );
    }

    return data;
}

function apiGet(path) {
    return apiRequest(path);
}

function apiPost(path, body) {
    return apiRequest(path, {
        method: 'POST',
        body: body
    });
}

function apiPut(path, body) {
    return apiRequest(path, {
        method: 'PUT',
        body: body
    });
}

function apiPatch(path, body) {
    return apiRequest(path, {
        method: 'PATCH',
        body: body
    });
}
