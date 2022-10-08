import { AuthProvider } from "./Auth";
import Root from "./routes/root";

function App() {
  const isTheme = localStorage.theme === "dark";
  const isDefaultTheme =
    !("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (isTheme || isDefaultTheme) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}

export default App;
