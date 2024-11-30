<template>
    <div class="dashboard">
        <div class="nav">
            
        </div>
      <div class="top-section">
        <div class="chart-container">
          <h3>Bus</h3>
          <PieChart :chart-data="busChartData" :chart-options="chartOptions" :width="200" :height="200" />
        </div>
        <div class="chart-container">
          <h3>Driver</h3>
          <PieChart :chart-data="driverChartData" :chart-options="chartOptions" :width="200" :height="200" />
        </div>
    
        <!-- Overall Fleet Performance Chart -->
        <div class="chart-container">
          <h3>Overall Fleet Performance</h3>
          <PieChart :chart-data="fleetChartData" :chart-options="chartOptions" :width="200" :height="200" />
        </div>
    
        <!-- Fleet and Driver Summary inside a Single Card -->
        <div class="details-container">
          <div class="card">
            
            <!-- Bus Details Section -->
            <div class="section">
              <h5>Bus Details</h5>
              <p>Running: 30</p>
              <p>Not in Service: 10</p>
              <p>In Depot: 15</p>
            </div>
            
            <!-- Driver Details Section -->
            <div class="section">
              <h5>Driver Details</h5>
              <p>On Leave: 5</p>
              <p>On Break: 10</p>
              <p>Active: 25</p>
            </div>
  
          </div>
        </div>
      </div>
    
      <!-- Bottom Section for Other Content -->
      <div class="bottom-section">
        <!-- Add any other content or charts here -->
      </div>
    </div>
  </template>
  
  
  <script>
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default {
  name: "Businfo",
  components: {
    PieChart: Doughnut,
  },
  data() {
    return {
      // Data for Bus Doughnut Chart
      busChartData: {
        labels: ["Running", "Not in Service", "In Depot"],
        datasets: [
          {
            data: [30, 10, 15],
            backgroundColor: ["#4caf50", "#f44336", "#2196f3"], // Custom colors
            borderColor: ["#388e3c", "#c62828", "#1976d2"], // Border colors
            borderWidth: 2,
            hoverBackgroundColor: ["#66bb6a", "#e57373", "#42a5f5"], // Hover colors
          },
        ],
      },

      // Data for Driver Doughnut Chart
      driverChartData: {
        labels: ["On Leave", "On Break", "Active"],
        datasets: [
          {
            data: [5, 10, 25],
            backgroundColor: ["#ff9800", "#673ab7", "#03a9f4"], // Custom colors
            borderColor: ["#f57c00", "#512da8", "#0288d1"], // Border colors
            borderWidth: 2,
            hoverBackgroundColor: ["#ffb74d", "#7e57c2", "#4fc3f7"], // Hover colors
          },
        ],
      },

      // Data for Fleet Doughnut Chart
      fleetChartData: {
        labels: ["Operational", "Inactive", "In Maintenance"],
        datasets: [
          {
            data: [30, 10, 15],
            backgroundColor: ["#4caf50", "#f44336", "#ffeb3b"], // Custom colors for fleet
            borderColor: ["#388e3c", "#c62828", "#fbc02d"], // Border colors
            borderWidth: 2,
            hoverBackgroundColor: ["#66bb6a", "#e57373", "#fff176"], // Hover colors
          },
        ],
      },

      // Chart options
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const label = tooltipItem.label || "";
                const value = tooltipItem.raw || 0;
                return `${label}: ${value}`;
              },
            },
          },
        },
        cutout: "50%", // Creates the hole in the middle for doughnut chart
        legend: {
          display: false, // Remove legend from the chart
        },
      },
    };
  },
};
</script>

  
<style scoped>
.dashboard {
  background: #3e3e3e;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
  overflow: scroll;
  scrollbar-width : none;
  -ms-overflow-width: none;
}

.nav{
    height: 50px;
    background:black;
}

.top-section {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 30px;
  flex-grow: 1;
  overflow: auto; /* Allow overflow for smaller screens */
  flex-wrap: wrap; /* Ensure the content wraps on smaller screens */
}

.chart-container {
  color: black;
  text-align: center;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  width: 280px;
  height: 300px;
 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

.chart-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.details-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #ffffff;
  padding-left: 20px;
}

.card {
    display: flex;
    justify-content: space-around;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.card h4 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
}

.section {
  margin-bottom: 20px;
}

.section h5 {
  font-size: 1.3rem;
  margin-bottom: 8px;
  color: #333;
}

.section p {
  margin: 5px 0;
  font-size: 1rem;
  color: #555;
}

.bottom-section {
  background: #212121;
  margin-top: 20px;
  padding: 20px;
  color: #ffffff;

}

h3, h4, h5 {
  color: #333;
}

h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

@media screen and (max-width: 1200px) {
  .top-section {
    flex-direction: column;
    padding: 15px;
  }

  .chart-container {
    width: 100%;
    max-width: 350px;
    margin-bottom: 20px;
  }

  .details-container {
    padding-left: 0;
  }
}

@media screen and (max-width: 768px) {
  .top-section {
    gap: 15px;
    flex-direction: column;
  }

  .chart-container {
    width: 100%;
    max-width: 100%;
  }

  .details-container {
    padding-left: 0;
    flex-direction: column;
  }
}

</style>
