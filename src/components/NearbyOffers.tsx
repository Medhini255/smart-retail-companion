import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Star, 
  Percent, 
  Leaf,
  ShoppingBag,
  Phone,
  ExternalLink,
  Map
} from "lucide-react";

export const NearbyOffers = () => {
  const [userLocation, setUserLocation] = useState("Bangalore, India");
  const [selectedRadius, setSelectedRadius] = useState(5);

  const nearbyStores = [
    {
      id: 1,
      name: "Green Valley Organic Store",
      address: "MG Road, Bangalore",
      distance: 1.2,
      rating: 4.8,
      phone: "+91 98765 43210",
      openTill: "21:00",
      offers: [
        { 
          title: "30% Off Organic Soaps", 
          description: "All natural & eco-friendly soaps",
          originalPrice: 120,
          offerPrice: 84,
          category: "Personal Care",
          eco: true,
          validTill: "Today"
        },
        { 
          title: "Buy 2 Get 1 Free Hair Oil", 
          description: "Herbal hair oils - chemical free",
          originalPrice: 200,
          offerPrice: 200,
          category: "Beauty",
          eco: true,
          validTill: "Tomorrow"
        }
      ],
      specialties: ["Organic", "Eco-Friendly", "Zero Waste"],
      image: "🌱"
    },
    {
      id: 2,
      name: "Eco Mart Supermarket",
      address: "Brigade Road, Bangalore",
      distance: 2.1,
      rating: 4.5,
      phone: "+91 98765 43211",
      openTill: "22:00",
      offers: [
        { 
          title: "25% Off Bamboo Products", 
          description: "Toothbrushes, straws, containers",
          originalPrice: 150,
          offerPrice: 112,
          category: "Lifestyle",
          eco: true,
          validTill: "This Week"
        },
        { 
          title: "Organic Food Festival", 
          description: "20% off on all organic food items",
          originalPrice: 300,
          offerPrice: 240,
          category: "Food",
          eco: true,
          validTill: "Weekend"
        }
      ],
      specialties: ["Sustainable", "Local Products", "Bulk Shopping"],
      image: "🛒"
    },
    {
      id: 3,
      name: "Nature's Bounty",
      address: "Koramangala, Bangalore",
      distance: 3.5,
      rating: 4.6,
      phone: "+91 98765 43212",
      openTill: "20:30",
      offers: [
        { 
          title: "Handmade Soap Collection", 
          description: "Artisan soaps with natural ingredients",
          originalPrice: 180,
          offerPrice: 126,
          category: "Personal Care",
          eco: true,
          validTill: "3 Days Left"
        },
        { 
          title: "Eco-Friendly Kitchenware", 
          description: "Steel & bamboo utensils - 40% off",
          originalPrice: 500,
          offerPrice: 300,
          category: "Home",
          eco: true,
          validTill: "Limited Stock"
        }
      ],
      specialties: ["Handmade", "Artisan", "Chemical-Free"],
      image: "🌿"
    },
    {
      id: 4,
      name: "Sustainable Living Co.",
      address: "Indiranagar, Bangalore",
      distance: 4.2,
      rating: 4.7,
      phone: "+91 98765 43213",
      openTill: "21:30",
      offers: [
        { 
          title: "Zero Waste Starter Kit", 
          description: "Complete kit for sustainable living",
          originalPrice: 800,
          offerPrice: 560,
          category: "Lifestyle",
          eco: true,
          validTill: "Flash Sale"
        },
        { 
          title: "Organic Cotton Clothing", 
          description: "Ethically sourced apparel - 35% off",
          originalPrice: 400,
          offerPrice: 260,
          category: "Clothing",
          eco: true,
          validTill: "This Month"
        }
      ],
      specialties: ["Zero Waste", "Ethical", "Fair Trade"],
      image: "♻️"
    },
    {
      id: 5,
      name: "Green Choice Mall",
      address: "Whitefield, Bangalore",
      distance: 8.5,
      rating: 4.4,
      phone: "+91 98765 43214",
      openTill: "22:30",
      offers: [
        { 
          title: "Solar Gadgets Expo", 
          description: "Solar lanterns, chargers - 50% off",
          originalPrice: 600,
          offerPrice: 300,
          category: "Electronics",
          eco: true,
          validTill: "Exhibition"
        },
        { 
          title: "Organic Beauty Range", 
          description: "Natural cosmetics & skincare",
          originalPrice: 350,
          offerPrice: 245,
          category: "Beauty",
          eco: true,
          validTill: "New Launch"
        }
      ],
      specialties: ["Solar Tech", "Natural Beauty", "Green Electronics"],
      image: "🏬"
    }
  ];

  const radiusOptions = [2, 5, 10, 15];

  const getDirections = (address: string, storeName: string) => {
    // Real Google Maps directions link
    const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address + ', ' + storeName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(directionsUrl, '_blank');
  };

  const openMapView = (address: string, storeName: string) => {
    // Open in Google Maps app or browser
    const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address + ', ' + storeName)}`;
    window.open(mapsUrl, '_blank');
  };

  const callStore = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const filteredStores = nearbyStores.filter(store => store.distance <= selectedRadius);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Nearby Eco Offers</h1>
        <p className="text-muted-foreground">Discover sustainable deals near you</p>
      </div>

      {/* Location & Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">{userLocation}</span>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Search Radius</label>
              <div className="flex gap-2">
                {radiusOptions.map((radius) => (
                  <Button
                    key={radius}
                    variant={selectedRadius === radius ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRadius(radius)}
                  >
                    {radius} km
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card className="bg-gradient-bg">
        <CardContent className="p-6">
          <div className="h-48 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-success/10"></div>
            <div className="relative text-center">
              <Map className="h-12 w-12 mx-auto mb-3 text-primary" />
              <p className="text-sm font-medium">Interactive Map View</p>
              <p className="text-xs text-muted-foreground">
                {filteredStores.length} eco-friendly stores within {selectedRadius}km
              </p>
            </div>
            
            {/* Mock location pins */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-destructive rounded-full animate-bounce-subtle"></div>
            <div className="absolute top-8 right-8 w-3 h-3 bg-success rounded-full animate-bounce-subtle" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-6 left-12 w-3 h-3 bg-warning rounded-full animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
          </div>
        </CardContent>
      </Card>

      {/* Stores List */}
      <div className="space-y-4">
        {filteredStores.map((store, index) => (
          <Card key={store.id} className="hover:shadow-medium transition-shadow animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Store Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{store.image}</div>
                    <div>
                      <h3 className="font-bold text-lg">{store.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {store.address} • {store.distance}km away
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{store.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-success">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">Open till {store.openTill}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => callStore(store.phone)}>
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => getDirections(store.address, store.name)}>
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Store Specialties */}
                <div className="flex flex-wrap gap-2">
                  {store.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-success">
                      <Leaf className="h-3 w-3 mr-1" />
                      {specialty}
                    </Badge>
                  ))}
                </div>

                {/* Offers */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Percent className="h-4 w-4 text-accent" />
                    Current Offers ({store.offers.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {store.offers.map((offer, offerIdx) => (
                      <div key={offerIdx} className="border rounded-lg p-4 bg-gradient-bg">
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-semibold text-sm">{offer.title}</h5>
                            <p className="text-xs text-muted-foreground">{offer.description}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">₹{offer.offerPrice}</span>
                            {offer.originalPrice !== offer.offerPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ₹{offer.originalPrice}
                              </span>
                            )}
                            <Badge variant="outline" className="text-success">
                              <Leaf className="h-3 w-3 mr-1" />
                              {offer.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-warning">
                              <Clock className="h-3 w-3 mr-1" />
                              {offer.validTill}
                            </Badge>
                            <Button size="sm" variant="eco">
                              <ShoppingBag className="h-3 w-3 mr-1" />
                              Reserve
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="bg-gradient-success text-success-foreground">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{filteredStores.length}</p>
              <p className="text-sm text-success-foreground/80">Eco Stores</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{filteredStores.reduce((acc, store) => acc + store.offers.length, 0)}</p>
              <p className="text-sm text-success-foreground/80">Active Offers</p>
            </div>
            <div>
              <p className="text-2xl font-bold">45%</p>
              <p className="text-sm text-success-foreground/80">Avg Discount</p>
            </div>
            <div>
              <p className="text-2xl font-bold">2.8kg</p>
              <p className="text-sm text-success-foreground/80">CO₂ Saved</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};