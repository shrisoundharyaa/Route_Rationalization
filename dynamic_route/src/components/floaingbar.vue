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
  top: 60px;
  left: 0px;
  width: 50px;
  height: 100%;
  background-color: #ecedf1;
  color: #18181b;
  overflow: hidden;
  transition: width 0.3s ease;
  box-shadow: 2px 0 5px rgba(99, 99, 99, 0.2);
  z-index: 955;
}

.sidebar.open {
  width: 140px;
}

.sidebar ul {
  list-style: none;
  padding: 30px 10px;
  margin: 0;
}

.sidebar ul li {
  display: flex;
  align-items: center; /* Vertically align icon and text */
  height: 40px;
  margin: 15px 0;
  cursor: pointer;
  color: #18181b;
  padding: 0 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.sidebar ul li:hover {
  color: #5664c4;
  background-color: #e0e7ff;
}

.sidebar ul li i {
  flex-shrink: 0;
  font-size: 20px;
  color: #12c5d1;
  width: 30px; /* Fixed width for icon alignment */
  text-align: center; /* Ensure icons are centered within their allocated space */
}

.sidebar ul li span {
  font-size: 16px;
  white-space: nowrap;
  opacity: 0;
  display: inline-block;
  width: 90px; /* Fixed width for text alignment */
  text-align: left;
  padding-left: 5px; /* Slight left padding for readability */
  transform: translateX(-20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.sidebar.open ul li span {
  opacity: 1;
  transform: translateX(0);
}

.sidebar ul li span,
.sidebar ul li i {
  line-height: 40px; /* Ensure consistent height alignment */
}

.sidebar ul li span {
  margin-left: 10px; /* Space between icon and text */
}
</style>
