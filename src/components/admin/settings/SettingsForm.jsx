
import React from "react";

const Section = ({ title, children }) => (
  <div className="mb-6 bg-white p-4 rounded shadow">
    <h4 className="font-bold mb-2">{title}</h4>
    {children}
  </div>
);

const SettingsForm = ({ config, setConfig }) => {
  const update = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  return (
    <div className="space-y-4">
      <Section title="General">
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={config.allowMultipleRolloverPosts || false}
            onChange={(e) => update("allowMultipleRolloverPosts", e.target.checked)}
          />
          Allow Multiple Rollover Posts Per Day
        </label>
        <input
          type="number"
          placeholder="Referral %"
          value={config.referralPercent || ""}
          onChange={(e) => update("referralPercent", e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="number"
          placeholder="Minimum Withdrawal"
          value={config.minWithdrawal || ""}
          onChange={(e) => update("minWithdrawal", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </Section>

      <Section title="Deposit Instructions">
        <textarea
          placeholder="Enter deposit instructions here..."
          value={config.depositInfo || ""}
          onChange={(e) => update("depositInfo", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </Section>

      <Section title="Payment Gateway Keys">
        {["paystack", "flutterwave", "fincra", "crypto"].map((key) => (
          <div key={key} className="mb-2">
            <input
              type="text"
              placeholder={`${key} Public Key`}
              value={config[`${key}Public`] || ""}
              onChange={(e) => update(`${key}Public`, e.target.value)}
              className="border p-2 rounded w-full mb-1"
            />
            <input
              type="text"
              placeholder={`${key} Secret Key`}
              value={config[`${key}Secret`] || ""}
              onChange={(e) => update(`${key}Secret`, e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        ))}
      </Section>

      <Section title="Live Chat & Support Buttons (User End)">
        <input
          type="text"
          placeholder="Tawk.to Widget ID"
          value={config.tawkId || ""}
          onChange={(e) => update("tawkId", e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="WhatsApp Chat Link"
          value={config.whatsappLink || ""}
          onChange={(e) => update("whatsappLink", e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Telegram Support Link"
          value={config.telegramSupport || ""}
          onChange={(e) => update("telegramSupport", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </Section>

      <Section title="User Login Options">
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={config.enableGmailLogin || false}
            onChange={(e) => update("enableGmailLogin", e.target.checked)}
          />
          Enable Gmail Login
        </label>
        <input
          type="text"
          placeholder="Gmail Client ID"
          value={config.gmailClientId || ""}
          onChange={(e) => update("gmailClientId", e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Gmail Client Secret"
          value={config.gmailClientSecret || ""}
          onChange={(e) => update("gmailClientSecret", e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={config.enableTelegramLogin || false}
            onChange={(e) => update("enableTelegramLogin", e.target.checked)}
          />
          Enable Telegram Login
        </label>
        <input
          type="text"
          placeholder="Telegram Bot Username"
          value={config.telegramBotUsername || ""}
          onChange={(e) => update("telegramBotUsername", e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Telegram Bot Token (optional)"
          value={config.telegramBotToken || ""}
          onChange={(e) => update("telegramBotToken", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </Section>

      <Section title="Cloudflare Turnstile Protection">
        <input
          type="text"
          placeholder="Turnstile Site Key"
          value={config.cfTurnstile || ""}
          onChange={(e) => update("cfTurnstile", e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Turnstile Secret Key"
          value={config.cfTurnstileSecret || ""}
          onChange={(e) => update("cfTurnstileSecret", e.target.value)}
          className="border p-2 rounded w-full"
        />
      </Section>
    </div>
  );
};

export default SettingsForm;
