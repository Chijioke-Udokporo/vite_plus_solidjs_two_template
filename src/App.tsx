import "./styles/index.css";
import { Loading } from "solid-js";
import { Router } from "./router";
import { Title } from "@solidjs/meta";
import { Toaster } from "./libs/toast";

export default function App() {
  return (
    <Router>
      {(props) => (
        <>
          <Title>Solid App</Title>
          <Toaster position="top-right" />
          <Loading fallback={<main>Loading…</main>}>{props.children}</Loading>
        </>
      )}
    </Router>
  );
}
