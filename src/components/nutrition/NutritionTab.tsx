'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SpotlightCard as Card } from '@/components/ui/SpotlightCard';
import { useGamificationStore } from '@/store/useGamificationStore';
import { PixelBean } from '@/components/ui/PixelIcons';
import { Utensils, Bot, Flame } from 'lucide-react';

interface NutritionMeal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  description: string;
  icon: string;
}

interface NutritionPlan {
  id: string;
  daily_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  meals: NutritionMeal[];
}

interface FoodLogItem {
  id: string;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  logged_at: string;
}

interface Totals {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export function NutritionTab() {
  const { notifyPointsAwarded } = useGamificationStore();
  const [plan, setPlan] = useState<NutritionPlan | null>(null);
  const [foodLogs, setFoodLogs] = useState<FoodLogItem[]>([]);
  const [totals, setTotals] = useState<Totals>({ calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [logging, setLogging] = useState(false);

  // Form State
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  useEffect(() => {
    fetchNutritionData();
  }, []);

  const fetchNutritionData = async () => {
    try {
      const res = await fetch('/api/nutrition/log');
      const data = await res.json();
      if (res.ok) {
        setPlan(data.plan);
        setFoodLogs(data.foodLogs ?? []);
        setTotals(data.totals ?? { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });
      }
    } catch (err) {
      console.error('Failed to load nutrition data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/nutrition/generate', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setPlan(data.plan);
      } else {
        alert(data.error || 'Failed to generate plan');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleLogFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !calories) return;

    setLogging(true);
    const loggedMealName = foodName;
    try {
      const res = await fetch('/api/nutrition/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          food_name: foodName,
          calories: Number(calories),
          protein_g: Number(protein || 0),
          carbs_g: Number(carbs || 0),
          fat_g: Number(fat || 0),
        }),
      });

      if (res.ok) {
        setFoodName('');
        setCalories('');
        setProtein('');
        setCarbs('');
        setFat('');
        notifyPointsAwarded(5, `Logged meal: ${loggedMealName}`);
        await fetchNutritionData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to log food');
      }
    } finally {
      setLogging(true);
      await fetchNutritionData();
      setLogging(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    try {
      const res = await fetch(`/api/nutrition/log?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchNutritionData();
      }
    } catch (err) {
      console.error('Failed to delete food log', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <p className="animate-pulse font-bold text-ink/50">Loading nutrition tracker...</p>
      </div>
    );
  }

  const targetCalories = plan?.daily_calories ?? 2000;
  const targetProtein = plan?.protein_g ?? 150;
  const targetCarbs = plan?.carbs_g ?? 225;
  const targetFat = plan?.fat_g ?? 55;

  const calPercent = Math.min(100, Math.round((totals.calories / targetCalories) * 100));

  return (
    <div className="space-y-6">
      {/* Mini Title and Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
        <div>
          <h2 className="font-display text-xl font-bold flex items-center gap-2">
            <span>Diet & Macro Tracker</span>
            <Utensils className="h-5 w-5 text-accent" />
          </h2>
          <p className="text-xs font-semibold text-ink/50 flex items-center gap-1 mt-0.5">
            <span>Fuel your day, track calories, and earn coffee beans</span>
            <PixelBean size={14} />
          </p>
        </div>
        <button
          onClick={handleGeneratePlan}
          disabled={generating}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-ink px-4 py-2 font-bold text-paper text-xs shadow-brutal-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          <Bot className="h-4 w-4" />
          <span>{generating ? 'Generating AI Plan...' : 'Generate AI Diet Plan'}</span>
        </button>
      </div>

      {/* Macro Targets & Calorie Progress */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card accent className="!p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-ink/10 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">Daily Progress</span>
              <h2 className="font-display text-2xl font-extrabold mt-0.5">
                {totals.calories} <span className="text-xs text-ink/50">/ {targetCalories} kcal</span>
              </h2>
            </div>
            <div className="self-start sm:self-center px-3.5 py-1.5 bg-white border border-ink rounded-lg text-xs font-extrabold shadow-brutal-sm">
              {targetCalories - totals.calories > 0
                ? `${targetCalories - totals.calories} kcal remaining`
                : 'Daily Goal Reached!'}
            </div>
          </div>

          {/* Calorie Bar */}
          <div className="space-y-2">
            <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-ink">
              <motion.div
                className="h-full bg-ink"
                initial={{ width: 0 }}
                animate={{ width: `${calPercent}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          {/* Macro Breakdown Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Protein */}
            <div className="p-3 bg-white rounded-xl border border-ink/20 space-y-1">
              <div className="flex justify-between text-[11px] font-extrabold">
                <span>Protein</span>
                <span>{totals.protein_g}g / {targetProtein}g</span>
              </div>
              <div className="w-full h-2 bg-ink/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${Math.min(100, (totals.protein_g / targetProtein) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="p-3 bg-white rounded-xl border border-ink/20 space-y-1">
              <div className="flex justify-between text-[11px] font-extrabold">
                <span>Carbs</span>
                <span>{totals.carbs_g}g / {targetCarbs}g</span>
              </div>
              <div className="w-full h-2 bg-ink/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.min(100, (totals.carbs_g / targetCarbs) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fats */}
            <div className="p-3 bg-white rounded-xl border border-ink/20 space-y-1">
              <div className="flex justify-between text-[11px] font-extrabold">
                <span>Healthy Fat</span>
                <span>{totals.fat_g}g / {targetFat}g</span>
              </div>
              <div className="w-full h-2 bg-ink/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, (totals.fat_g / targetFat) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Log Food Form */}
      <Card className="!p-5 space-y-3">
        <h3 className="font-display text-lg font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span>Log Meal (+5 Coffee Beans)</span>
            <PixelBean size={18} />
          </span>
        </h3>

        <form onSubmit={handleLogFood} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold uppercase text-ink/50 mb-1">Meal / Food Name</label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g. Oatmeal & Protein Shake"
              className="w-full px-3 py-1.5 border border-ink rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-ink/50 mb-1">Calories</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="450"
              className="w-full px-3 py-1.5 border border-ink rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-ink/50 mb-1">Protein (g)</label>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="30"
              className="w-full px-3 py-1.5 border border-ink rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-ink/50 mb-1">Carbs (g)</label>
            <input
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="45"
              className="w-full px-3 py-1.5 border border-ink rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={logging}
              className="w-full py-2 bg-ink text-paper font-bold text-xs rounded-lg border border-ink hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {logging ? 'Logging...' : 'Log Food +'}
            </button>
          </div>
        </form>
      </Card>

      {/* Today's Logged Meals */}
      <Card className="!p-5 space-y-3">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
          Today&apos;s Food Logs ({foodLogs.length})
        </h4>

        {foodLogs.length === 0 ? (
          <p className="text-xs text-ink/40 italic py-1">No meals logged today yet.</p>
        ) : (
          <div className="space-y-2">
            {foodLogs.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 bg-ink/5 rounded-lg border border-ink/10 text-xs"
              >
                <div>
                  <p className="font-bold">{item.food_name}</p>
                  <p className="text-[10px] text-ink/50 flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    <span>{item.calories} kcal • P: {item.protein_g}g | C: {item.carbs_g}g | F: {item.fat_g}g</span>
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteLog(item.id)}
                  className="px-2 py-0.5 text-[10px] font-bold text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* AI Recommended Diet Plan Section */}
      {plan && plan.meals && plan.meals.length > 0 && (
        <div className="space-y-3 pt-1">
          <h3 className="font-display text-lg font-extrabold flex items-center gap-1.5">
            <span>Your AI Diet Plan</span>
            <Bot className="h-4 w-4 text-accent" />
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plan.meals.map((meal) => (
              <Card key={meal.id} className="!p-4 flex flex-col justify-between h-full space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-ink/10 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-100 border border-ink/20 rounded-lg text-ink">
                        <Utensils className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm">{meal.name}</h4>
                        <p className="text-[9px] font-bold uppercase text-ink/50">{meal.time}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-accent/20 text-ink text-[10px] font-extrabold rounded-md border border-ink/15">
                      {meal.calories} kcal
                    </span>
                  </div>
                  <p className="text-[11px] text-ink/75 leading-relaxed font-medium">{meal.description}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-ink/50 pt-1.5 border-t border-ink/10">
                  <span>P: {meal.protein_g}g</span>
                  <span>C: {meal.carbs_g}g</span>
                  <span>F: {meal.fat_g}g</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
