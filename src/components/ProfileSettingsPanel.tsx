import { useState } from "react";
import PxIcon from "./PxIcon";
import { useTheme } from "@/hooks/use-theme";

type SettingsTab = "profile" | "appearance" | "notifications" | "integrations" | "account";

const tabs: { id: SettingsTab; label: string; icon: string }[] = [
  { id: "profile", label: "Profile", icon: "user" },
  { id: "appearance", label: "Appearance", icon: "drop" },
  { id: "notifications", label: "Notifications", icon: "notification" },
  { id: "integrations", label: "Integrations", icon: "link" },
  { id: "account", label: "Account", icon: "lock" },
];

interface Props {
  onClose: () => void;
}

export default function ProfileSettingsPanel({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="w-[860px] max-w-[95vw] h-[600px] max-h-[90vh] bg-card border border-border flex overflow-hidden animate-slide-up shadow-2xl">
        {/* Left nav */}
        <div className="w-52 shrink-0 border-r border-border bg-muted/30 flex flex-col">
          <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
            <div className="w-10 h-10 bg-accent border border-border flex items-center justify-center">
              <span className="text-foreground text-sm font-bold">JD</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">John Doe</p>
              <p className="text-[11px] text-muted-foreground">john@saken.dev</p>
            </div>
          </div>
          <nav className="flex flex-col gap-0.5 p-2 flex-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                  activeTab === t.id
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <PxIcon icon={t.icon} size={14} />
                {t.label}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-border">
            <button className="flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 w-full transition-colors">
              <PxIcon icon="logout" size={14} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <PxIcon icon="close" size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "appearance" && <AppearanceTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "integrations" && <IntegrationsTab />}
            {activeTab === "account" && <AccountTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Field helpers ─── */

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, placeholder, disabled }: { value: string; placeholder?: string; disabled?: boolean }) {
  const [val, setVal] = useState(value);
  return (
    <input
      value={val}
      onChange={(e) => setVal(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-3 py-2 text-xs bg-muted border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/30 disabled:opacity-50 transition-colors"
    />
  );
}

function ToggleSwitch({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative w-9 h-5 rounded-full transition-colors ${on ? "bg-success" : "bg-muted border border-border"}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${
          on ? "left-[18px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">{title}</h3>
      {description && <p className="text-[11px] text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}

function Divider() {
  return <div className="border-t border-border my-6" />;
}

/* ─── Profile Tab ─── */

function ProfileTab() {
  return (
    <div className="space-y-0">
      <SectionTitle title="Personal Information" description="Update your profile details visible to your team." />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <FieldGroup label="First Name">
          <TextInput value="John" />
        </FieldGroup>
        <FieldGroup label="Last Name">
          <TextInput value="Doe" />
        </FieldGroup>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <FieldGroup label="Email">
          <TextInput value="john@saken.dev" />
        </FieldGroup>
        <FieldGroup label="Username">
          <TextInput value="johndoe" />
        </FieldGroup>
      </div>
      <FieldGroup label="Bio">
        <textarea
          defaultValue="Full-stack developer. Building the future of AI-assisted development."
          className="w-full px-3 py-2 text-xs bg-muted border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/30 resize-none h-20 transition-colors"
        />
      </FieldGroup>

      <Divider />

      <SectionTitle title="Role & Team" />
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Role">
          <TextInput value="Lead Developer" />
        </FieldGroup>
        <FieldGroup label="Team">
          <TextInput value="Core Engineering" />
        </FieldGroup>
      </div>

      <div className="flex justify-end mt-6">
        <button className="px-4 py-2 text-xs bg-foreground text-background hover:bg-foreground/90 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* ─── Appearance Tab ─── */

function AppearanceTab() {
  const { theme, toggleTheme } = useTheme();
  const [fontSize, setFontSize] = useState(13);
  const [editorFont, setEditorFont] = useState("Geist Mono");

  return (
    <div>
      <SectionTitle title="Theme" description="Choose how the interface looks." />

      <div className="flex gap-3 mb-2">
        <button
          onClick={() => theme === "light" || toggleTheme()}
          className={`flex-1 p-4 border text-center transition-colors ${
            theme === "dark"
              ? "border-foreground bg-accent"
              : "border-border hover:border-foreground/30"
          }`}
        >
          <PxIcon icon="moon" size={20} className="mx-auto mb-2 text-foreground" />
          <span className="text-xs font-medium text-foreground">Dark</span>
        </button>
        <button
          onClick={() => theme === "dark" || toggleTheme()}
          className={`flex-1 p-4 border text-center transition-colors ${
            theme === "light"
              ? "border-foreground bg-accent"
              : "border-border hover:border-foreground/30"
          }`}
        >
          <PxIcon icon="sun" size={20} className="mx-auto mb-2 text-foreground" />
          <span className="text-xs font-medium text-foreground">Light</span>
        </button>
      </div>

      <Divider />

      <SectionTitle title="Editor" description="Customize the code editor appearance." />
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Font Family">
          <select
            value={editorFont}
            onChange={(e) => setEditorFont(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-muted border border-border text-foreground outline-none"
          >
            <option>Geist Mono</option>
            <option>JetBrains Mono</option>
            <option>Fira Code</option>
            <option>Source Code Pro</option>
          </select>
        </FieldGroup>
        <FieldGroup label={`Font Size — ${fontSize}px`}>
          <input
            type="range"
            min={10}
            max={20}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full accent-foreground mt-1"
          />
        </FieldGroup>
      </div>

      <Divider />

      <SectionTitle title="UI Density" />
      <div className="flex gap-3">
        {["Compact", "Default", "Comfortable"].map((d) => (
          <button
            key={d}
            className={`flex-1 py-2 text-xs border transition-colors ${
              d === "Default"
                ? "border-foreground bg-accent text-foreground font-medium"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Notifications Tab ─── */

function NotificationsTab() {
  return (
    <div>
      <SectionTitle title="Notification Preferences" description="Control what you're notified about." />

      <div className="space-y-4">
        {[
          { label: "Agent task completed", desc: "Get notified when an AI agent finishes a task", on: true },
          { label: "Deployment status", desc: "Alerts for successful or failed deployments", on: true },
          { label: "Issue assignments", desc: "When an issue is assigned to you", on: true },
          { label: "Pull request reviews", desc: "When a review is requested", on: false },
          { label: "Sprint updates", desc: "Weekly sprint progress summaries", on: false },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-medium text-foreground">{item.label}</p>
              <p className="text-[11px] text-muted-foreground">{item.desc}</p>
            </div>
            <ToggleSwitch defaultOn={item.on} />
          </div>
        ))}
      </div>

      <Divider />

      <SectionTitle title="Channels" description="Where you receive notifications." />
      <div className="space-y-4">
        {[
          { label: "In-app notifications", on: true },
          { label: "Email digest", on: false },
          { label: "Desktop push notifications", on: true },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-2">
            <p className="text-xs font-medium text-foreground">{item.label}</p>
            <ToggleSwitch defaultOn={item.on} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Integrations Tab ─── */

function IntegrationsTab() {
  const integrations = [
    { name: "GitHub", icon: "git-branch", connected: true, desc: "Sync repos and pull requests" },
    { name: "Slack", icon: "message", connected: true, desc: "Get notified in Slack channels" },
    { name: "Linear", icon: "layout-sidebar-right", connected: false, desc: "Sync issues bi-directionally" },
    { name: "Figma", icon: "drop", connected: false, desc: "Import design tokens and components" },
    { name: "Vercel", icon: "cloud-upload", connected: true, desc: "Auto-deploy on push" },
  ];

  return (
    <div>
      <SectionTitle title="Connected Services" description="Manage third-party integrations." />
      <div className="space-y-3">
        {integrations.map((int) => (
          <div key={int.name} className="flex items-center justify-between p-3 border border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent border border-border flex items-center justify-center">
                <PxIcon icon={int.icon} size={16} className="text-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">{int.name}</p>
                <p className="text-[11px] text-muted-foreground">{int.desc}</p>
              </div>
            </div>
            <button
              className={`px-3 py-1.5 text-[11px] border transition-colors ${
                int.connected
                  ? "border-success/30 text-success bg-success/10 hover:bg-success/20"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {int.connected ? "Connected" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Account Tab ─── */

function AccountTab() {
  return (
    <div>
      <SectionTitle title="Security" description="Manage your account security settings." />
      <div className="space-y-4 mb-4">
        <FieldGroup label="Current Password">
          <TextInput value="" placeholder="••••••••" />
        </FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="New Password">
            <TextInput value="" placeholder="Enter new password" />
          </FieldGroup>
          <FieldGroup label="Confirm Password">
            <TextInput value="" placeholder="Confirm new password" />
          </FieldGroup>
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 text-xs bg-foreground text-background hover:bg-foreground/90 transition-colors">
            Update Password
          </button>
        </div>
      </div>

      <Divider />

      <SectionTitle title="Two-Factor Authentication" />
      <div className="flex items-center justify-between p-3 border border-border bg-muted/30">
        <div>
          <p className="text-xs font-medium text-foreground">2FA is currently disabled</p>
          <p className="text-[11px] text-muted-foreground">Add an extra layer of security to your account</p>
        </div>
        <button className="px-3 py-1.5 text-[11px] border border-border text-foreground hover:bg-accent transition-colors">
          Enable 2FA
        </button>
      </div>

      <Divider />

      <SectionTitle title="Sessions" />
      <div className="space-y-2">
        {[
          { device: "Chrome on macOS", location: "San Francisco, US", current: true },
          { device: "Firefox on Windows", location: "New York, US", current: false },
        ].map((s) => (
          <div key={s.device} className="flex items-center justify-between p-3 border border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <PxIcon icon="device-laptop" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-foreground">
                  {s.device}
                  {s.current && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] leading-none px-1 py-[3px] bg-success/10 text-success">
                      <PxIcon icon="check" size={8} /> Current
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-muted-foreground">{s.location}</p>
              </div>
            </div>
            {!s.current && (
              <button className="px-3 py-1.5 text-[11px] text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors">
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>

      <Divider />

      <SectionTitle title="Danger Zone" />
      <div className="flex items-center justify-between p-3 border border-destructive/30 bg-destructive/5">
        <div>
          <p className="text-xs font-medium text-foreground">Delete Account</p>
          <p className="text-[11px] text-muted-foreground">Permanently delete your account and all data</p>
        </div>
        <button className="px-3 py-1.5 text-[11px] bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
