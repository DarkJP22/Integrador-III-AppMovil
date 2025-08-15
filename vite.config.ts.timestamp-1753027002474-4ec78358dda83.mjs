// vite.config.ts
import legacy from "file:///c:/Users/crisa/Documents/AppMovil3/Integrador-III-AppMovil/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import vue from "file:///c:/Users/crisa/Documents/AppMovil3/Integrador-III-AppMovil/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { defineConfig } from "file:///c:/Users/crisa/Documents/AppMovil3/Integrador-III-AppMovil/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "c:\\Users\\crisa\\Documents\\AppMovil3\\Integrador-III-AppMovil";
var vite_config_default = defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes("swiper-")
        }
      }
    }),
    legacy()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  test: {
    globals: true,
    environment: "jsdom"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFxjcmlzYVxcXFxEb2N1bWVudHNcXFxcQXBwTW92aWwzXFxcXEludGVncmFkb3ItSUlJLUFwcE1vdmlsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFxjcmlzYVxcXFxEb2N1bWVudHNcXFxcQXBwTW92aWwzXFxcXEludGVncmFkb3ItSUlJLUFwcE1vdmlsXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9jOi9Vc2Vycy9jcmlzYS9Eb2N1bWVudHMvQXBwTW92aWwzL0ludGVncmFkb3ItSUlJLUFwcE1vdmlsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IGxlZ2FjeSBmcm9tICdAdml0ZWpzL3BsdWdpbi1sZWdhY3knXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoe1xyXG4gICAgICB0ZW1wbGF0ZToge1xyXG4gICAgICAgIGNvbXBpbGVyT3B0aW9uczoge1xyXG4gICAgICAgICAgLy8gdHJlYXQgYWxsIHRhZ3Mgd2l0aCBhIGRhc2ggYXMgY3VzdG9tIGVsZW1lbnRzXHJcbiAgICAgICAgICBpc0N1c3RvbUVsZW1lbnQ6ICh0YWcpID0+IHRhZy5pbmNsdWRlcygnc3dpcGVyLScpLFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSksXHJcbiAgICBsZWdhY3koKSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgdGVzdDoge1xyXG4gICAgZ2xvYmFsczogdHJ1ZSxcclxuICAgIGVudmlyb25tZW50OiAnanNkb20nXHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRXLE9BQU8sWUFBWTtBQUMvWCxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQW9CO0FBSDdCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxNQUNGLFVBQVU7QUFBQSxRQUNSLGlCQUFpQjtBQUFBO0FBQUEsVUFFZixpQkFBaUIsQ0FBQyxRQUFRLElBQUksU0FBUyxTQUFTO0FBQUEsUUFDbEQ7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxPQUFPO0FBQUEsRUFDVDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLEVBQ2Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
