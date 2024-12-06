<template>
  <div>
    <!-- Sidebar -->
    <div class="sidebar" :class="{ open: isHovered || isOpen }" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <ul>
        <li @click.stop="$router.push('/')">
          <i class="fas fa-home"></i>
          <span v-if="isHovered || isOpen"> Home</span>
        </li>
        <li @click.stop="$router.push('/real')">
          <i class="fas fa-map-marker-alt"></i>
          <span v-if="isHovered || isOpen"> Map</span>
        </li>
        <li @click.stop="$router.push('/buses')">
          <i class="fas fa-bus-alt"></i>
          <span v-if="isHovered || isOpen"> Buses</span>
        </li>
        <li @click.stop="$router.push('/routes')">
          <i class="fas fa-road"></i>
          <span v-if="isHovered || isOpen"> Routes</span>
        </li>
        <li @click.stop="$router.push('/depot')">
          <i class="fas fa-warehouse"></i>
          <span v-if="isHovered || isOpen"> Depot</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "FloatingSidebar",
  data() {
    return {
      isOpen: false, // Tracks whether the sidebar is manually toggled
      isHovered: false, // Tracks hover state
    };
  },
  methods: {
    handleMouseEnter() {
      this.isHovered = true;
    },
    handleMouseLeave() {
      this.isHovered = false;
    },
    toggleSidebar() {
      this.isOpen = !this.isOpen; // Manually toggle the sidebar state
    },
  },
};
</script>
<style scoped>
/* Sidebar Container */
.sidebar {
  position: fixed;
  top: 60px; /* Below the top bar */
  left: 0px;
  width: 50px; /* Default width for icons only */
  height: 100%;
  background-color: #ecedf1; /* Light theme background color */
  color: #18181b; /* Main text color */
  overflow: hidden; /* Prevent overflow issues */
  transition: width 0.3s ease; /* Smooth expand/collapse */
  box-shadow: 2px 0 5px rgba(99, 99, 99, 0.2);
  z-index: 955;
}

.sidebar.open {
  width: 120px; /* Expanded width */
}

.sidebar ul {
  list-style: none;
  padding: 30px 10px;
  margin: 0;
}

.sidebar ul li {
  display: flex;
  align-items: center; /* Align icons and text */
  height: 40px; /* Consistent height for items */
  margin: 15px 0;
  cursor: pointer;
  color: #18181b;
  transition: background-color 0.3s ease, color 0.3s ease;
  gap: 10px; /* Spacing between icon and text */
  padding: 0 10px; /* Add padding for clickable area */
  border-radius: 5px; /* Rounded corners */
}

.sidebar ul li:hover {
  color: #5664c4; /* Highlight color on hover */
  background-color: #e0e7ff; /* Light blue background for hover */
}

.sidebar ul li i {
  flex-shrink: 0; /* Prevent icon resizing */
  font-size: 20px;
  color: #12c5d1; /* Icon color */
}

.sidebar ul li span {
  font-size: 16px;
  white-space: nowrap; /* Prevent text wrapping */
  opacity: 0;
  transform: translateX(-20px); /* Slightly slide text out of view */
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.sidebar.open ul li span {
  opacity: 1; /* Show text on expand */
  transform: translateX(0); /* Reset position */
}
</style>
