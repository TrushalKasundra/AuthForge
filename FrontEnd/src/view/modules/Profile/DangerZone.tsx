import Button from '@/components/common/Button';

const DangerZone = () => {
  return (
    <div className="lg:col-span-3 bg-red-500/5 border border-red-500/20 rounded-2xl p-6
      animate-fade-in-up animation-delay-500">
      <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
      <p className="text-slate-400 text-sm mb-6">
        Irreversible actions that will permanently affect your account.
      </p>
      
      <div className="flex flex-wrap gap-4">
        <Button variant="secondary">
          Export Data
        </Button>
        <Button variant="danger">
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default DangerZone;
