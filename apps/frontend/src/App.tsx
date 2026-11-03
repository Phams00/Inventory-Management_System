
import { useEffect, useState } from "react";
import {
  getApiHealth,
  type HealthResponse,
} from "./services/api";

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getApiHealth()
      .then(setHealth)
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Unknown error"
        );
      });
  }, []);

  return (
    <main>
      <h1>Inventory Management System</h1>

      {error && <p>Connection error: {error}</p>}

      {!health && !error && <p>Connecting to backend...</p>}

      {health && (
        <section>
          <p>{health.message}</p>
          <p>API: {health.services.api}</p>
          <p>Database: {health.services.database}</p>
        </section>
      )}
    </main>
  );
}

export default App;
