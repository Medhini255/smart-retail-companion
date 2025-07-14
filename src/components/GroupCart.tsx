import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Plus, 
  Share2, 
  Copy, 
  UserPlus, 
  ShoppingCart, 
  Trash2,
  Crown,
  Clock,
  DollarSign,
  Leaf,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/supabaseClient";
type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  eco?: boolean;
  carbon_score?: number;
  addedAt?: string;
  added_by?: string;
};

type GroupCartProps = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};




export const GroupCart: React.FC<GroupCartProps> = ({ cart, setCart }) => {
  const [cartCode, setCartCode] = useState("FAM123");
  const [newMemberCode, setNewMemberCode] = useState("");
  const [isCartOwner, setIsCartOwner] = useState(true);
  const [groupCartItems, setGroupCartItems] = useState<any[]>([]);
useEffect(() => {
  fetchCartItems(cartCode); // initial load

  const subscription = supabase
    .channel('group-cart-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'group_cart_items',
        filter: `cart_code=eq.${cartCode}`
      },
      (payload) => {
        console.log("Realtime update:", payload);
        fetchCartItems(cartCode); // refresh on change
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}, [cartCode]);

useEffect(() => {
  // Whenever Supabase groupCartItems change, update the parent's cart state
  const mappedCartItems: CartItem[] = groupCartItems.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));
  setCart(mappedCartItems);
}, [groupCartItems]);


  const cartMembers = [
    { 
      id: 1, 
      name: "Madhura", 
      avatar: "M", 
      role: "Owner", 
      status: "online",
      joinedAt: "2 hours ago"
    },
    { 
      id: 2, 
      name: "Priya", 
      avatar: "P", 
      role: "Member", 
      status: "online",
      joinedAt: "1 hour ago"
    },
    { 
      id: 3, 
      name: "Raj", 
      avatar: "R", 
      role: "Member", 
      status: "offline",
      joinedAt: "30 min ago"
    },
    { 
      id: 4, 
      name: "Anita", 
      avatar: "A", 
      role: "Member", 
      status: "online",
      joinedAt: "15 min ago"
    }
  ];

  


  const totalAmount = groupCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = groupCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCarbonSaved = groupCartItems.reduce((sum, item) => sum + (item.carbon_score * item.quantity), 0);
  const amountPerPerson = totalAmount / cartMembers.length;

  const copyCartCode = () => {
    navigator.clipboard.writeText(cartCode);
    // You could add a toast notification here
  };

  const shareCart = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join our Smart Shopping Cart!',
        text: `Join our group shopping cart with code: ${cartCode}`,
        url: window.location.href
      });
    } else {
      copyCartCode();
    }
  };

const fetchCartItems = async (cartCode: string) => {
  const { data, error } = await supabase
    .from("group_cart_items")
    .select("*")
    .eq("cart_code", cartCode);

  if (error) console.error(error);
  else setGroupCartItems(data);
};



const addItemToCart = async (item: any) => {
  const newItem = {
    ...item,
    cart_code: cartCode,
    addedAt: new Date().toISOString(), // Supabase will also set default if skipped
    added_by: "You", // Replace with actual user name
    eco: true,
    carbon_score: item.carbon_score ?? 0,
  };

  const { error } = await supabase.from("group_cart_items").insert([newItem]);

  if (error) console.error("Insert error:", error);
  else fetchCartItems(cartCode);
};


const removeItem = async (itemId: number) => {
  const { error } = await supabase
    .from("group_cart_items")
    .delete()
    .eq("id", itemId);

  if (error) console.error(error);
  else fetchCartItems(cartCode); // refresh
};

const updateQuantity = async (itemId: number, newQty: number) => {
  const { error } = await supabase
    .from("group_cart_items")
    .update({ quantity: newQty })
    .eq("id", itemId);

  if (error) console.error(error);
  else fetchCartItems(cartCode); // refresh
};

  const joinCart = () => {
    if (newMemberCode.trim()) {
      // In real app, this would join the specified cart
      console.log(`Joining cart with code: ${newMemberCode}`);
    }
  };

  const createNewCart = () => {
    const newCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    setCartCode(newCode);
    setIsCartOwner(true);
  };
  const handleAddToCart = (item: CartItem) => {
  setCart((prevCart) => {
    const existingItem = prevCart.find((i) => i.id === item.id);
    if (existingItem) {
      return prevCart.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    }
    return [...prevCart, { ...item, quantity: 1 }];
  });
};

const handleRemoveFromCart = (id: number) => {
  setCart((prevCart) =>
    prevCart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0)
  );
};


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Group Cart</h1>
        <p className="text-muted-foreground">Shop together, save together</p>
      </div>

      {/* Cart Code & Sharing */}
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Cart Code</h3>
              <div className="text-3xl font-bold tracking-wider bg-primary-foreground/20 rounded-lg py-3 px-6 inline-block">
                {cartCode}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={copyCartCode}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={shareCart}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Join Cart Option */}
      {!isCartOwner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Join Another Cart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Enter cart code (e.g., ABC123)"
                value={newMemberCode}
                onChange={(e) => setNewMemberCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button onClick={joinCart} disabled={!newMemberCode.trim()}>
                Join
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cart Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Shopping Together ({cartMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cartMembers.map((member) => (
              <div key={member.id} className="text-center p-3 border rounded-lg">
                <div className="relative inline-block mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                    member.status === 'online' ? 'bg-success' : 'bg-muted'
                  }`}></div>
                  {member.role === 'Owner' && (
                    <Crown className="absolute -top-1 -right-1 h-4 w-4 text-warning" />
                  )}
                </div>
                <p className="font-medium text-sm">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  <Clock className="h-2 w-2 mr-1" />
                  {member.joinedAt}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cart Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
           Cart Items ({totalItems})
          </CardTitle>
        </CardHeader>
        <CardContent>
          
          <div className="space-y-4">
           
            {groupCartItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 bg-gradient-bg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          {item.eco && (
                            <Badge variant="secondary" className="text-success text-xs">
                              <Leaf className="h-2 w-2 mr-1" />
                              Eco
                            </Badge>
                          )}
                          
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-lg font-bold">₹{item.price} × {item.quantity}</p>
                        <p className="text-sm text-muted-foreground">
                          Added by {item.added_by} • {item.addedAt}
                        </p>
                        <p className="text-xs text-success">
                          Carbon: {(item.carbonScore * item.quantity).toFixed(2)}kg CO₂
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            -
                          </Button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cart Summary */}
      <Card className="bg-gradient-accent text-accent-foreground">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cart Summary</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{totalItems}</p>
                <p className="text-sm text-accent-foreground/80">Total Items</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">₹{totalAmount}</p>
                <p className="text-sm text-accent-foreground/80">Total Amount</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">₹{Math.round(amountPerPerson)}</p>
                <p className="text-sm text-accent-foreground/80">Per Person</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{totalCarbonSaved.toFixed(1)}kg</p>
                <p className="text-sm text-accent-foreground/80">CO₂ Impact</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Split */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Split
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cartMembers.map((member, index) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{member.name}</span>
                  {member.role === 'Owner' && (
                    <Crown className="h-4 w-4 text-warning" />
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{Math.round(amountPerPerson)}</p>
                  <div className="flex items-center gap-1">
                    {index % 2 === 0 ? (
                      <>
                        
                      </>
                    ) : (
                      <>
                        
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 space-y-3">
            <Button className="w-full" size="lg">
              <CheckCircle className="h-5 w-5 mr-2" />
              Proceed to Group Checkout
            </Button>

            <Button className="w-full" size="lg">
              <CheckCircle className="h-5 w-5 mr-2" />
              Proceed to Individual Checkout
            </Button>

            <Button variant="outline" className="w-full" onClick={createNewCart}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Group Cart
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Updates */}
      <Card className="bg-gradient-bg">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>Live sync enabled • Last updated: just now</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   Users,
//   Plus,
//   Share2,
//   Copy,
//   UserPlus,
//   ShoppingCart,
//   Trash2,
//   Crown,
//   Clock,
//   DollarSign,
//   Leaf,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";
// import { supabase } from "@/supabaseClient";

// type CartItem = {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   category?: string;
//   eco?: boolean;
//   carbon_score?: number;
//   addedAt?: string;
//   addedBy?: string;
// };

// type GroupCartProps = {
//   cart: CartItem[];
//   setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
// };

// export const GroupCart: React.FC<GroupCartProps> = ({ cart, setCart }) => {
//   const [cartCode, setCartCode] = useState("FAM123");
//   const [newMemberCode, setNewMemberCode] = useState("");
//   const [isCartOwner, setIsCartOwner] = useState(true);
//   const [groupCartItems, setGroupCartItems] = useState<CartItem[]>([]);

//   const cartMembers = [
//     { id: 1, name: "Madhura", avatar: "M", role: "Owner", status: "online", joinedAt: "2 hours ago" },
//     { id: 2, name: "Priya", avatar: "P", role: "Member", status: "online", joinedAt: "1 hour ago" },
//     { id: 3, name: "Raj", avatar: "R", role: "Member", status: "offline", joinedAt: "30 min ago" },
//     { id: 4, name: "Anita", avatar: "A", role: "Member", status: "online", joinedAt: "15 min ago" }
//   ];

//   const totalAmount = groupCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   const totalItems = groupCartItems.reduce((sum, item) => sum + item.quantity, 0);
//   const totalCarbonSaved = groupCartItems.reduce((sum, item) => sum + (item.carbon_score ?? 0) * item.quantity, 0);
//   const amountPerPerson = totalAmount / cartMembers.length;

//   // 🟢 Fetch from Supabase
//   const fetchCartItems = async (code: string) => {
//     const { data, error } = await supabase
//       .from("group_cart_items")
//       .select("*")
//       .eq("cart_code", code);
//     if (error) console.error(error);
//     else setGroupCartItems(data as CartItem[]);
//   };

//   useEffect(() => {
//     fetchCartItems(cartCode);
//     const subscription = supabase
//       .channel("group-cart-changes")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "group_cart_items",
//           filter: `cart_code=eq.${cartCode}`,
//         },
//         () => fetchCartItems(cartCode)
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [cartCode]);

//   useEffect(() => {
//     setCart(groupCartItems);
//   }, [groupCartItems]);

//   // 🟢 Add item with eco + timestamp
//  const addItemToCart = async (item: Omit<CartItem, "id">) => {
//   const newItem = {
//     ...item,
//     cart_code: cartCode,
//     addedAt: new Date().toISOString(), // ✅ call the function
//     addedBy: "You", // Replace with actual username if available
//     eco: true,
//     carbon_score: item.carbon_score ?? 5, // fallback value if missing
//   };

//   const { error } = await supabase.from("group_cart_items").insert([newItem]);
//   if (error) {
//     console.error("Insert error:", error);
//   } else {
//     fetchCartItems(cartCode); // refresh list
//   }
// };


//   const updateQuantity = async (id: number, newQty: number) => {
//     const { error } = await supabase
//       .from("group_cart_items")
//       .update({ quantity: newQty })
//       .eq("id", id);
//     if (error) console.error(error);
//     else fetchCartItems(cartCode);
//   };

//   const removeItem = async (id: number) => {
//     const { error } = await supabase
//       .from("group_cart_items")
//       .delete()
//       .eq("id", id);
//     if (error) console.error(error);
//     else fetchCartItems(cartCode);
//   };

//   const copyCartCode = () => navigator.clipboard.writeText(cartCode);

//   const shareCart = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: "Join our Smart Shopping Cart!",
//         text: `Join our group shopping cart with code: ${cartCode}`,
//         url: window.location.href,
//       });
//     } else {
//       copyCartCode();
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Group Cart Items Display */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <ShoppingCart className="h-5 w-5" />
//             Group Cart Items ({totalItems})
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {groupCartItems.map((item) => (
//               <div key={item.id} className="border rounded-lg p-4">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <h4 className="font-semibold">{item.name}</h4>
//                     <div className="flex gap-2 mt-1">
//                       {item.category && (
//                         <Badge variant="outline" className="text-xs">{item.category}</Badge>
//                       )}
//                       {item.eco && (
//                         <Badge variant="secondary" className="text-success text-xs">
//                           <Leaf className="h-2 w-2 mr-1" /> Eco
//                         </Badge>
//                       )}
//                     </div>
//                     <p className="text-sm text-muted-foreground mt-2">
//                       Added by <strong>{item.addedBy ?? "unknown"}</strong> •{" "}
//                       {item.addedAt ? new Date(item.addedAt).toLocaleString() : "just now"}
//                     </p>
//                     <p className="text-xs text-green-700 mt-1">
//                       Carbon: {(item.carbon_score ?? 0 * item.quantity).toFixed(2)} kg CO₂
//                     </p>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <div className="flex items-center border rounded">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="h-8 w-8 p-0"
//                         onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
//                       >−</Button>
//                       <span className="px-3 text-sm font-medium">{item.quantity}</span>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="h-8 w-8 p-0"
//                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                       >+</Button>
//                     </div>
//                     <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Summary */}
//       <Card className="bg-gradient-accent text-accent-foreground">
//         <CardContent className="p-6">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
//             <div>
//               <p className="text-2xl font-bold">{totalItems}</p>
//               <p className="text-sm">Total Items</p>
//             </div>
//             <div>
//               <p className="text-2xl font-bold">₹{totalAmount}</p>
//               <p className="text-sm">Total Amount</p>
//             </div>
//             <div>
//               <p className="text-2xl font-bold">₹{Math.round(amountPerPerson)}</p>
//               <p className="text-sm">Per Person</p>
//             </div>
//             <div>
//               <p className="text-2xl font-bold">{totalCarbonSaved.toFixed(1)}kg</p>
//               <p className="text-sm">CO₂ Saved</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };
