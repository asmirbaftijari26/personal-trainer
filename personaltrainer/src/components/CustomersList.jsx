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
import AddTraining from "./AddTraining.jsx";
import { Card, CardContent, Typography } from '@mui/material';


function CustomersList() {
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [colDefs, setColDefs] = useState([
        { field: "firstname", filter: true, width: 130 },
        { field: "lastname", filter: true, width: 130 },
        { field: "streetaddress", filter: true, width: 130 },
        { field: "postcode", filter: true, width: 120 },
        { field: "city", filter: true, width: 110 },
        { field: "email", filter: true },
        { field: "phone", filter: true, width: 140 },
        {
            cellRenderer: params => <EditCustomer handleFetch={handleFetch} data={params.data} onEdit={() => handleSnackbarMessage("Customer successfully edited!")} />,
            width: 120
        },
        {
            cellRenderer: params => <Button color="error" size="small" onClick={() => handleDelete(params.data._links.self.href)} endIcon={<DeleteIcon />}>Delete</Button>,
            width: 140
        },
        {
            cellRenderer: params => <AddTraining handleFetch={handleFetch} key={params.data._links.self.href} customerHref={params.data._links.self.href} onAdd={() => handleSnackbarMessage("Training successfully added!")} />,
            width: 210
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
        if (window.confirm("Are you sure?")) {
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

    const exportToCSV = () => {
        const csvRows = [];
        const headers = ["First Name", "Last Name", "Street Address", "Postcode", "City", "Email", "Phone"];
        csvRows.push(headers.join(","));

        customers.forEach(customer => {
            const row = [
                customer.firstname,
                customer.lastname,
                customer.streetaddress,
                customer.postcode,
                customer.city,
                customer.email,
                customer.phone
            ];
            csvRows.push(row.join(","));
        });

        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "customers.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <AddCustomer
                    handleFetch={handleFetch}
                    onAdd={() => handleSnackbarMessage("Customer successfully added!")}
                />
                <Button variant="contained" color="primary" onClick={exportToCSV}>
                    Export to CSV
                </Button>
            </div>

            <Card variant="outlined">
                <CardContent>
                    <div className="ag-theme-material" style={{ height: 500 }}>
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
                </CardContent>
            </Card>
        </>
    )
}

export default CustomersList;