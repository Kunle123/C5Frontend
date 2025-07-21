import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export default function TailwindUiTest() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gray-100 p-8">
      <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg border border-gray-400 text-lg font-semibold">
        This is a Tailwind-styled div (blue background, white text, border, shadow, rounded)
      </div>
      <div className="w-96 bg-white border border-gray-400 rounded-xl shadow-lg p-6 flex flex-col items-center gap-4">
        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">Success Badge</span>
        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">Destructive Badge</span>
        <button className="bg-blue-500 text-white px-6 py-3 rounded shadow-lg text-lg font-semibold">Tailwind Button</button>
      </div>
    </div>
  );
} 