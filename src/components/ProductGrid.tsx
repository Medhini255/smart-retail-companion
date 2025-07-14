import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Leaf, Eye, ShoppingCart, Zap } from "lucide-react";
import { supabase } from "@/supabaseClient";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  carbonScore: number;
  rating: number;
  image: string;
  category: string;
  ecoFeatures: string[];
  inStock: boolean;
}

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = async (product: Product) => {
    try {
      const { error } = await supabase.from("group_cart_items").insert([
        {
          cart_code: "FAM123",
          name: product.name,
          price: product.price,
          quantity: 1,
          added_by: "You",
          addedAt: new Date().toISOString(),
          category: product.category,
          carbon_score: product.carbonScore ?? 5,
          eco: true,
        }
      ]);

      if (error) {
        console.error("Supabase Error:", error);
        alert("Failed to add to group cart.");
      } else {
        setCart(prev => [...prev, product.id]);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const getCarbonColor = (score: number) => {
    if (score <= 0.3) return "text-success";
    if (score <= 0.6) return "text-warning";
    return "text-destructive";
  };

  const getCarbonLabel = (score: number) => {
    if (score <= 0.3) return "Low Impact";
    if (score <= 0.6) return "Medium Impact";
    return "High Impact";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Card 
          key={product.id} 
          className="group hover:shadow-medium transition-all duration-300 hover:scale-105 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardContent className="p-4">
            <div className="relative mb-4">
              <div className="w-full h-32 bg-gradient-bg rounded-lg flex items-center justify-center text-4xl mb-3">
                {product.image}
              </div>

              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
              >
                <Heart 
                  className={`h-4 w-4 ${
                    favorites.includes(product.id) 
                      ? "fill-red-500 text-red-500" 
                      : "text-muted-foreground"
                  }`} 
                />
              </button>

              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className={getCarbonColor(product.carbonScore)}>
                  <Leaf className="h-3 w-3 mr-1" />
                  {product.carbonScore.toFixed(1)}kg CO₂
                </Badge>
              </div>

              {product.originalPrice > product.price && (
                <div className="absolute bottom-2 left-2">
                  <Badge variant="destructive">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </Badge>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-sm text-foreground line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground">{product.category}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{product.rating}</span>
                </div>
                <Badge variant="outline" className={getCarbonColor(product.carbonScore)}>
                  {getCarbonLabel(product.carbonScore)}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1">
                {product.ecoFeatures.slice(0, 2).map((feature, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs py-0">
                    {feature}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-foreground">
                      ₹{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-success">
                    Save ₹{product.originalPrice - product.price}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant={cart.includes(product.id) ? "eco" : "default"}
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                >
                  {cart.includes(product.id) ? (
                    <>
                      <Zap className="h-3 w-3 mr-1" />
                      Added
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add
                    </>
                  )}
                </Button>
              </div>

              {!product.inStock && (
                <p className="text-xs text-destructive text-center">Out of Stock</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
