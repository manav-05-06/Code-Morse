import { useEffect, useState } from "react";

export default function InstallButton() {
  const [canInstall, setCanInstall] = useState(false);
  const [promptEvent, setPromptEvent] = useState(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setPromptEvent(e);
      setCanInstall(true);
    });
  }, []);

  const installApp = async () => {
    if (!promptEvent) return;
    promptEvent.prompt();

    const choice = await promptEvent.userChoice;

    if (choice.outcome === "accepted") {
      setCanInstall(false);
      localStorage.setItem("installedPWA", "true");
    }
  };

  if (!canInstall || localStorage.getItem("installedPWA") === "true") return null;

  return (
    <button
      onClick={installApp}
      className="px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black 
      hover:scale-105 transition-all"
    >
      Install App
    </button>
  );
}
