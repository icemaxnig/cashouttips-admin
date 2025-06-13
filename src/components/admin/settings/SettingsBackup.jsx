import React from "react";

const SettingsBackup = ({ config, setConfig }) => {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "settings-backup.json";
    link.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setConfig(json);
        alert("Settings restored!");
      } catch {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center gap-3">
      <button onClick={handleExport} className="bg-gray-600 text-white px-3 py-2 rounded">
        Export Settings
      </button>
      <label className="cursor-pointer bg-gray-300 px-3 py-2 rounded">
        Import JSON
        <input type="file" accept=".json" className="hidden" onChange={handleImport} />
      </label>
    </div>
  );
};

export default SettingsBackup;
