<template>
    <div class="main">
      <nav class="sidenav">
        <ul>
          <li>Real Time Monitoring</li>
          <li>Route Optimization</li>
          <li>Traffic Insights</li>
        </ul>
      </nav>
      <div class="content">
        <!-- Content of the page goes here -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Sidebar',
    methods: {}
  }
  </script>
  
  <style scoped>
  .main {
    display: flex;
  }
  
  .sidenav {
    height: 100vh;
    width: 250px;
    background-color: white;
    color: rgb(63, 63, 63);
    padding-top: 20px;
    position: fixed;
    top: 0;
    left: 0;
    font-style: 'Poppins';
  }
  
  .sidenav ul {
    list-style-type: none;
    padding: 0;
  }
  
  .sidenav li {
    padding: 15px;
    text-align: center;
    border-bottom: 1px solid #444;
  }
  
  .sidenav li:hover {
    background-color: #575757;
    cursor: pointer;
  }
  
  .content {
    margin-left: 250px;
    padding: 20px;
    flex-grow: 1;
  }
  </style>
  