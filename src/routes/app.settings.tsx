import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Building2, Globe2, Palette, Bell, ShieldCheck, Wrench, RotateCcw, Save } from "lucide-react";
import {
  DEFAULT_SETTINGS, getAppSettings, setAppSettings, type AppSettings,
} from "@/lib/app-settings";

export const Route = createFileRoute("/app/settings")({
  component: Settings,
});

function Settings() {
  const [draft, setDraft] = useState<AppSettings>(() => getAppSettings());
  const [initial, setInitial] = useState<AppSettings>(() => getAppSettings());

  useEffect(() => {
    const s = getAppSettings();
    setDraft(s);
    setInitial(s);
  }, []);

  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setAppSettings(draft);
    setInitial(draft);
    toast.success("Pengaturan disimpan", { description: "Perubahan langsung diterapkan ke seluruh aplikasi." });
  };

  const handleReset = () => {
    setDraft(initial);
    toast.message("Perubahan dibatalkan");
  };

  const handleRestoreDefaults = () => {
    setDraft(DEFAULT_SETTINGS);
    toast.message("Default dimuat", { description: "Klik Simpan untuk menerapkan." });
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pengaturan</h1>
          <p className="text-sm text-muted-foreground">Kelola preferensi seluruh aplikasi internal.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleRestoreDefaults} className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          Muat default
        </Button>
      </div>

      {/* General */}
      <SettingsCard
        icon={Building2}
        title="Umum"
        description="Identitas perusahaan dan tampilan dasar di seluruh aplikasi."
      >
        <Field label="Nama aplikasi" hint="Muncul di navbar internal app.">
          <Input value={draft.appName} onChange={(e) => update("appName", e.target.value)} />
        </Field>
        <Field label="Nama perusahaan">
          <Input value={draft.companyName} onChange={(e) => update("companyName", e.target.value)} />
        </Field>
        <Field label="Domain">
          <Input value={draft.domain} onChange={(e) => update("domain", e.target.value)} />
        </Field>
        <Field label="Mata uang default">
          <Select value={draft.currency} onValueChange={(v) => update("currency", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="IDR">IDR — Rupiah</SelectItem>
              <SelectItem value="USD">USD — US Dollar</SelectItem>
              <SelectItem value="EUR">EUR — Euro</SelectItem>
              <SelectItem value="SGD">SGD — Singapore Dollar</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </SettingsCard>

      {/* Localization */}
      <SettingsCard
        icon={Globe2}
        title="Lokalisasi"
        description="Bahasa, zona waktu, dan format yang digunakan sistem."
      >
        <Field label="Zona waktu">
          <Select value={draft.timezone} onValueChange={(v) => update("timezone", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Jakarta">Asia/Jakarta (WIB)</SelectItem>
              <SelectItem value="Asia/Makassar">Asia/Makassar (WITA)</SelectItem>
              <SelectItem value="Asia/Jayapura">Asia/Jayapura (WIT)</SelectItem>
              <SelectItem value="Asia/Singapore">Asia/Singapore</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Bahasa">
          <Select value={draft.language} onValueChange={(v) => update("language", v as AppSettings["language"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Bahasa Indonesia</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Format tanggal">
          <Select value={draft.dateFormat} onValueChange={(v) => update("dateFormat", v as AppSettings["dateFormat"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Awal minggu">
          <Select value={draft.weekStart} onValueChange={(v) => update("weekStart", v as AppSettings["weekStart"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="monday">Senin</SelectItem>
              <SelectItem value="sunday">Minggu</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </SettingsCard>

      {/* Appearance */}
      <SettingsCard
        icon={Palette}
        title="Tampilan"
        description="Atur tema dan kepadatan tampilan antarmuka."
      >
        <Field label="Tema">
          <Select value={draft.theme} onValueChange={(v) => update("theme", v as AppSettings["theme"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="system">Ikuti sistem</SelectItem>
              <SelectItem value="light">Terang</SelectItem>
              <SelectItem value="dark">Gelap</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Kepadatan">
          <Select value={draft.density} onValueChange={(v) => update("density", v as AppSettings["density"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="comfortable">Nyaman</SelectItem>
              <SelectItem value="compact">Padat</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </SettingsCard>

      {/* Notifications */}
      <SettingsCard
        icon={Bell}
        title="Notifikasi"
        description="Kontrol bagaimana sistem mengirim pemberitahuan ke pengguna."
      >
        <ToggleRow
          label="Notifikasi email"
          description="Kirim ringkasan dan peringatan penting ke email pengguna."
          checked={draft.notifyEmail}
          onChange={(v) => update("notifyEmail", v)}
        />
        <ToggleRow
          label="Notifikasi in-app"
          description="Tampilkan lonceng notifikasi pada navbar."
          checked={draft.notifyInApp}
          onChange={(v) => update("notifyInApp", v)}
        />
        <Field label="Frekuensi digest">
          <Select value={draft.notifyDigest} onValueChange={(v) => update("notifyDigest", v as AppSettings["notifyDigest"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="off">Nonaktif</SelectItem>
              <SelectItem value="daily">Harian</SelectItem>
              <SelectItem value="weekly">Mingguan</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </SettingsCard>

      {/* Security */}
      <SettingsCard
        icon={ShieldCheck}
        title="Keamanan & Akses"
        description="Aturan login dan sesi untuk seluruh staf."
      >
        <ToggleRow
          label="Izinkan pendaftaran mandiri"
          description="Karyawan baru dapat membuat akun via halaman daftar."
          checked={draft.allowSignup}
          onChange={(v) => update("allowSignup", v)}
        />
        <ToggleRow
          label="Wajibkan 2FA"
          description="Semua staf harus mengaktifkan autentikasi dua faktor."
          checked={draft.twoFactorRequired}
          onChange={(v) => update("twoFactorRequired", v)}
        />
        <Field label="Timeout sesi (menit)">
          <Input
            type="number"
            min={5}
            max={1440}
            value={draft.sessionTimeoutMinutes}
            onChange={(e) => update("sessionTimeoutMinutes", Math.max(5, Number(e.target.value) || 60))}
          />
        </Field>
      </SettingsCard>

      {/* Maintenance */}
      <SettingsCard
        icon={Wrench}
        title="Mode Pemeliharaan"
        description="Nonaktifkan sementara akses pengguna saat ada pekerjaan sistem."
        accent={draft.maintenanceMode ? "warning" : undefined}
      >
        <ToggleRow
          label="Aktifkan mode pemeliharaan"
          description="Saat aktif, badge maintenance muncul di navbar dan akses non-admin dibatasi."
          checked={draft.maintenanceMode}
          onChange={(v) => update("maintenanceMode", v)}
        />
        <Field label="Pesan untuk pengguna" full>
          <Textarea
            rows={3}
            value={draft.maintenanceMessage}
            onChange={(e) => update("maintenanceMessage", e.target.value)}
            placeholder="Pesan yang ditampilkan saat mode pemeliharaan aktif."
          />
        </Field>
      </SettingsCard>

      {/* Sticky save bar */}
      <div
        className={`sticky bottom-4 z-20 flex items-center justify-between gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur transition-all ${
          dirty ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <p className="text-xs text-muted-foreground">Anda memiliki perubahan yang belum disimpan.</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>Batal</Button>
          <Button variant="brand" size="sm" onClick={handleSave} className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            Simpan perubahan
          </Button>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
  accent,
}: {
  icon: typeof Building2;
  title: string;
  description: string;
  children: React.ReactNode;
  accent?: "warning";
}) {
  return (
    <section
      className={`rounded-xl border bg-card p-6 shadow-soft ${
        accent === "warning" ? "border-amber-500/40" : "border-border"
      }`}
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-brand text-brand-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
  full,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <Label className="text-xs font-medium">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-secondary/30 p-3 sm:col-span-2">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
