import { useState, useEffect } from "react";
import { fetchCustomers } from "../../customerapi";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import AddCustomer from './AddCustomer.jsx';
import EditCustomer from "./EditCustomer.jsx";

function CustomersList(){
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);

    const [colDefs, setColDefs] = useState([
        { field: "firstname", filter: true, width: 130 },
        { field: "lastname", filter: true, width: 130 },
        { field: "streetaddress", filter: true },
        { field: "postcode", filter: true, width: 120 },
        { field: "city", filter: true, width: 110 },
        { field: "email", filter: true },
        { field: "phone", filter: true, width: 140 },
        {
            cellRenderer: params => <EditCustomer handleFetch={handleFetch} data={params.data} />,
            width: 120
        },
        { 
            cellRenderer: params => <Button color="error" size="small"  >Delete</Button>,
            width: 120 
        }
    ]);
    
    useEffect(() => {
        handleFetch();
    }, []);

    const handleFetch = () => {
        fetchCustomers()
        .then(data => setCustomers(data._embedded.customers))
        .catch(err => console.error(err))
    }
    
    return(
        <>
            <AddCustomer handleFetch={handleFetch} />
            <div className="ag-theme-material" style={{ height: 500}}>
                <AgGridReact 
                rowData={customers}
                columnDefs={colDefs}
                pagination={true}
                paginationAutoPageSize={true}
                suppressCellFocus={true}
                />
            </div>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                message="Xx"
            />
        </>
    )
}

export default CustomersList;