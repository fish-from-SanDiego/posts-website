export async function fetchJsonData(url) {
    const request = new Request(url, {
        method: 'GET'
    });
    const response = await fetch(request);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    return await response.json();
}