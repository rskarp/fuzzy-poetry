<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="drawer wrapper">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <header>
        <div class="w-full navbar bg-base-300 rounded-b-sm">
          <div class="flex-none lg:hidden">
            <label for="my-drawer-3" class="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-6 h-6 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div class="flex-1 px-2 mx-2 text-green-400">
            <RouterLink to="/">Fuzzy Poetry</RouterLink>
          </div>
          <div class="flex-none hidden lg:block">
            <nav>
              <ul class="menu menu-horizontal text-secondary">
                <!-- Navbar menu content here -->

                <li><RouterLink to="/">Home</RouterLink></li>
                <li>
                  <span>About</span>
                  <ul class="text-secondary z-50">
                    <div class="bg-base-300 w-40 p-1 flex flex-col">
                      <RouterLink to="/overview">Project Overview</RouterLink>
                      <RouterLink to="/context">Context</RouterLink>
                      <RouterLink to="/contributors">Contributors</RouterLink>
                    </div>
                  </ul>
                </li>
                <li><RouterLink to="/contact">Contact</RouterLink></li>
                <!-- <li><RouterLink to="/how-it-works">How It Works</RouterLink></li> -->
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <!-- Page content here -->
      <div id="page-content">
        <RouterView />
      </div>
    </div>
    <div class="drawer-side">
      <label for="my-drawer-3" class="drawer-overlay"></label>

      <ul class="menu p-4 w-80 bg-base-100 text-secondary">
        <!-- Sidebar content here -->
        <nav>
          <li><RouterLink to="/">Home</RouterLink></li>
          <li>
            <span>About</span>
            <ul class="text-secondary">
              <div class="w-40 p-1 ml-6 flex flex-col">
                <RouterLink to="/overview">Project Overview</RouterLink>
                <RouterLink to="/context">Context</RouterLink>
                <RouterLink to="/contributors">Contributors</RouterLink>
              </div>
            </ul>
          </li>
          <li><RouterLink to="/contact">Contact</RouterLink></li>
          <!-- <li><RouterLink to="/how-it-works">How It Works</RouterLink></li> -->
        </nav>
      </ul>
    </div>
  </div>

  <footer class="footer footer-center p-4 bg-base-300 text-base-content rounded-t-sm">
    <div>
      <p>Copyright © 2025 - All rights reserved by Fuzzy Poetry Project</p>
    </div>
  </footer>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Rubik+Beastly&display=swap');
header {
  font-family: 'Rubik Beastly', cursive;
}
.wrapper {
  height: 100%;
  overflow: auto;
}
#page-content {
  padding: 1rem 2rem;
}
/* header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
