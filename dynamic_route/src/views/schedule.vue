<template>
    <div class="csv-display">
      <h1>CSV File Viewer</h1>
      <button @click="loadCSV">Load CSV</button>
      <table v-if="csvData.length">
        <thead>
          <tr>
            <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in csvData" :key="rowIndex">
            <td v-for="(value, index) in row" :key="index">{{ value }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="!csvData.length">No data loaded. Please load the CSV file.</p>
    </div>
  </template>
  
  <script>
  import Papa from "papaparse";
  
  export default {
    data() {
      return {
        csvData: [], // Parsed CSV data
        headers: [], // CSV headers
      };
    },
    methods: {
      // Load the CSV file
      loadCSV() {
        const filePath = "/final.csv"; // Update with your CSV file's path
        console.log("Fetching CSV from:", filePath);
        
        fetch(filePath)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch the CSV file");
            }
            return response.text();
          })
          .then((csvText) => {
            console.log("CSV content loaded:", csvText);
            
            // Parse the CSV content using PapaParse
            Papa.parse(csvText, {
              complete: this.parseComplete,
              header: true, // Automatically extract headers
              skipEmptyLines: true,
            });
          })
          .catch((error) => {
            console.error("Error loading CSV file:", error);
          });
      },
      
      // Handle the parsed data
      parseComplete(results) {
        console.log("Parsing complete:", results);
        
        // Extract headers and data from the parsed CSV
        this.headers = results.meta.fields; // Extract headers
        this.csvData = results.data; // Extract rows
        
        console.log("Headers:", this.headers);
        console.log("CSV Data:", this.csvData);
      },
    },
  };
  </script>
  
  <style scoped>
  .csv-display {
    text-align: center;
    margin: 20px;
  }
  
  button {
    margin-bottom: 20px;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  
  th {
    background-color: #f4f4f4;
  }
  
  p {
    color: red;
    font-weight: bold;
  }
  </style>
  