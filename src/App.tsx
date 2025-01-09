import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/home";
import RepositoryDetailsPage from "./pages/repository-details";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path=":repositoryName" element={<RepositoryDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
