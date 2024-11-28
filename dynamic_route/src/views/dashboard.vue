<template>
    <div class="app-container">
      <aside class="sidebar">
        <nav>
          <ul>
            DashBoard
            <li @click="$router.push('/real')">
          <i class="fas fa-route"></i> Map
        </li>   
            <li @click="$router.push('/buses')">
                <i class="fas fa-bus"></i> Buses
            </li>
            <li @click="$router.push('/routes')">
          <i class="fas fa-route"></i> Routes
        </li>
       
          </ul>
        </nav>
      </aside>
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: "App",
  };
  </script>
  
  <style>
  .app-container {
    display: flex;
    height: 100vh;
  }
  
  .sidebar {
    width: 250px;
    background-color: black;
    color: white;
    padding: 20px;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar ul li {
    margin: 15px 0;
  }
  
  .sidebar ul li a {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }
  
  .sidebar ul li a:hover {
    color: #1e90ff;
  }
  
  .main-content {
    flex: 1;
    padding: 20px;
    background-color: #f4f4f4;
  }
  </style>
  