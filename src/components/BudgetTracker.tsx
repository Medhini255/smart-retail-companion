import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  PieChart,
  Target,
  Leaf,
  ShoppingBag,
  Calendar
} from "lucide-react";
import { supabase } from "@/supabaseClient";
import { formatRelative } from 'date-fns';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  eco?: boolean;
  carbon_score?: number;
  original_price?: number;
  addedAt?: string;
}

type EcoImpact = {
  co2Saved: number;
  moneySaved: number;
  plasticAvoided: number;
  treesPlanted: number;
};

type RecentTransaction = {
  id: number;
  item: string;
  amount: number;
  date: string;
  eco: boolean;
};

type BudgetTrackerProps = {
  cart: CartItem[];
  monthlyBudget: number;
  setMonthlyBudget: (value: number) => void;
};

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  monthlyBudget,
  setMonthlyBudget,
  
}) => {
  const [groupCartItems, setGroupCartItems] = useState<CartItem[]>([]);
  const [cartCode, setCartCode] = useState("FAM123");
  const [newBudget, setNewBudget] = useState(monthlyBudget);


  const currentSpent = groupCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const remaining = monthlyBudget - currentSpent;
  const spentPercentage = (currentSpent / monthlyBudget) * 100;


  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const { data, error } = await supabase
      .from("group_cart_items")
      .select("*")
      .eq("cart_code", cartCode)
      .order("addedAt", { ascending: false });

    if (error) console.error("Fetch error:", error);
    else setGroupCartItems(data as CartItem[]);
  };

  useEffect(() => {
  const savedBudget = localStorage.getItem("monthlyBudget");
  if (savedBudget) {
    setMonthlyBudget(Number(savedBudget));
  }
}, []);

const handleBudgetChange = (value: number) => {
  setMonthlyBudget(value);
  localStorage.setItem("monthlyBudget", value.toString());
};

  const ecoImpact: EcoImpact = {
    co2Saved: groupCartItems.reduce(
      (sum, item) => sum + ((10 - (item.carbon_score ?? 0)) * item.quantity),
      0
    ),
    moneySaved: groupCartItems.reduce((sum, item) => {
      const discount = item.original_price
        ? (item.original_price - item.price) * item.quantity
        : 0;
      return sum + discount;
    }, 0),
    plasticAvoided: groupCartItems.filter((item) => item.eco).length * 2,
    treesPlanted: Math.floor(groupCartItems.length / 5),
  };

  const recentTransactions: RecentTransaction[] = groupCartItems.slice(0, 4).map((item) => ({
    id: item.id,
    item: item.name,
    amount: item.price * item.quantity,
    date: item.addedAt ? formatRelative(new Date(item.addedAt), new Date()) : '',
    eco: item.eco ?? false,
  }));

  const getBudgetStatus = () => {
    if (spentPercentage <= 70) return { color: "text-success", icon: CheckCircle, message: "Great! You're on track" };
    if (spentPercentage <= 90) return { color: "text-warning", icon: AlertTriangle, message: "Getting close to limit" };
    return { color: "text-destructive", icon: AlertTriangle, message: "Over budget!" };
  };

  const status = getBudgetStatus();

  return (
    <div className="space-y-6">
      {/* Budget Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Budget Tracker</h1>
        <p className="text-muted-foreground">Smart spending with eco-consciousness</p>
      </div>

      {/* Budget Overview */}
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-primary-foreground/80 text-sm">Monthly Budget</p>
              <p className="text-3xl font-bold">₹{monthlyBudget.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-primary-foreground/80 text-sm">Remaining</p>
              <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-300' : ''}`}>
                ₹{Math.abs(remaining).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Progress value={Math.min(spentPercentage, 100)} className="h-3 bg-primary-foreground/20" />
            <div className="flex items-center justify-between text-sm">
              <span>Spent: ₹{currentSpent.toLocaleString()} ({spentPercentage.toFixed(1)}%)</span>
              <div className="flex items-center gap-2">
                <status.icon className={`h-4 w-4 ${status.color}`} />
                <span className={status.color}>{status.message}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eco Impact Section */}
      <Card className="bg-gradient-success text-success-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Your Eco Impact This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{ecoImpact.co2Saved.toFixed(1)}kg</p>
              <p className="text-sm text-success-foreground/80">CO₂ Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">₹{ecoImpact.moneySaved.toFixed(0)}</p>
              <p className="text-sm text-success-foreground/80">Money Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{ecoImpact.plasticAvoided}</p>
              <p className="text-sm text-success-foreground/80">Plastic Items Avoided</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{ecoImpact.treesPlanted}</p>
              <p className="text-sm text-success-foreground/80">Trees Planted</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Eco-Purchases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div>
                    <p className="font-medium text-sm">{transaction.item}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{transaction.amount}</p>
                  {transaction.eco && (
                    <Badge variant="outline" className="text-xs text-success">
                      <Leaf className="h-2 w-2 mr-1" />
                      Eco
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Input */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Monthly Budget (₹)</label>
              <Input
  type="number"
  value={newBudget}
  onChange={(e) => setNewBudget(Number(e.target.value))}
  className="mt-1"
/>

<Button 
  variant="outline" 
  className="w-full"
  onClick={() => handleBudgetChange(newBudget)} // ← save and set
>
  <Wallet className="h-4 w-4 mr-2" />
  Update Budget
</Button>
</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};