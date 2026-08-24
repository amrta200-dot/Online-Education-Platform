import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
 
// المشروع يستخدم امتداد .js (وليس .jsx) لملفات React كما طُلب،
// لذلك نضبط esbuild ليتعامل مع كل ملفات .js داخل src على أنها JSX.
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.js$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // مكتبات React الأساسية في ملف واحد يتكاش في المتصفح
          vendor: ["react", "react-dom", "react-router-dom"],
          // LiveKit ثقيلة ومستخدمة في صفحة اللايف بس (بتتحمل مع LiveClass.js فقط)
          livekit: ["@livekit/components-react"],
        },
      },
    },
    // رفع حد التحذير شوية بعد ما بقينا بنقسم الكود فعليًا
    chunkSizeWarningLimit: 600,
  },
});