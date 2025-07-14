import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Mic, 
  ShoppingCart, 
  Leaf, 
  Wallet, 
  Users, 
  MapPin, 
  Heart,
  Zap,
  TrendingUp,
  Star,
  Globe,
  Eye
} from "lucide-react";
import { SearchInterface } from "@/components/SearchInterface";
import { ProductGrid } from "@/components/ProductGrid";
import { BudgetTracker } from "@/components/BudgetTracker";
import { NearbyOffers } from "@/components/NearbyOffers";
import { GroupCart } from "@/components/GroupCart";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};


const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
const [groupCart, setGroupCart] = useState<CartItem[]>([]);

  const currentSpent = groupCart.reduce((total, item) => total + item.price * item.quantity, 0);
const [monthlyBudget, setMonthlyBudget] = useState(3000);

  

  // Sample eco-friendly products data
  const ecoProducts = [
    {
      id: 1,
      name: "Organic Neem Soap",
      price: 85,
      originalPrice: 120,
      carbonScore: 0.2,
      rating: 4.5,
      image: "🧼",
      category: "Personal Care",
      ecoFeatures: ["Biodegradable", "Zero Plastic"],
      inStock: true
    },
    {
      id: 2,
      name: "Bamboo Toothbrush",
      price: 45,
      originalPrice: 60,
      carbonScore: 0.1,
      rating: 4.7,
      image: "🦷",
      category: "Personal Care",
      ecoFeatures: ["Biodegradable", "Sustainable"],
      inStock: true
    },
    {
      id: 3,
      name: "Organic Cotton T-Shirt",
      price: 299,
      originalPrice: 499,
      carbonScore: 0.8,
      rating: 4.3,
      image: "👕",
      category: "Clothing",
      ecoFeatures: ["Organic", "Fair Trade"],
      inStock: true
    },
    {
      id: 4,
      name: "Reusable Steel Bottle",
      price: 195,
      originalPrice: 250,
      carbonScore: 0.3,
      rating: 4.8,
      image: "🍼",
      category: "Lifestyle",
      ecoFeatures: ["Reusable", "BPA Free"],
      inStock: true
    },
    {
      id: 5,
      name: "Organic Jaggery",
      price: 75,
      originalPrice: 90,
      carbonScore: 0.15,
      rating: 4.6,
      image: "🍯",
      category: "Food",
      ecoFeatures: ["Organic", "Chemical Free"],
      inStock: true
    },
    {
      id: 6,
      name: "Jute Shopping Bag",
      price: 120,
      originalPrice: 180,
      carbonScore: 0.1,
      rating: 4.4,
      image: "🛍️",
      category: "Lifestyle",
      ecoFeatures: ["Biodegradable", "Reusable"],
      inStock: true
    },
    {
      id: 7,
      name: "Herbal Hair Oil",
      price: 145,
      originalPrice: 200,
      carbonScore: 0.25,
      rating: 4.5,
      image: "🫗",
      category: "Personal Care",
      ecoFeatures: ["Natural", "Chemical Free"],
      inStock: true
    },
    {
      id: 8,
      name: "Eco Laundry Detergent",
      price: 89,
      originalPrice: 120,
      carbonScore: 0.3,
      rating: 4.2,
      image: "🧽",
      category: "Household",
      ecoFeatures: ["Biodegradable", "Eco-Friendly"],
      inStock: true
    },
    {
      id: 9,
      name: "Organic Face Cream",
      price: 250,
      originalPrice: 350,
      carbonScore: 0.4,
      rating: 4.6,
      image: "🧴",
      category: "Beauty",
      ecoFeatures: ["Organic", "Cruelty Free"],
      inStock: true
    },
    {
      id: 10,
      name: "Solar LED Lantern",
      price: 399,
      originalPrice: 599,
      carbonScore: 0.1,
      rating: 4.7,
      image: "🔦",
      category: "Electronics",
      ecoFeatures: ["Solar Powered", "Energy Efficient"],
      inStock: true
    }
  ];

  const features = [
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Eco-Friendly",
      description: "Carbon footprint tracking",
      color: "success"
    },
    {
      icon: <Wallet className="h-6 w-6" />,
      title: "Budget Smart",
      description: "Spend within limits",
      color: "warning"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multilingual",
      description: "Voice & text search",
      color: "primary"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Group Shopping",
      description: "Shop with family",
      color: "accent"
    }
  ];
const handleBudgetChange = (value: number) => {
  setMonthlyBudget(value);
  localStorage.setItem("monthlyBudget", value.toString());
};

  const renderContent = () => {
    switch (activeTab) {
      case "search":
        return <SearchInterface />;


case "cart":
  return <GroupCart cart={groupCart} setCart={setGroupCart} />;

case "budget":
  return (
    <BudgetTracker
      cart={groupCart}
      monthlyBudget={monthlyBudget}
      setMonthlyBudget={handleBudgetChange}
    />
  );


      case "offers":
        return <NearbyOffers />;
      
      default:
        return (
          
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative bg-gradient-bg rounded-2xl p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-success/10 rounded-full translate-y-8 -translate-x-8"></div>
              
              <div className="relative z-10">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Smart Retail Companion
                </h1>
                <p className="text-muted-foreground text-lg mb-6">
                  Eco-friendly • Budget-smart • Multilingual • Social
                </p>
                
                {/* Search Bar */}
                <div className="flex gap-3 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search products... (Type or speak in Hindi/English)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                  <Button 
                    variant="voice" 
                    size="icon-lg"
                    onClick={() => setActiveTab("search")}
                    className={isListening ? "animate-pulse-glow" : ""}
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {features.map((feature, index) => (
                    <div 
                      key={index}
                      className="bg-card/80 backdrop-blur-sm rounded-xl p-4 text-center animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`mx-auto w-12 h-12 rounded-full bg-${feature.color}/10 flex items-center justify-center mb-3`}>
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Eco-Friendly Picks</h2>
                <Badge variant="secondary" className="text-success">
                  <Leaf className="h-3 w-3 mr-1" />
                  Low Carbon Impact
                </Badge>
              </div>
              
              <ProductGrid products={ecoProducts} />
            </div>


            </div>
        );
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Smart Retail</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-primary">
                <Zap className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>
            
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            {[
              { id: "home", icon: ShoppingCart, label: "Home" },
              { id: "search", icon: Search, label: "Search" },
              { id: "budget", icon: Wallet, label: "Budget" },
              { id: "cart", icon: Users, label: "Cart" },
              { id: "offers", icon: MapPin, label: "Offers" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Padding for Fixed Nav */}
      <div className="h-20"></div>
    </div>
  );
};

export default Index;
