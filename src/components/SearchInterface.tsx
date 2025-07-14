import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Search, 
  Filter, 
  Globe,
  Volume2,
  MessageSquare,
  Zap,
  Star,
  Leaf,
  ShoppingCart,
  Eye,
  Heart
} from "lucide-react";

export const SearchInterface = () => {
  const [searchText, setSearchText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [maxBudget, setMaxBudget] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [recognition, setRecognition] = useState<any>(null);
  const [recognitionRef, setRecognitionRef] = useState<any>(null);
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "ml", name: "മലയാളം", flag: "🇮🇳" },
  ];

  const sampleSearches = [
    { text: "दस रुपये के अंदर साबुन", translation: "Soap under 10 rupees", budget: "10" },
    { text: "ಐನೂರು ರೂಪಾಯಿ ಕೆಳಗೆ ಇಕೋ ಫ್ರೆಂಡ್ಲಿ ಪ್ರಾಡಕ್ಟ್", translation: "Eco-friendly products under 500", budget: "500" },
    { text: "सौ रुपये में बाल तेल", translation: "Hair oil under 100 rupees", budget: "100" },
    { text: "ಇನ್ನೂರು ರೂಪಾಯಿ ಕೆಳಗೆ ಮುಖದ ಕ್ರೀಮ್", translation: "Face cream under 200", budget: "200" },
    { text: "पचास रुपये में टूथब्रश", translation: "Toothbrush under 50 rupees", budget: "50" },
    { text: "तीन सौ रुपये में जैविक खाना", translation: "Organic food under 300", budget: "300" },
  ];

  // Extended product database with 15+ products
  const allProducts = [
    {
      id: 1, name: "Organic Neem Soap", price: 85, originalPrice: 120, image: "🧼",
      carbonScore: 0.2, rating: 4.5, category: "Personal Care", ecoFeatures: ["Biodegradable", "Natural"],
      keywords: ["साबुन", "soap", "ಸೋಪ್", "சோப்", "സോപ്പ്", "నీం"]
    },
    {
      id: 2, name: "Bamboo Toothbrush", price: 45, originalPrice: 60, image: "🦷",
      carbonScore: 0.1, rating: 4.7, category: "Personal Care", ecoFeatures: ["Sustainable", "Biodegradable"],
      keywords: ["टूथब्रश", "toothbrush", "ಟೂತ್ಬ್ರಶ್", "பல் துலક்கும் பிரஷ்", "ടൂത്ത്ബ്രഷ്", "టూత్ బ్రష్"]
    },
    {
      id: 3, name: "Herbal Hair Oil", price: 95, originalPrice: 150, image: "🫗",
      carbonScore: 0.25, rating: 4.6, category: "Personal Care", ecoFeatures: ["Natural", "Chemical Free"],
      keywords: ["बाल तेल", "hair oil", "ಕೇಶ ತೈಲ", "முடி எண்ணெய்", "മുടി എണ്ണ", "జుట్టు నూనె"]
    },
    {
      id: 4, name: "Organic Face Cream", price: 180, originalPrice: 250, image: "🧴",
      carbonScore: 0.3, rating: 4.4, category: "Beauty", ecoFeatures: ["Organic", "Cruelty Free"],
      keywords: ["मुख क्रीम", "face cream", "ಮುಖದ ಕ್ರೀಮ್", "முக கிரீம்", "മുഖ ക്രീം", "ముఖ క్రీమ్"]
    },
    {
      id: 5, name: "Eco Laundry Detergent", price: 75, originalPrice: 100, image: "🧽",
      carbonScore: 0.2, rating: 4.3, category: "Household", ecoFeatures: ["Biodegradable", "Eco-Friendly"],
      keywords: ["डिटर्जेंट", "detergent", "ಡಿಟರ್ಜೆಂಟ್", "சலவை பொடி", "ഡിറ്റർജന്റ്", "డిటర్జెంట్"]
    },
    {
      id: 6, name: "Organic Jaggery", price: 65, originalPrice: 90, image: "🍯",
      carbonScore: 0.15, rating: 4.7, category: "Food", ecoFeatures: ["Organic", "Natural Sweetener"],
      keywords: ["गुड़", "jaggery", "ಬೆಲ್ಲ", "வெல्लम्", "ശര्ക്कര", "బెల్లం"]
    },
    {
      id: 7, name: "Steel Water Bottle", price: 120, originalPrice: 180, image: "🍼",
      carbonScore: 0.1, rating: 4.8, category: "Lifestyle", ecoFeatures: ["Reusable", "BPA Free"],
      keywords: ["पानी बोतल", "water bottle", "ನೀರಿನ ಬಾಟಲ್", "தண்ணீர் बोतल", "വാട്ടർ ബോട്ടിൽ", "నీటి సీసా"]
    },
    {
      id: 8, name: "Organic Cotton T-Shirt", price: 250, originalPrice: 400, image: "👕",
      carbonScore: 0.6, rating: 4.2, category: "Clothing", ecoFeatures: ["Organic Cotton", "Fair Trade"],
      keywords: ["टी-शर्ट", "t-shirt", "ಟಿ-ಶರ್ಟ್", "டி-ஷர्ட", "ടി-ഷര്‍ട്ട്", "టి-షర్ట్"]
    },
    {
      id: 9, name: "Natural Body Lotion", price: 110, originalPrice: 160, image: "🧴",
      carbonScore: 0.25, rating: 4.5, category: "Beauty", ecoFeatures: ["Natural", "Moisturizing"],
      keywords: ["बॉडी लोशन", "body lotion", "ಬಾಡಿ ಲೋಶನ್", "உடல் लोशन", "ബോഡി ലോഷന്‍", "బాడీ లోషన్"]
    },
    {
      id: 10, name: "Eco-Friendly Shampoo", price: 135, originalPrice: 200, image: "🧴",
      carbonScore: 0.3, rating: 4.4, category: "Personal Care", ecoFeatures: ["Sulfate Free", "Natural"],
      keywords: ["शैंपू", "shampoo", "ಶಾಂಪೂ", "ஷாம்பู", "ഷാംപൂ", "షాంపూ"]
    },
    {
      id: 11, name: "Organic Coconut Oil", price: 80, originalPrice: 120, image: "🥥",
      carbonScore: 0.2, rating: 4.6, category: "Food", ecoFeatures: ["Cold Pressed", "Organic"],
      keywords: ["नारियल तेल", "coconut oil", "ತೆಂಗಿನಕಾಯಿ ತೈಲ", "தென்गाய் என्ணै", "നാളികേര എണ്ണ", "కొబ్బరి నూనె"]
    },
    {
      id: 12, name: "Bamboo Lunch Box", price: 90, originalPrice: 140, image: "🍱",
      carbonScore: 0.15, rating: 4.3, category: "Kitchen", ecoFeatures: ["Biodegradable", "Food Safe"],
      keywords: ["लंच बॉक्स", "lunch box", "ಲಂಚ್ ಬಾಕ್ಸ್", "लंच् বाक्স्", "ലഞ്ച് ബോക്സ്", "లంచ్ బాక్స్"]
    },
    {
      id: 13, name: "Natural Honey", price: 150, originalPrice: 200, image: "🍯",
      carbonScore: 0.1, rating: 4.7, category: "Food", ecoFeatures: ["Raw", "Unprocessed"],
      keywords: ["शहद", "honey", "ಜೇನುತುಪ್ಪ", "தேன்", "തേന്‍", "తేనె"]
    },
    {
      id: 14, name: "Organic Turmeric Powder", price: 55, originalPrice: 80, image: "🌾",
      carbonScore: 0.1, rating: 4.5, category: "Food", ecoFeatures: ["Organic", "Pure"],
      keywords: ["हल्दी", "turmeric", "ಅರಿಶಿನ", "மञ্জळ्", "മഞ്ഞള്‍", "పసుపు"]
    },
    {
      id: 15, name: "Jute Shopping Bag", price: 35, originalPrice: 60, image: "🛍️",
      carbonScore: 0.05, rating: 4.4, category: "Lifestyle", ecoFeatures: ["Biodegradable", "Reusable"],
      keywords: ["बैग", "bag", "ಚೀಲ", "பை", "ബാഗ്", "సంచి"]
    }
  ];
  const startListening = () => {
    try {
      if (recognitionRef) {
        recognitionRef.stop();
      }

      // Use the correct SpeechRecognition API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error("Speech recognition not supported");
      }

      const recognition = new SpeechRecognition();
      recognition.lang = `${selectedLanguage}-IN`;
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        console.log("Recognized:", transcript);
        setSearchText(transcript);
        performSearch(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      // Store the recognition instance
      setRecognitionRef(recognition);
      
      // Start listening
      recognition.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      setIsListening(false);
    }
    
  };

  const stopListening = () => {
    if (recognitionRef) {
      recognitionRef.stop();
      setRecognitionRef(null);
    }
    setIsListening(false);
  };

  const performSearch = (query: string, budget?: string) => {
    let results = [];
    
    if (query.trim()) {
      // Search by keywords in multiple languages
      results = allProducts.filter(product => {
        const matchesKeyword = product.keywords.some(keyword => 
          keyword.toLowerCase().includes(query.toLowerCase()) ||
          query.toLowerCase().includes(keyword.toLowerCase()) ||
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        
        const matchesBudget = budget ? product.price <= parseInt(budget) : true;
        
        return matchesKeyword && matchesBudget;
      });
    } else {
      // If no search query, show all products within budget
      results = allProducts.filter(product => {
        const matchesBudget = budget ? product.price <= parseInt(budget) : true;
        return matchesBudget;
      });
    }

    // Sort by eco-friendliness (lower carbon score) and price
    results.sort((a, b) => {
      if (a.carbonScore !== b.carbonScore) {
        return a.carbonScore - b.carbonScore; // Lower carbon score first
      }
      return a.price - b.price; // Then by price
    });

    setSearchResults(results.slice(0, 12)); // Show top 12 results
  };

  const handleTextSearch = () => {
    performSearch(searchText, maxBudget);
  };

  const handleSampleSearch = (sample: any) => {
    setSearchText(sample.text);
    if (sample.budget) {
      setMaxBudget(sample.budget);
    }
    performSearch(sample.text, sample.budget);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (productId: number) => {
    setCart(prev => [...prev, productId]);
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

  // Initialize with some default results
  useEffect(() => {
    performSearch("", ""); // Show all products initially
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          🎙️ Smart Voice & Text Search
        </h1>
        <p className="text-muted-foreground">
          Search in your preferred language with budget filtering
        </p>
      </div>

      {/* Language Selector */}
      <Card className="bg-gradient-bg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-5 w-5" />
            Select Language • भाषा चुनें • ಭಾಷೆ ಆಯ್ಕೆ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={selectedLanguage === lang.code ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLanguage(lang.code)}
                className="flex items-center gap-2 justify-start"
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Search Interface */}
      <Card className="shadow-medium">
        <CardContent className="p-6 space-y-6">
          {/* Text Search */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={`Type in ${languages.find(l => l.code === selectedLanguage)?.name}: जैसे "दस रुपये के अंदर साबुन"`}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10 h-12 text-base"
                  onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                />
              </div>
              <Button onClick={handleTextSearch} size="lg" className="px-8">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {/* Budget Filter */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="बजट सीमा • Budget limit (₹)"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="h-10"
                />
              </div>
              <Button variant="outline" onClick={() => performSearch(searchText, maxBudget)}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Voice Search Section */}
          <div className="border-t pt-6">
            <div className="text-center space-y-4">
              <Button
                variant={isListening ? "destructive" : "voice"}
                size="xl"
                onClick={isListening ? stopListening : startListening}
                className={`${isListening ? "animate-pulse-glow" : ""} px-12`}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-6 w-6 mr-3" />
                    🛑 Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-6 w-6 mr-3" />
                    🎤 Start Voice Search
                  </>
                )}
              </Button>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isListening 
                    ? "🔊 Listening... बोलिए • ಮಾತನಾಡಿ • பேசுங்கள்" 
                    : `🎯 Tap to search with voice in ${languages.find(l => l.code === selectedLanguage)?.name}`
                  }
                </p>
                <Badge variant="secondary" className="mt-2">
                  <Zap className="h-3 w-3 mr-1" />
                  AI-Powered Recognition
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Searches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-5 w-5" />
            💡 Try These Examples • उदाहरण • ಉದಾಹರಣೆಗಳು
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleSearches.map((sample, index) => (
              <div
                key={index}
                className="p-4 border rounded-xl cursor-pointer hover:bg-accent/20 hover:shadow-soft transition-all duration-200 bg-gradient-bg"
                onClick={() => handleSampleSearch(sample)}
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="font-semibold text-sm text-primary">{sample.text}</p>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Volume2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{sample.translation}</p>
                {sample.budget && (
                  <Badge variant="secondary" className="text-xs">
                    💰 Budget: ₹{sample.budget}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Search Results */}
      {searchResults.length > 0 && (
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              🎯 Search Results ({searchResults.length}) • खोज परिणाम • ಹುಡುಕಾಟ ಫಲಿತಾಂಶಗಳು
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((product, index) => (
                <div 
                  key={product.id} 
                  className="border rounded-xl p-4 hover:shadow-medium transition-all duration-300 hover:scale-105 bg-gradient-bg animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Product Image & Badges */}
                  <div className="relative mb-4">
                    <div className="text-center mb-3">
                      <div className="text-4xl mb-2">{product.image}</div>
                    </div>
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-0 right-0 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.includes(product.id) 
                            ? "fill-red-500 text-red-500" 
                            : "text-muted-foreground"
                        }`} 
                      />
                    </button>

                    {/* Carbon Score */}
                    <div className="absolute top-0 left-0">
                      <Badge variant="secondary" className={getCarbonColor(product.carbonScore)}>
                        <Leaf className="h-3 w-3 mr-1" />
                        {product.carbonScore.toFixed(1)}kg
                      </Badge>
                    </div>

                    {/* Discount Badge */}
                    {product.originalPrice > product.price && (
                      <div className="absolute bottom-0 right-0">
                        <Badge variant="destructive" className="text-xs">
                          -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm text-foreground mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>

                    {/* Rating & Carbon Label */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{product.rating}</span>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getCarbonColor(product.carbonScore)}`}>
                        {getCarbonLabel(product.carbonScore)}
                      </Badge>
                    </div>

                    {/* Eco Features */}
                    <div className="flex flex-wrap gap-1">
                      {product.ecoFeatures.slice(0, 2).map((feature: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs py-0">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Price */}
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
                        💰 Save ₹{product.originalPrice - product.price}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        AR Try
                      </Button>
                      <Button
                        variant={cart.includes(product.id) ? "eco" : "default"}
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => addToCart(product.id)}
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
                  </div>
                </div>
              ))}
            </div>

            {/* Search Summary */}
            <div className="mt-6 p-4 bg-gradient-success text-success-foreground rounded-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold">{searchResults.length}</p>
                  <p className="text-sm text-success-foreground/80">Products Found</p>
                </div>
                <div>
                  <p className="text-xl font-bold">
                    ₹{Math.min(...searchResults.map(p => p.price))} - ₹{Math.max(...searchResults.map(p => p.price))}
                  </p>
                  <p className="text-sm text-success-foreground/80">Price Range</p>
                </div>
                <div>
                  <p className="text-xl font-bold">
                    {searchResults.filter(p => p.carbonScore <= 0.3).length}
                  </p>
                  <p className="text-sm text-success-foreground/80">Low Carbon</p>
                </div>
                <div>
                  <p className="text-xl font-bold">
                    ₹{searchResults.reduce((sum, p) => sum + (p.originalPrice - p.price), 0)}
                  </p>
                  <p className="text-sm text-success-foreground/80">Total Savings</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {searchResults.length === 0 && searchText && (
        <Card className="text-center p-8">
          <div className="space-y-4">
            <div className="text-4xl">🔍</div>
            <h3 className="font-semibold">No products found</h3>
            <p className="text-muted-foreground">
              Try searching with different keywords or increase your budget limit
            </p>
            <Button variant="outline" onClick={() => performSearch("", "")}>
              Show All Products
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};