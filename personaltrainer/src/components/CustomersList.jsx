import { useState, useEffect } from "react";
import { fetchCustomers, deleteCustomer } from "../../customerapi";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import AddCustomer from './AddCustomer.jsx';
import EditCustomer from "./EditCustomer.jsx";
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';

function CustomersList(){
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [colDefs, setColDefs] = useState([
        { field: "firstname", filter: true, width: 130 },
        { field: "lastname", filter: true, width: 130 },
        { field: "streetaddress", filter: true },
        { field: "postcode", filter: true, width: 120 },
        { field: "city", filter: true, width: 110 },
        { field: "email", filter: true },
        { field: "phone", filter: true, width: 140 },
        {
            cellRenderer: params => <EditCustomer handleFetch={handleFetch} data={params.data} onEdit={() => handleSnackbarMessage("Customer successfully edited!")}/>,
                width: 120
        },
        { 
            cellRenderer: params => <Button color="error" size="small" onClick={() => handleDelete(params.data._links.self.href)} endIcon={<DeleteIcon />}>Delete</Button>,
            width: 140 
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

    const handleDelete = (url) => {
        if (window.confirm("Are you sure?")){
            deleteCustomer(url)
            .then(() => {
                handleFetch();
                handleSnackbarMessage("Customer successfully deleted!");
            })
            .catch(err => console.error(err))
        }
    }

    const handleSnackbarMessage = (message) => {
        setSnackbarMessage(message);
        setOpen(true);
    }
    
    return(
        <>
            <AddCustomer 
                handleFetch={handleFetch}
                onAdd={() => handleSnackbarMessage("Customer successfully added!")}
            />
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
                message={
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckIcon style={{ marginRight: 8 }} />
                        {snackbarMessage}
                    </span>
                }
                ContentProps={{
                    style: { color: "lightgreen", fontWeight: "bold" }
                }}
            />
        </>
    )
}

export default CustomersList;