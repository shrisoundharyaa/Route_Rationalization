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
    height: 670px;
    border-radius: 10px;
    width: 250px;
    background-color: rgb(233, 233, 233);
    color: rgb(63, 63, 63);
    padding-top: 20px;
    position: fixed;
    display: flex;
    flex-direction: column;
    top:20px;
    left:20px;
    box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.319);
    transition: width 0.3s ease; 
    
  }
  
  .sidenav ul {
    list-style-type: none;
    padding: 0;
  }
  .sidenav ul li:hover{
    background-color: #acacac;
    border-radius: 10px;
  }
  
  .sidenav li {
    font-weight: 600;
    font-size: 17px;
    padding: 15px;
 
  }
  
 
  
  .content {
    /* margin-left: 250px; */
    padding: 20px;
    flex-grow: 1;
  }
  </style>
  