import { useState, useEffect } from "react";
import { fetchTrainings, deleteTraining } from "../../trainingapi";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import AddTraining from "./AddTraining";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import { Card, CardContent, Typography } from '@mui/material';

function TrainingList() {
    const [trainings, setTrainings] = useState([]);
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [colDefs, setColDefs] = useState([
        {
            field: "date", filter: true,
            valueFormatter: (params) => {
                if (!params.value) return "";
                const date = new Date(params.value);
                return new Intl.DateTimeFormat("de-CH", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }).format(date);
            }
        },
        { field: "duration", filter: true },
        { field: "activity", filter: true },
        {
            headerName: "Customer",
            filter: true,
            valueGetter: (params) => {
                return params.data.customerName;
            }
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
        fetchTrainings()
            .then(async (data) => {
                const trainings = data._embedded.trainings;
                const trainingsOfCustomers = await Promise.all(
                    trainings.map(async (training) => {
                        const customerResponse = await fetch(training._links.customer.href);
                        const customerData = await customerResponse.json();
                        return {
                            ...training,
                            customerName: `${customerData.firstname} ${customerData.lastname}`
                        };
                    })
                );

                setTrainings(trainingsOfCustomers);
            })
            .catch(err => console.error("Error fetching trainings:", err));
    };

    const handleDelete = (url) => {
        if (window.confirm("Are you sure?")) {
            deleteTraining(url)
                .then(() => {
                    handleFetch();
                    handleSnackbarMessage("Training successfully deleted!");
                })
                .catch(err => console.error(err))
        }
    }

    const handleSnackbarMessage = (message) => {
        setSnackbarMessage(message);
        setOpen(true);
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>

                <AddTraining
                    handleFetch={handleFetch}
                    onAdd={() => handleSnackbarMessage("Training successfully added!")}
                />
            </div>
            <Card variant="outlined">
                <CardContent>
                    <div className="ag-theme-material" style={{ height: 500 }}>
                        <AgGridReact
                            rowData={trainings}
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

export default TrainingList;