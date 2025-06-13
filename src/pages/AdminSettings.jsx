
import React, { useEffect, useState } from "react";
import api from "../api";
import SettingsForm from "../components/admin/settings/SettingsForm";
import SettingsBackup from "../components/admin/settings/SettingsBackup";

const AdminSettings = () => {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        setConfig(res.data || {});
      } catch (err) {
        console.error("Failed to load settings:", err);
        alert("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async () => {
    try {
      await api.put("/settings", config);
      alert("Settings updated successfully!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Failed to save settings");
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin Settings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <SettingsForm config={config} setConfig={setConfig} />

          {/* SMTP SETTINGS */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-yellow-400">SMTP Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-1 text-sm">SMTP Host</label>
                <input
                  type="text"
                  value={config.smtpHost || ""}
                  onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                  className="w-full p-2 rounded bg-white text-black border border-gray-400"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">SMTP Port</label>
                <input
                  type="number"
                  value={config.smtpPort || ""}
                  onChange={(e) => setConfig({ ...config, smtpPort: e.target.value })}
                  className="w-full p-2 rounded bg-white text-black border border-gray-400"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">SMTP User</label>
                <input
                  type="text"
                  value={config.smtpUser || ""}
                  onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                  className="w-full p-2 rounded bg-white text-black border border-gray-400"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">SMTP Password</label>
                <input
                  type="password"
                  value={config.smtpPass || ""}
                  onChange={(e) => setConfig({ ...config, smtpPass: e.target.value })}
                  className="w-full p-2 rounded bg-white text-black border border-gray-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm">From Email</label>
                <input
                  type="email"
                  value={config.smtpFrom || ""}
                  onChange={(e) => setConfig({ ...config, smtpFrom: e.target.value })}
                  className="w-full p-2 rounded bg-white text-black border border-gray-400"
                />
              </div>
            </div>

            {/* Test SMTP */}
            <div className="mt-6">
              <button
                onClick={async () => {
                  try {
                    await api.post("/settings/test-smtp");
                    alert("✅ Test email sent successfully!");
                  } catch (err) {
                    alert("❌ Failed to send test email. Check your SMTP settings.");
                    console.error("SMTP test error:", err.response?.data || err.message);
                  }
                }}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded"
              >
                Send Test Email
              </button>
            </div>
          </div>

          {/* Save + Backup */}
          <div className="flex justify-between mt-8">
            <button
              onClick={updateSettings}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Settings
            </button>
            <SettingsBackup config={config} setConfig={setConfig} />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSettings;
