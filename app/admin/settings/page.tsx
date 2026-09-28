export default function AdminSettingsPage() {
  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <h1 className="font-serif text-3xl font-bold mb-8">Settings</h1>
      <div className="bg-white rounded-2xl border border-black/5 p-6 text-sm text-market-charcoal/70 space-y-3">
        <p>
          Site content lives under its own sections in the sidebar (Homepage, About, Store Info,
          Hours, Ordering).
        </p>
        <p>
          To change your admin login password, update it directly in the database, or ask your
          developer to add a password-change form here.
        </p>
      </div>
    </div>
  );
}
