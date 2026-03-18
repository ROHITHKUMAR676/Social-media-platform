import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";


export default function App() {
  return (
    <AuthProvider>
      <Router>
        
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AppRoutes />
          </div>
        
      </Router>
    </AuthProvider>
  );
}
