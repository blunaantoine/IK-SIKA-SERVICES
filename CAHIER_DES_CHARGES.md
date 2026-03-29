# CAHIER DES CHARGES
## IK-SIKA SERVICES - Application de Gestion

---

## 1. PRÉSENTATION DU PROJET

### 1.1 Contexte
**IK-SIKA SERVICES** est une entreprise togolaise spécialisée dans la livraison et la location de motos pour les livreurs. L'application vise à digitaliser et optimiser la gestion de leur flotte de motos, des livreurs et des locations.

### 1.2 Objectifs
- Digitaliser la gestion de la flotte de motos
- Suivre les activités des livreurs en temps réel
- Gérer les contrats de location de motos
- Automatiser la comptabilité journalière
- Assurer le suivi des réparations et maintenance

### 1.3 Public cible
- Administrateurs de l'entreprise
- Assistants de gestion
- Clients pour la location de motos

---

## 2. FONCTIONNALITÉS

### 2.1 Module Authentification

| Fonctionnalité | Description |
|----------------|-------------|
| Connexion | Authentification sécurisée avec email/mot de passe |
| Inscription | Création de compte pour nouveaux utilisateurs |
| Réinitialisation mot de passe | Récupération par email |
| Gestion des rôles | ADMIN (administrateur) / ASSISTANT (assistant) |
| Statut en ligne | Indicateur ACTIF/INACTIF basé sur la dernière connexion |
| Déconnexion | Mise à jour automatique du statut hors-ligne |

### 2.2 Module Tableau de Bord

| Fonctionnalité | Description |
|----------------|-------------|
| Vue d'ensemble | Statistiques globales de l'activité |
| Nombre de motos | Total, actives, en maintenance, en panne |
| Nombre de livreurs | Total, actifs, inactifs |
| Locations actives | Nombre de locations en cours |
| Graphiques | Visualisation des revenus et activités |

### 2.3 Module Gestion des Motos

| Fonctionnalité | Description |
|----------------|-------------|
| Liste des motos | Affichage de toutes les motos avec filtres |
| Ajout de moto | Enregistrement d'une nouvelle moto |
| Modification | Mise à jour des informations |
| Suppression | Retrait d'une moto du système |
| États | ACTIF, EN PANNE, EN MAINTENANCE, EN LOCATION |
| Historique des réparations | Suivi des interventions techniques |
| Assignation | Attribution à un livreur |

### 2.4 Module Gestion des Livreurs

| Fonctionnalité | Description |
|----------------|-------------|
| Liste des livreurs | Affichage avec recherche et filtres |
| Ajout de livreur | Enregistrement d'un nouveau livreur |
| Modification | Mise à jour des informations |
| Suppression | Retrait du système |
| Assignation moto | Lien livreur-moto |
| Type de contrat | CDD, CDI, FREELANCE |
| Statut | ACTIF, INACTIF |
| Comptabilité journalière | Suivi des livraisons et revenus |

### 2.5 Module Locations

| Fonctionnalité | Description |
|----------------|-------------|
| Liste des locations | Affichage de toutes les locations |
| Nouvelle location | Création d'un contrat de location |
| Clôture | Fin de location avec calcul du montant |
| Annulation | Annulation d'une location |
| Clients | Gestion des informations clients |
| Tarification | Tarif journalier et caution |

### 2.6 Module Utilisateurs (Admin uniquement)

| Fonctionnalité | Description |
|----------------|-------------|
| Liste des utilisateurs | Affichage de tous les comptes |
| Création de compte | Ajout d'un nouvel utilisateur |
| Modification | Mise à jour des informations |
| Activation/Désactivation | Gestion de l'accès au système |
| Réinitialisation mot de passe | Changement du mot de passe |
| Statut en ligne | Indicateur visuel (point vert/gris) |

### 2.7 Module Comptabilité

| Fonctionnalité | Description |
|----------------|-------------|
| Enregistrement journalier | Saisie des livraisons par jour |
| Montant collecté | Suivi des sommes récoltées |
| Dépenses | Enregistrement des frais |
| Montant à remettre | Calcul automatique |
| Rapports | Export des données |

---

## 3. ARCHITECTURE TECHNIQUE

### 3.1 Stack Technologique

| Technologie | Usage |
|-------------|-------|
| **Next.js 14** | Framework React (App Router) |
| **TypeScript** | Langage de programmation |
| **Tailwind CSS** | Framework CSS |
| **shadcn/ui** | Composants UI |
| **Prisma ORM** | ORM pour la base de données |
| **SQLite** | Base de données (production) |
| **NextAuth.js** | Authentification |
| **bcryptjs** | Hashage des mots de passe |
| **Recharts** | Graphiques |
| **Lucide Icons** | Icônes |

### 3.2 Structure du Projet

```
ik-sika-services/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/    # Auth NextAuth
│   │   │   │   ├── register/         # Inscription
│   │   │   │   ├── logout/           # Déconnexion
│   │   │   │   ├── forgot-password/  # Mot de passe oublié
│   │   │   │   └── reset-password/   # Réinitialisation
│   │   │   ├── motos/                # API Motos
│   │   │   ├── livreurs/             # API Livreurs
│   │   │   ├── users/                # API Utilisateurs
│   │   │   └── rentals/              # API Locations
│   │   ├── page.tsx                  # Page principale
│   │   ├── layout.tsx                # Layout
│   │   └── globals.css               # Styles globaux
│   ├── components/
│   │   └── ui/                       # Composants shadcn/ui
│   └── lib/
│       ├── db.ts                     # Client Prisma
│       └── auth.ts                   # Configuration NextAuth
├── prisma/
│   └── schema.prisma                 # Schéma base de données
├── public/
│   └── logo.png                      # Logo de l'entreprise
├── Dockerfile                        # Image Docker
├── render.yaml                       # Configuration Render
└── package.json                      # Dépendances
```

### 3.3 Modèle de Données

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │     │    Moto     │     │   Livreur   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ email       │     │ number      │     │ firstName   │
│ password    │     │ name        │     │ lastName    │
│ name        │     │ state       │     │ phone       │
│ role        │     │ lastRevision│     │ contractType│
│ isActive    │     │ nextRevision│     │ motoId ─────┼──┐
│ lastLoginAt │     │ repairs[]   │     │ status      │  │
└─────────────┘     └─────────────┘     └─────────────┘  │
       │                   │                              │
       │                   │                              │
       ▼                   ▼                              │
┌─────────────┐     ┌─────────────┐                      │
│ ActivityLog │     │RepairHistory│                      │
├─────────────┤     ├─────────────┤                      │
│ userId      │     │ motoId      │                      │
│ action      │     │ description │                      │
│ entityType  │     │ date        │                      │
│ description │     │ cost        │                      │
└─────────────┘     └─────────────┘                      │
                                                           │
┌─────────────┐     ┌─────────────┐                      │
│  Location   │     │Comptabilité │                      │
├─────────────┤     ├─────────────┤                      │
│ clientId    │     │ livreurId ──┼──────────────────────┘
│ motoId      │     │ date        │
│ startDate   │     │ deliveries  │
│ endDate     │     │ amountColl. │
│ dailyRate   │     │ expenses    │
│ status      │     │ amountRemit │
└─────────────┘     └─────────────┘
```

---

## 4. INTERFACE UTILISATEUR

### 4.1 Design
- **Couleur principale**: Vert (#4CAF50) - symbolisant l'écologie et la mobilité
- **Style**: Moderne, épuré, professionnel
- **Responsive**: Adapté mobile, tablette et desktop

### 4.2 Navigation
```
┌─────────────────────────────────────────────────────┐
│  🏍️ IK-SIKA SERVICES                               │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  📊 Tableau  │         CONTENU                      │
│    de Bord   │                                      │
│              │                                      │
│  🏍️ Motos    │                                      │
│              │                                      │
│  👥 Livreurs │                                      │
│              │                                      │
│  🏠 Locations│                                      │
│              │                                      │
│  👤 Utilisat.│                                      │
│              │                                      │
├──────────────┴──────────────────────────────────────┤
│  [🚪 Déconnexion]                                   │
└─────────────────────────────────────────────────────┘
```

### 4.3 Pages Principales

| Page | URL | Accès |
|------|-----|-------|
| Landing Page | `/` | Public |
| Login | `/` (modal) | Public |
| Dashboard | `/` (après login) | Authentifié |
| Administration | `/` (onglets) | Admin/Assistant |

---

## 5. SÉCURITÉ

### 5.1 Authentification
- Mots de passe hashés avec bcrypt (10 rounds)
- Sessions JWT avec NextAuth.js
- Secret de session (NEXTAUTH_SECRET)

### 5.2 Autorisation
- Rôles: ADMIN, ASSISTANT
- Accès conditionnel aux fonctionnalités
- Vérification côté serveur

### 5.3 Protection des données
- Validation des entrées utilisateur
- Protection CSRF intégrée
- HTTPS en production

---

## 6. DÉPLOIEMENT

### 6.1 Plateforme
- **Render** (gratuit)
- Base de données SQLite persistante
- HTTPS automatique

### 6.2 Configuration requise

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Chemin vers la base SQLite |
| `NEXTAUTH_SECRET` | Secret pour les sessions |
| `NEXTAUTH_URL` | URL de l'application |

### 6.3 Identifiants par défaut

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `admin@ik-sika.com` | `admin123` | ADMIN |

---

## 7. MAINTENANCE

### 7.1 Sauvegardes
- Base SQLite à sauvegarder régulièrement
- Volume persistant sur Render

### 7.2 Mises à jour
- Mise à jour des dépendances npm
- Surveillance des vulnérabilités

---

## 8. ÉVOLUTIONS FUTURES

### 8.1 Fonctionnalités prévues
- [ ] Application mobile pour livreurs
- [ ] Notifications push
- [ ] Géolocalisation en temps réel
- [ ] Rapports PDF automatisés
- [ ] Intégration paiement mobile (Mobile Money)
- [ ] Multi-langues (Français, Ewe, Kabye)

### 8.2 Améliorations techniques
- [ ] Migration vers PostgreSQL pour scalabilité
- [ ] Tests automatisés
- [ ] CI/CD avec GitHub Actions
- [ ] Monitoring et alertes

---

## 9. CONTACTS

| Rôle | Contact |
|------|---------|
| Développeur | IK-SIKA SERVICES |
| Support | support@ik-sika.com |

---

**Document généré le**: Mars 2024
**Version**: 1.0.0
**Application**: IK-SIKA SERVICES
