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
  left: 0px;
  width: 100%; /* Adjusted width considering sidebar space */
  height: 60px;
  background-color: #ecedf1; /* Light theme background */
  color: #18181b; /* Main text color */
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(99, 99, 99, 0.2); /* Shadow consistent with theme */
  z-index: 1000;
}

.topbar-title {
  font-size: 18px;
  font-weight: bold;
  color: #0b0b0c; /* Secondary text color */
}
</style>
