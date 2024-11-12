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
        { field: "date", filter: true },
        { field: "duration", filter: true },
        { field: "activity", filter: true, width: 130 },
        //{ field: "_links", filter: true, width: 130 },
    ]);
      
    useEffect(() => {
        handleFetch();
    }, []);

    const handleFetch = () => {
        fetchTrainings()
        .then(data => setTrainings(data._embedded.trainings))
        .catch(err => console.error(err))
    }
    
    return(
        <>
          <div className="ag-theme-material" style={{ height: 500, width: 1400}}>
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