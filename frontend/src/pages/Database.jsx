import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

const calculateColumnWidth = (rows, field, headerName) => {
  const maxContentWidth = Math.max(
    ...rows.map((row) => (`${row[field]}` || "-").length * 10),
    headerName.length * 10
  );
  return Math.min(maxContentWidth, 300); // Setting a max width for readability
};

function Database() {
  const { LogOut } = useAuth();
  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnAttributes, setColumnAttributes] = useState({});
  const [columnAttributeData, setColumnAttributeData] = useState({});

  const generateColumn = (table_name, table_attributes) => {
    const newColumnAttributes = table_attributes.map((item) => ({
      field: item.column_name,
      headerName: item.column_name,
      align: "center",
      headerAlign: "center",
    }));

    const newColumnAttributesWithID = [
      {
        field: "id",
        headerName: "ID",
        align: "center",
        headerAlign: "center",
      },
      ...newColumnAttributes,
    ];

    const newColumnAttributesWithWidth = newColumnAttributesWithID.map(
      (col) => ({
        ...col,
        width: calculateColumnWidth(
          table_attributes,
          col.field,
          col.headerName
        ),
      })
    );

    setColumnAttributes({
      ...columnAttributes,
      [table_name]: newColumnAttributesWithWidth,
    });
  };

  const getTableData = async (table_name, table_attributes) => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        `http://localhost:8000/api/v1/database/table-data?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem(
          "role"
        )}&table_name=${table_name}`,
        {
          headers,
        }
      );
      console.log(results.data);
      generateColumn(table_name, table_attributes);
      setColumnAttributeData({
        ...columnAttributeData,
        [table_name]: results.data,
      });
    } catch (err) {
      // LogOut();
      console.log("Error -> ", err);
    }
  };

  const getAllTables = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        `http://localhost:8000/api/v1/database/table?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );

      const tablesWithIds = results.data.map((table) => ({
        ...table,
        attributes: table.attributes.map((row, index) => ({
          ...row,
          id: index + 1,
        })),
      }));
      setTables(tablesWithIds);

      if (tablesWithIds.length > 0) {
        const firstTable = tablesWithIds[0];
        const dynamicColumns = [
          {
            field: "id",
            headerName: "ID",
            align: "center",
            headerAlign: "center",
          },
          {
            field: "column_name",
            headerName: "column_name",
            align: "center",
            headerAlign: "center",
            valueGetter: (value, row) => (value === null ? "-" : value),
          },
          {
            field: "data_type",
            headerName: "data_type",
            align: "center",
            headerAlign: "center",
            valueGetter: (value, row) => (value === null ? "-" : value),
          },
          {
            field: "data_type_name",
            headerName: "data_type_name",
            align: "center",
            headerAlign: "center",
            valueGetter: (value, row) => (value === null ? "-" : value),
          },
          {
            field: "character_maximum_length",
            headerName: "character_maximum_length",
            type: "number",
            align: "center",
            headerAlign: "center",
            valueGetter: (value, row) => (value === null ? "-" : value),
          },
          {
            field: "constraint_type",
            headerName: "constraint_type",
            align: "center",
            headerAlign: "center",
            renderCell: (params) => {
              return params.value === "PRIMARY KEY" ? (
                <Chip label={params.value} color="primary" variant="outlined" />
              ) : params.value === "FOREIGN KEY" ? (
                <Chip label={params.value} color="success" variant="outlined" />
              ) : params.value === "UNIQUE" ? (
                <Chip
                  label={params.value}
                  color="secondary"
                  variant="outlined"
                />
              ) : (
                <Chip
                  label={params.value || "-"}
                  color="warning"
                  variant="outlined"
                />
              );
            },
          },
          {
            field: "is_nullable",
            headerName: "is_nullable",
            align: "center",
            headerAlign: "center",
            valueGetter: (value, row) => (value === null ? "-" : value),
          },
          {
            field: "column_default",
            headerName: "column_default",
            align: "center",
            headerAlign: "center",
            valueGetter: (value, row) => (value === null ? "-" : value),
          },
        ].map((col) => ({
          ...col,
          width: calculateColumnWidth(
            firstTable.attributes,
            col.field,
            col.headerName
          ),
        }));
        setColumns(dynamicColumns);
      }
    } catch (err) {
      // LogOut();
      console.log("Error -> ", err);
    }
  };

  useEffect(() => {
    getAllTables();
  }, []);

  return (
    <>
      <Grid container justifyContent="center" alignItems="center" padding={4}>
        <Grid container justifyContent="flex-start" alignItems="center">
          <Typography variant="h3">
            DATABASE ({tables.length} tables)
          </Typography>
        </Grid>
        {tables?.map((table, index) => (
          <Grid
            key={index}
            container
            padding={2}
            justifyContent="center"
            alignItems="center"
            // style={{ backgroundColor: "ghostwhite", borderRadius: "10px" }}
          >
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel1-content-${table.table_name}`}
                id={`panel1-header-${table.table_name}`}
              >
                <h5>{table.table_name}</h5>
              </AccordionSummary>
              <AccordionDetails>
                <Grid
                  container
                  padding={2}
                  justifyContent="center"
                  alignItems="center"
                  style={{
                    backgroundColor: "lavender",
                    borderRadius: "10px",
                  }}
                >
                  {columns.length > 0 && (
                    <DataGrid
                      rows={table.attributes}
                      columns={columns}
                      autoHeight
                      autoPageSize
                      hideFooterPagination
                      disableSelection // Add this line to disable cell selection
                      editable={false} // Add this line to make cells read-only
                    />
                  )}
                </Grid>
                <Accordion
                  onChange={(event, expanded) => {
                    if (expanded) {
                      getTableData(table.table_name, table.attributes);
                      console.log(table.table_name);
                      console.log(
                        "columnAttributes[table.table_name]",
                        columnAttributes
                      );
                      console.log(
                        "columnAttributeData[table.table_name]",
                        columnAttributes
                      );
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header-2"
                  >
                    <h5>DATA</h5>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid
                      container
                      padding={2}
                      justifyContent="center"
                      alignItems="center"
                      style={{
                        backgroundColor: "lavender",
                        borderRadius: "10px",
                        width: "190vh",
                      }}
                    >
                      <Paper style={{ overflow: "scroll" }}>
                        {columnAttributes[table.table_name] &&
                          columnAttributeData[table.table_name] && (
                            <DataGrid
                              columns={columnAttributes[table.table_name]}
                              rows={columnAttributeData[table.table_name]}
                              autoHeight
                              pageSize={3}
                              editable={false}
                              autoPageSize
                            />
                          )}
                      </Paper>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Database;
