export function fetchCustomers() {
    return fetch(import.meta.env.VITE_CUSTOMERS_API_URL)
    .then(response =>{
        if (!response.ok)
           throw new Error("Error in fetch: " + response.statusText);

        return response.json();
    })
}