export default function ColorTest() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-background">
      <div className="bg-primary text-primary-foreground p-8 rounded-lg text-2xl font-bold">
        This should be a blue background with white text
      </div>
      <button className="bg-primary text-primary-foreground px-6 py-3 rounded shadow-lg text-lg font-semibold">
        Primary Button
      </button>
    </div>
  );
} 