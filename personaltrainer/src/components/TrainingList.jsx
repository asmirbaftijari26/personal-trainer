    import { useState, useEffect } from "react";
    import { fetchTrainings } from "../../trainingapi";
    import { AgGridReact } from 'ag-grid-react';
    import "ag-grid-community/styles/ag-grid.css";
    import "ag-grid-community/styles/ag-theme-material.css";
    import Button from "@mui/material/Button";
    import Snackbar from "@mui/material/Snackbar";

    function TrainingList(){
        const [trainings, setTrainings] = useState([]);
        const [open, setOpen] = useState(false);

        const [colDefs, setColDefs] = useState([
            { field: "date", filter: true, 
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
            } },
            { field: "duration", filter: true },
            { field: "activity", filter: true },
            { 
                headerName: "Customer", 
                filter: true,
                valueGetter: (params) => {
                    const firstName = params.data.customer?.firstname || "";
                    const lastName = params.data.customer?.lastname || "";
                    return `${firstName} ${lastName}`;
                }
            }
        ]);
        
        useEffect(() => {
            handleFetch();
        }, []);

        const handleFetch = () => {
            fetchTrainings()
            .then(data => setTrainings(data))
            .catch(err => console.error(err))
        }
        
        return(
            <>
            <div className="ag-theme-material" style={{ height: 500}}>
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
                message="Xx"
            />
            </>
        )
    }

    export default TrainingList;