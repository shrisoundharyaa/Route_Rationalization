<template>
    <div class="topbar">
      <h1 class="topbar-title">Dashboard</h1>
    </div>
  </template>
  
  <script>
  export default {
    name: "TopBar",
  };
  </script>
  
  <style scoped>
  .topbar {
    position: fixed;
    top: 0;
    left: 30px;
    width: 100%;
    height: 60px;
    background-color: #222;
    color: white;
    display: flex;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  .topbar-title {
    font-size: 18px;
    font-weight: bold;
  }
  </style>