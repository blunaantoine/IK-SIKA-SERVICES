"use client";

import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  Bike, 
  Users, 
  Package,
  DollarSign,
  Calendar,
  Phone,
  MapPin,
  RefreshCw,
  Home,
  KeyRound,
  Menu,
  X,
  CheckCircle,
  Truck,
  Clock,
  Shield,
  ArrowRight,
  Mail,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Search,
  Wrench,
  UserCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Types
type MotoState = "ACTIVE" | "BROKEN" | "MAINTENANCE" | "RENTED";
type LivreurStatus = "ACTIVE" | "INACTIVE";
type ContractType = "CDD" | "CDI" | "FREELANCE";
type LocationStatus = "ACTIVE" | "COMPLETED" | "CANCELLED";
type UserRole = "ADMIN" | "ASSISTANT";

interface Moto {
  id: string;
  number: string;
  name: string | null;
  purchaseDate: Date | null;
  state: MotoState;
  lastRevision: Date | null;
  nextRevision: Date | null;
}

interface Livreur {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  startDate: Date | null;
  contractType: ContractType;
  motoId: string | null;
  status: LivreurStatus;
  moto?: Moto | null;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string | null;
  idCardNumber: string | null;
}

interface Location {
  id: string;
  clientId: string;
  motoId: string;
  startDate: Date;
  endDate: Date | null;
  dailyRate: number;
  depositAmount: number | null;
  status: LocationStatus;
  notes: string | null;
  client?: Client;
  moto?: Moto;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

// ============================================
// LANDING PAGE (Public)
// ============================================
function LandingPage({ onLoginClick }: { onLoginClick: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const services = [
    { icon: <Truck className="w-8 h-8 text-[#4CAF50]" />, title: "Livraison", description: "Service de livraison rapide et fiable à travers tout Lomé et ses environs" },
    { icon: <Bike className="w-8 h-8 text-[#4CAF50]" />, title: "Location de Motos", description: "Louez des motos en bon état à des tarifs compétitifs pour vos déplacements" },
    { icon: <Package className="w-8 h-8 text-[#4CAF50]" />, title: "Transport de Colis", description: "Transport sécurisé de vos colis et marchandises avec suivi en temps réel" }
  ];

  const advantages = [
    { icon: <Clock className="w-5 h-5" />, text: "Rapidité garantie" },
    { icon: <Shield className="w-5 h-5" />, text: "Sécurité assurée" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Prix compétitifs" },
    { icon: <Phone className="w-5 h-5" />, text: "Disponible 7j/7" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png?v=2" 
                alt="IK-SIKA SERVICES" 
                width={250} 
                height={80}
                className="h-20 w-auto"
                priority
              />
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-600 hover:text-[#4CAF50] transition-colors">Services</a>
              <a href="#about" className="text-gray-600 hover:text-[#4CAF50] transition-colors">À propos</a>
              <a href="#contact" className="text-gray-600 hover:text-[#4CAF50] transition-colors">Contact</a>
              <Button onClick={onLoginClick} className="bg-[#4CAF50] hover:bg-[#388E3C]">Espace Admin</Button>
            </nav>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#services" className="block py-2 text-gray-600">Services</a>
              <a href="#about" className="block py-2 text-gray-600">À propos</a>
              <a href="#contact" className="block py-2 text-gray-600">Contact</a>
              <Button onClick={onLoginClick} className="w-full bg-[#4CAF50] hover:bg-[#388E3C]">Espace Admin</Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-[#4CAF50]/10 text-[#4CAF50] mb-4">Livraison & Location de Motos à Lomé</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Votre partenaire de <span className="text-[#4CAF50]">confiance</span> pour la livraison et la location
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                IK-SIKA SERVICES vous offre des solutions de livraison rapide et de location de motos adaptées à vos besoins. Plus de 5 ans d&apos;expérience au service de la population togolaise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#contact"><Button size="lg" className="bg-[#4CAF50] hover:bg-[#388E3C] w-full sm:w-auto">Nous contacter<ArrowRight className="w-4 h-4 ml-2" /></Button></a>
                <a href="#services"><Button size="lg" variant="outline" className="w-full sm:w-auto">Découvrir nos services</Button></a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#4CAF50]/10 rounded-3xl p-8 lg:p-12">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-lg"><div className="text-3xl font-bold text-[#4CAF50]">500+</div><div className="text-gray-600">Livraisons/mois</div></div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg"><div className="text-3xl font-bold text-[#4CAF50]">20+</div><div className="text-gray-600">Motos disponibles</div></div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg"><div className="text-3xl font-bold text-[#4CAF50]">5+</div><div className="text-gray-600">Années d&apos;expérience</div></div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg"><div className="text-3xl font-bold text-[#4CAF50]">100%</div><div className="text-gray-600">Clients satisfaits</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-[#4CAF50]/10 text-[#4CAF50] mb-4">Nos Services</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Ce que nous vous offrons</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Des solutions complètes pour tous vos besoins de livraison et de mobilité urbaine</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-[#4CAF50]/10 text-[#4CAF50] mb-4">Pourquoi nous choisir ?</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">La qualité de service au cœur de notre engagement</h2>
              <p className="text-lg text-gray-600 mb-8">Chez IK-SIKA SERVICES, nous mettons un point d&apos;honneur à vous fournir un service irréprochable.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {advantages.map((adv, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-[#4CAF50]">{adv.icon}</div>
                    <span className="font-medium text-gray-900">{adv.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#4CAF50] rounded-3xl p-8 lg:p-12 text-white">
              <h3 className="text-2xl font-bold mb-6">Besoin d&apos;une livraison rapide ?</h3>
              <p className="mb-6 opacity-90">Contactez-nous dès maintenant pour un devis gratuit ou pour réserver une moto.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><Phone className="w-5 h-5" /><span className="text-lg">+228 90 00 00 00</span></div>
                <div className="flex items-center gap-3"><Mail className="w-5 h-5" /><span className="text-lg">contact@ik-sika.com</span></div>
                <div className="flex items-center gap-3"><MapPin className="w-5 h-5" /><span className="text-lg">Lomé, Togo</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-[#4CAF50]/10 text-[#4CAF50] mb-4">À Propos</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">IK-SIKA SERVICES, votre partenaire de confiance</h2>
            <p className="text-lg text-gray-600 mb-8">Fondée avec la vision de moderniser les services de livraison au Togo, IK-SIKA SERVICES s&apos;est rapidement imposée comme un acteur incontournable dans le secteur du transport et de la logistique à Lomé.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-[#4CAF50]/10 text-[#4CAF50] mb-4">Contact</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-4"><Phone className="w-7 h-7 text-[#4CAF50]" /></div>
                <h3 className="font-semibold text-gray-900 mb-2">Téléphone</h3>
                <p className="text-gray-600">+228 90 00 00 00</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-4"><Mail className="w-7 h-7 text-[#4CAF50]" /></div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">contact@ik-sika.com</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-4"><MapPin className="w-7 h-7 text-[#4CAF50]" /></div>
                <h3 className="font-semibold text-gray-900 mb-2">Adresse</h3>
                <p className="text-gray-600">Lomé, Togo</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Image 
              src="/logo.png?v=2" 
              alt="IK-SIKA SERVICES" 
              width={250} 
              height={80}
              className="h-20 w-auto"
            />
            <p className="text-gray-400 text-sm">© 2024 IK-SIKA SERVICES. Tous droits réservés.</p>
            <Button onClick={onLoginClick} variant="outline" className="border-gray-700 text-white hover:bg-gray-800">Espace Admin</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// LOGIN PAGE
// ============================================
function LoginPage({ onBackClick }: { onBackClick: () => void }) {
  const [mode, setMode] = useState<"login" | "register" | "forgot-password">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      });

      if (res.ok) {
        window.location.reload();
      } else {
        toast({ title: "Erreur", description: "Email ou mot de passe incorrect", variant: "destructive" });
        setLoading(false);
      }
    } catch {
      toast({ title: "Erreur", description: "Erreur de connexion", variant: "destructive" });
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas", variant: "destructive" });
      return;
    }

    if (password.length < 6) {
      toast({ title: "Erreur", description: "Le mot de passe doit contenir au moins 6 caractères", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({ title: "Succès", description: "Compte créé avec succès ! Vous pouvez maintenant vous connecter." });
        setMode("login");
        setPassword("");
        setConfirmPassword("");
      } else {
        toast({ title: "Erreur", description: data.error || "Erreur lors de l'inscription", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erreur", description: "Erreur lors de l'inscription", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setResetSent(true);
        if (data.resetToken) {
          setResetToken(data.resetToken);
        }
        toast({ title: "Succès", description: "Si ce compte existe, vous recevrez un email de réinitialisation" });
      } else {
        toast({ title: "Erreur", description: data.error || "Erreur lors de la demande", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erreur", description: "Erreur lors de la demande", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas", variant: "destructive" });
      return;
    }

    if (newPassword.length < 6) {
      toast({ title: "Erreur", description: "Le mot de passe doit contenir au moins 6 caractères", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({ title: "Succès", description: "Mot de passe réinitialisé avec succès !" });
        setMode("login");
        setResetToken("");
        setNewPassword("");
        setConfirmNewPassword("");
        setResetSent(false);
      } else {
        toast({ title: "Erreur", description: data.error || "Erreur lors de la réinitialisation", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erreur", description: "Erreur lors de la réinitialisation", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-4">
          <Button variant="ghost" className="absolute top-4 left-4" onClick={onBackClick}>
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />Retour
          </Button>
          <Image 
            src="/logo.png?v=2" 
            alt="IK-SIKA SERVICES" 
            width={280} 
            height={100}
            className="mx-auto h-28 w-auto"
          />
          <CardDescription>
            {mode === "login" && "Connexion à votre compte"}
            {mode === "register" && "Créer un nouveau compte"}
            {mode === "forgot-password" && "Réinitialiser le mot de passe"}
          </CardDescription>
        </CardHeader>
        
        {/* Tabs - only show for login/register */}
        {mode !== "forgot-password" && (
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === "login" ? "text-[#4CAF50] border-b-2 border-[#4CAF50]" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setMode("login")}
            >
              Connexion
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === "register" ? "text-[#4CAF50] border-b-2 border-[#4CAF50]" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setMode("register")}
            >
              Inscription
            </button>
          </div>
        )}

        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="pr-10" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <button type="button" className="text-sm text-[#4CAF50] hover:underline" onClick={() => { setMode("forgot-password"); setResetSent(false); }}>
                  Mot de passe oublié ?
                </button>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#388E3C]" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </CardFooter>
          </form>
        )}

        {mode === "register" && (
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" type="text" placeholder="Votre nom" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input id="register-email" type="email" placeholder="email@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Mot de passe</Label>
                <div className="relative">
                  <Input id="register-password" type={showPassword ? "text" : "password"} placeholder="Min. 6 caractères" value={password} onChange={(e) => setPassword(e.target.value)} required className="pr-10" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="pr-10" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#388E3C]" disabled={loading}>
                {loading ? "Création..." : "Créer mon compte"}
              </Button>
            </CardFooter>
          </form>
        )}

        {mode === "forgot-password" && !resetSent && (
          <form onSubmit={handleForgotPassword}>
            <CardContent className="space-y-4 pt-6">
              <p className="text-sm text-gray-600">Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email</Label>
                <Input id="forgot-email" type="email" placeholder="email@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#388E3C]" disabled={loading}>
                {loading ? "Envoi..." : "Envoyer le lien"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => setMode("login")}>
                Retour à la connexion
              </Button>
            </CardFooter>
          </form>
        )}

        {mode === "forgot-password" && resetSent && (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4 pt-6">
              <p className="text-sm text-gray-600">Un lien de réinitialisation a été généré. Entrez votre nouveau mot de passe.</p>
              <div className="space-y-2">
                <Label htmlFor="reset-token">Token de réinitialisation</Label>
                <Input id="reset-token" type="text" placeholder="Token" value={resetToken} onChange={(e) => setResetToken(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input id="new-password" type={showNewPassword ? "text" : "password"} placeholder="Min. 6 caractères" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="pr-10" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirmer le nouveau mot de passe</Label>
                <div className="relative">
                  <Input id="confirm-new-password" type={showConfirmNewPassword ? "text" : "password"} placeholder="••••••••" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required className="pr-10" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                    {showConfirmNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#388E3C]" disabled={loading}>
                {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => { setMode("login"); setResetSent(false); }}>
                Retour à la connexion
              </Button>
            </CardFooter>
          </form>
        )}
        
        {mode !== "forgot-password" && (
          <div className="px-6 pb-6">
            <p className="text-xs text-center text-gray-400">IK-SIKA SERVICES © 2024</p>
          </div>
        )}
      </Card>
    </div>
  );
}

// ============================================
// DASHBOARD COMPONENTS
// ============================================

function DashboardTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(setData)
      .catch(() => toast({ title: "Erreur", description: "Impossible de charger les données", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="w-8 h-8 animate-spin text-[#4CAF50]" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center gap-4"><div className="p-3 bg-green-100 rounded-full"><Users className="w-6 h-6 text-[#4CAF50]" /></div><div><p className="text-sm text-muted-foreground">Livreurs Actifs</p><p className="text-2xl font-bold">{data?.activeDrivers || 0}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center gap-4"><div className="p-3 bg-blue-100 rounded-full"><Bike className="w-6 h-6 text-blue-600" /></div><div><p className="text-sm text-muted-foreground">Motos Disponibles</p><p className="text-2xl font-bold">{data?.availableMotos || 0}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center gap-4"><div className="p-3 bg-orange-100 rounded-full"><Package className="w-6 h-6 text-orange-600" /></div><div><p className="text-sm text-muted-foreground">Livraisons Aujourd&apos;hui</p><p className="text-2xl font-bold">{data?.todayDeliveries || 0}</p></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center gap-4"><div className="p-3 bg-purple-100 rounded-full"><DollarSign className="w-6 h-6 text-purple-600" /></div><div><p className="text-sm text-muted-foreground">Montant Aujourd&apos;hui</p><p className="text-2xl font-bold">{(data?.todayAmount || 0).toLocaleString("fr-FR")} FCFA</p></div></div></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Tendance des Livraisons (7 jours)</CardTitle></CardHeader>
          <CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={data?.trendData || []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="deliveries" stroke="#4CAF50" strokeWidth={2} /></LineChart></ResponsiveContainer></div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Alertes</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg"><div className="p-2 bg-red-100 rounded-full"><Wrench className="w-5 h-5 text-red-600" /></div><div><p className="font-medium">{data?.alerts?.brokenMotos || 0}</p><p className="text-sm text-muted-foreground">Motos en panne</p></div></div>
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg"><div className="p-2 bg-yellow-100 rounded-full"><RefreshCw className="w-5 h-5 text-yellow-600" /></div><div><p className="font-medium">{data?.alerts?.maintenanceMotos || 0}</p><p className="text-sm text-muted-foreground">En maintenance</p></div></div>
              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg"><div className="p-2 bg-orange-100 rounded-full"><Calendar className="w-5 h-5 text-orange-600" /></div><div><p className="font-medium">{data?.alerts?.upcomingRevisions || 0}</p><p className="text-sm text-muted-foreground">Révisions à venir</p></div></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MotosTab() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ number: "", name: "", purchaseDate: "", state: "ACTIVE" as MotoState });

  const fetchMotos = useCallback(() => {
    fetch("/api/motos").then(res => res.json()).then(setMotos).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchMotos(); }, [fetchMotos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = selectedMoto ? `/api/motos/${selectedMoto.id}` : "/api/motos";
    const method = selectedMoto ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    if (res.ok) { toast({ title: "Succès", description: selectedMoto ? "Moto modifiée" : "Moto créée" }); fetchMotos(); setDialogOpen(false); setFormData({ number: "", name: "", purchaseDate: "", state: "ACTIVE" }); setSelectedMoto(null); }
  };

  const handleDelete = async () => {
    if (!selectedMoto) return;
    const res = await fetch(`/api/motos/${selectedMoto.id}`, { method: "DELETE" });
    if (res.ok) { toast({ title: "Succès", description: "Moto supprimée" }); fetchMotos(); setDeleteDialogOpen(false); setSelectedMoto(null); }
  };

  const openEditDialog = (moto: Moto) => {
    setSelectedMoto(moto);
    setFormData({ number: moto.number, name: moto.name || "", purchaseDate: moto.purchaseDate ? new Date(moto.purchaseDate).toISOString().split("T")[0] : "", state: moto.state });
    setDialogOpen(true);
  };

  if (loading) return <div className="flex justify-center p-8"><RefreshCw className="w-8 h-8 animate-spin text-[#4CAF50]" /></div>;

  const getStateBadge = (state: MotoState) => {
    const styles: Record<MotoState, string> = { ACTIVE: "bg-green-100 text-green-800", BROKEN: "bg-red-100 text-red-800", MAINTENANCE: "bg-yellow-100 text-yellow-800", RENTED: "bg-blue-100 text-blue-800" };
    const labels: Record<MotoState, string> = { ACTIVE: "Actif", BROKEN: "En panne", MAINTENANCE: "Maintenance", RENTED: "Louée" };
    return <Badge className={styles[state]}>{labels[state]}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div>
        <Button onClick={() => { setFormData({ number: "", name: "", purchaseDate: "", state: "ACTIVE" }); setSelectedMoto(null); setDialogOpen(true); }} className="bg-[#4CAF50] hover:bg-[#388E3C]"><Plus className="w-4 h-4 mr-2" />Nouvelle Moto</Button>
      </div>
      <Card><CardContent className="p-0"><ScrollArea className="h-96"><Table><TableHeader><TableRow><TableHead>Numéro</TableHead><TableHead>Nom</TableHead><TableHead>État</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{motos.filter(m => m.number.toLowerCase().includes(searchTerm.toLowerCase())).map((moto) => (<TableRow key={moto.id}><TableCell className="font-medium">{moto.number}</TableCell><TableCell>{moto.name || "-"}</TableCell><TableCell>{getStateBadge(moto.state)}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-2"><Button size="sm" variant="ghost" onClick={() => openEditDialog(moto)}><Pencil className="w-4 h-4" /></Button><Button size="sm" variant="ghost" className="text-red-600" onClick={() => { setSelectedMoto(moto); setDeleteDialogOpen(true); }}><Trash2 className="w-4 h-4" /></Button></div></TableCell></TableRow>))}</TableBody></Table></ScrollArea></CardContent></Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent><DialogHeader><DialogTitle>{selectedMoto ? "Modifier la moto" : "Nouvelle moto"}</DialogTitle></DialogHeader><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Numéro *</Label><Input value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} required /></div><div className="space-y-2"><Label>Nom</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Date d&apos;achat</Label><Input type="date" value={formData.purchaseDate} onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} /></div><div className="space-y-2"><Label>État</Label><Select value={formData.state} onValueChange={(v) => setFormData({ ...formData, state: v as MotoState })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ACTIVE">Actif</SelectItem><SelectItem value="BROKEN">En panne</SelectItem><SelectItem value="MAINTENANCE">Maintenance</SelectItem><SelectItem value="RENTED">Louée</SelectItem></SelectContent></Select></div></div><DialogFooter><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button><Button type="submit" className="bg-[#4CAF50] hover:bg-[#388E3C]">Enregistrer</Button></DialogFooter></form></DialogContent></Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Supprimer la moto</AlertDialogTitle><AlertDialogDescription>Êtes-vous sûr de vouloir supprimer la moto {selectedMoto?.number} ?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}

function LivreursTab() {
  const [livreurs, setLivreurs] = useState<Livreur[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/livreurs").then(res => res.json()).then(setLivreurs).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-8"><RefreshCw className="w-8 h-8 animate-spin text-[#4CAF50]" /></div>;

  return (
    <Card><CardContent className="p-0"><ScrollArea className="h-96"><Table><TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>Téléphone</TableHead><TableHead>Contrat</TableHead><TableHead>Moto</TableHead><TableHead>Statut</TableHead></TableRow></TableHeader><TableBody>{livreurs.map((livreur) => (<TableRow key={livreur.id}><TableCell className="font-medium">{livreur.firstName} {livreur.lastName}</TableCell><TableCell>{livreur.phone || "-"}</TableCell><TableCell><Badge>{livreur.contractType}</Badge></TableCell><TableCell>{livreur.moto?.number || "-"}</TableCell><TableCell><Badge className={livreur.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>{livreur.status === "ACTIVE" ? "Actif" : "Inactif"}</Badge></TableCell></TableRow>))}</TableBody></Table></ScrollArea></CardContent></Card>
  );
}

function LocationsTab() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/locations").then(res => res.json()).then(setLocations).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-8"><RefreshCw className="w-8 h-8 animate-spin text-[#4CAF50]" /></div>;

  return (
    <Card><CardContent className="p-0"><ScrollArea className="h-96"><Table><TableHeader><TableRow><TableHead>Client</TableHead><TableHead>Moto</TableHead><TableHead>Date début</TableHead><TableHead>Tarif/jour</TableHead><TableHead>Statut</TableHead></TableRow></TableHeader><TableBody>{locations.map((location) => (<TableRow key={location.id}><TableCell className="font-medium">{location.client?.firstName} {location.client?.lastName}</TableCell><TableCell>{location.moto?.number}</TableCell><TableCell>{new Date(location.startDate).toLocaleDateString("fr-FR")}</TableCell><TableCell>{location.dailyRate.toLocaleString("fr-FR")} FCFA</TableCell><TableCell><Badge className={location.status === "ACTIVE" ? "bg-green-100 text-green-800" : location.status === "COMPLETED" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}>{location.status === "ACTIVE" ? "Active" : location.status === "COMPLETED" ? "Terminée" : "Annulée"}</Badge></TableCell></TableRow>))}</TableBody></Table></ScrollArea></CardContent></Card>
  );
}

// ============================================
// USERS TAB
// ============================================
function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "ASSISTANT" as UserRole, isActive: true, password: "" });

  const fetchUsers = useCallback(() => {
    fetch("/api/users").then(res => res.json()).then(setUsers).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const updateData: { name?: string; email?: string; role?: UserRole; isActive?: boolean; password?: string } = {};
    if (formData.name) updateData.name = formData.name;
    if (formData.email) updateData.email = formData.email;
    if (formData.role) updateData.role = formData.role;
    updateData.isActive = formData.isActive;
    if (formData.password) updateData.password = formData.password;

    const res = await fetch(`/api/users/${selectedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    if (res.ok) {
      toast({ title: "Succès", description: "Utilisateur modifié" });
      fetchUsers();
      setDialogOpen(false);
      setSelectedUser(null);
      setFormData({ name: "", email: "", role: "ASSISTANT", isActive: true, password: "" });
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    const res = await fetch(`/api/users/${selectedUser.id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "Succès", description: "Utilisateur supprimé" });
      fetchUsers();
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, isActive: user.isActive, password: "" });
    setDialogOpen(true);
  };

  if (loading) return <div className="flex justify-center p-8"><RefreshCw className="w-8 h-8 animate-spin text-[#4CAF50]" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
      </div>
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={user.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}>
                        {user.role === "ADMIN" ? "Administrateur" : "Assistant"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {user.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(user)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600" onClick={() => { setSelectedUser(user); setDeleteDialogOpen(true); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Rôle</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASSISTANT">Assistant</SelectItem>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nouveau mot de passe (laisser vide pour ne pas modifier)</Label>
              <Input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
              <Label htmlFor="isActive">Compte actif</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button type="submit" className="bg-[#4CAF50] hover:bg-[#388E3C]">Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l&apos;utilisateur</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;utilisateur {selectedUser?.name} ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============================================
// MAIN DASHBOARD
// ============================================
function AdminDashboard() {
  const [activeModule, setActiveModule] = useState("dashboard");

  const handleLogout = async () => {
    try {
      // Get current session to retrieve user ID
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      
      if (session?.user?.id) {
        // Call logout API to mark user as offline
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    // Sign out and redirect
    signOut({ callbackUrl: "/" });
  };

  const modules = [
    { id: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
    { id: "motos", label: "Motos", icon: Bike },
    { id: "livreurs", label: "Livreurs", icon: Users },
    { id: "locations", label: "Locations", icon: Home },
    { id: "users", label: "Utilisateurs", icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png?v=2" 
              alt="IK-SIKA SERVICES" 
              width={200} 
              height={70}
              className="h-16 w-auto"
            />
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {modules.map((module) => (
              <li key={module.id}>
                <button onClick={() => setActiveModule(module.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeModule === module.id ? "bg-[#4CAF50] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                  <module.icon className="w-5 h-5" /><span className="font-medium">{module.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" className="w-full" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" />Déconnexion</Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto"><div className="p-6">
        {activeModule === "dashboard" && <DashboardTab />}
        {activeModule === "motos" && <MotosTab />}
        {activeModule === "livreurs" && <LivreursTab />}
        {activeModule === "locations" && <LocationsTab />}
        {activeModule === "users" && <UsersTab />}
      </div></main>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT - Using getSession API
// ============================================
export default function Page() {
  const [view, setView] = useState<"landing" | "login" | "dashboard">("landing");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check session once on mount
    fetch("/api/auth/session")
      .then(res => res.json())
      .then(data => {
        if (data?.user) {
          setView("dashboard");
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  // Always render immediately to prevent blank screen
  if (checking) {
    return <LandingPage onLoginClick={() => setView("login")} />;
  }

  if (view === "dashboard") {
    return <AdminDashboard />;
  }

  if (view === "login") {
    return <LoginPage onBackClick={() => setView("landing")} />;
  }

  return <LandingPage onLoginClick={() => setView("login")} />;
}
