/* Photos et vidéos d’exemple (Mixkit, licence gratuite usage commercial). Le client les remplace au fur et à mesure. */
(function () {
  'use strict';
  const MEDIA = {
  "sante": {
    "portrait": "media/sante/33328.jpg",
    "cover": "media/sante/24968.jpg",
    "gallery": [
      {
        "src": "media/sante/12141.jpg",
        "cap": "L’accueil"
      },
      {
        "src": "media/sante/6592.jpg",
        "cap": "Salle de soins"
      },
      {
        "src": "media/sante/9027.jpg",
        "cap": "Radiologie numérique"
      }
    ],
    "video": {
      "src": "media/sante/video.mp4",
      "poster": "media/sante/9130.jpg",
      "cap": "Le cabinet en vidéo"
    }
  },
  "conseil": {
    "portrait": "media/conseil/35910.jpg",
    "cover": "media/conseil/4813.jpg",
    "video": {
      "src": "media/conseil/video.mp4",
      "poster": "media/conseil/4809.jpg",
      "cap": "Présentation de l’agence"
    }
  },
  "pro": {
    "portrait": "media/pro/42664.jpg",
    "cover": "media/pro/23011.jpg",
    "video": {
      "src": "media/pro/video.mp4",
      "poster": "media/pro/42665.jpg",
      "cap": "Nordlink en 30 secondes"
    }
  },
  "freelance": {
    "portrait": "media/freelance/43259.jpg",
    "cover": "media/freelance/41637.jpg",
    "cards": [
      "media/freelance/41654.jpg",
      "media/freelance/4938.jpg",
      "media/freelance/42620.jpg"
    ],
    "video": {
      "src": "media/freelance/video.mp4",
      "poster": "media/freelance/1808.jpg",
      "cap": "Démonstration d’un projet"
    }
  },
  "immobilier": {
    "portrait": "media/immobilier/13126.jpg",
    "cover": "media/immobilier/24945.jpg",
    "cards": [
      "media/immobilier/15851.jpg",
      "media/immobilier/27543.jpg",
      "media/immobilier/13126.jpg"
    ],
    "video": {
      "src": "media/immobilier/video.mp4",
      "poster": "media/immobilier/13107.jpg",
      "cap": "Visite d’un appartement"
    }
  },
  "archi": {
    "portrait": "media/archi/21219.jpg",
    "cover": "media/archi/4488.jpg",
    "gallery": [
      {
        "src": "media/archi/16556.jpg",
        "cap": "Plans à la main"
      },
      {
        "src": "media/archi/41178.jpg",
        "cap": "Recherche d’inspiration"
      },
      {
        "src": "media/archi/41184.jpg",
        "cap": "Planches de tendances"
      },
      {
        "src": "media/archi/15840.jpg",
        "cap": "Maquette"
      }
    ],
    "cards": [
      "media/archi/4030.jpg",
      "media/archi/4047.jpg",
      "media/archi/35798.jpg"
    ],
    "video": {
      "src": "media/archi/video.mp4",
      "poster": "media/archi/41178.jpg",
      "cap": "L’atelier au travail"
    }
  },
  "artisans": {
    "portrait": "media/artisans/23529.jpg",
    "cover": "media/artisans/31473.jpg",
    "gallery": [
      {
        "src": "media/artisans/47070.jpg",
        "cap": "Robinetterie posée"
      },
      {
        "src": "media/artisans/45666.jpg",
        "cap": "Évacuation débouchée"
      },
      {
        "src": "media/artisans/14729.jpg",
        "cap": "Chape béton"
      },
      {
        "src": "media/artisans/23601.jpg",
        "cap": "Outillage professionnel"
      },
      {
        "src": "media/artisans/1459.jpg",
        "cap": "Chantier neuf"
      },
      {
        "src": "media/artisans/47071.jpg",
        "cap": "Recherche de fuite"
      }
    ],
    "video": {
      "src": "media/artisans/video.mp4",
      "poster": "media/artisans/39178.jpg",
      "cap": "Sur le chantier"
    }
  },
  "beaute": {
    "portrait": "media/beaute/43223.jpg",
    "cover": "media/beaute/43236.jpg",
    "gallery": [
      {
        "src": "media/beaute/43229.jpg",
        "cap": "Coupe tendance"
      },
      {
        "src": "media/beaute/43222.jpg",
        "cap": "Taille de barbe"
      },
      {
        "src": "media/beaute/40122.jpg",
        "cap": "Contours précis"
      },
      {
        "src": "media/beaute/43233.jpg",
        "cap": "Le résultat"
      },
      {
        "src": "media/beaute/43231.jpg",
        "cap": "Nos outils"
      },
      {
        "src": "media/beaute/43243.jpg",
        "cap": "Dégradé"
      }
    ],
    "cards": [
      "media/beaute/40126.jpg",
      "media/beaute/361.jpg"
    ],
    "video": {
      "src": "media/beaute/video.mp4",
      "poster": "media/beaute/43241.jpg",
      "cap": "Une coupe au salon"
    }
  },
  "coaching": {
    "portrait": "media/coaching/47462.jpg",
    "cover": "media/coaching/36716.jpg",
    "gallery": [
      {
        "src": "media/coaching/47417.jpg",
        "cap": "Échauffement"
      },
      {
        "src": "media/coaching/13102.jpg",
        "cap": "Coaching individuel"
      },
      {
        "src": "media/coaching/40246.jpg",
        "cap": "Cross-training"
      }
    ],
    "video": {
      "src": "media/coaching/video.mp4",
      "poster": "media/coaching/52088.jpg",
      "cap": "Extrait de séance"
    }
  },
  "restaurant": {
    "cover": "media/restaurant/29050.jpg",
    "gallery": [
      {
        "src": "media/restaurant/32457.jpg",
        "cap": "Joue de bœuf braisée"
      },
      {
        "src": "media/restaurant/2597.jpg",
        "cap": "La terrasse"
      },
      {
        "src": "media/restaurant/4216.jpg",
        "cap": "Dessert du jour"
      },
      {
        "src": "media/restaurant/4043.jpg",
        "cap": "Le bar"
      },
      {
        "src": "media/restaurant/13258.jpg",
        "cap": "Entrée du jour"
      },
      {
        "src": "media/restaurant/4385.jpg",
        "cap": "La salle"
      }
    ],
    "video": {
      "src": "media/restaurant/video.mp4",
      "poster": "media/restaurant/15875.jpg",
      "cap": "En cuisine"
    }
  },
  "producteurs": {
    "cover": "media/producteurs/7693.jpg",
    "gallery": [
      {
        "src": "media/producteurs/35920.jpg",
        "cap": "Les semis"
      },
      {
        "src": "media/producteurs/991.jpg",
        "cap": "Notre stand au marché"
      },
      {
        "src": "media/producteurs/4653.jpg",
        "cap": "Paniers de saison"
      },
      {
        "src": "media/producteurs/10420.jpg",
        "cap": "Récolte du jour"
      },
      {
        "src": "media/producteurs/20560.jpg",
        "cap": "Les champs"
      },
      {
        "src": "media/producteurs/21341.jpg",
        "cap": "Cueillette"
      }
    ],
    "video": {
      "src": "media/producteurs/video.mp4",
      "poster": "media/producteurs/983.jpg",
      "cap": "Au marché"
    }
  },
  "evenementiel": {
    "portrait": "media/evenementiel/5183.jpg",
    "cover": "media/evenementiel/5217.jpg",
    "gallery": [
      {
        "src": "media/evenementiel/40584.jpg",
        "cap": "Cérémonie au jardin"
      },
      {
        "src": "media/evenementiel/5224.jpg",
        "cap": "Table d’honneur"
      },
      {
        "src": "media/evenementiel/18204.jpg",
        "cap": "Décor floral"
      },
      {
        "src": "media/evenementiel/5213.jpg",
        "cap": "Salle de réception"
      },
      {
        "src": "media/evenementiel/40599.jpg",
        "cap": "Les mariés"
      },
      {
        "src": "media/evenementiel/9426.jpg",
        "cap": "Bougies et roses"
      }
    ],
    "video": {
      "src": "media/evenementiel/video.mp4",
      "poster": "media/evenementiel/40596.jpg",
      "cap": "Film d’un mariage"
    }
  },
  "portfolio": {
    "portrait": "media/portfolio/44119.jpg",
    "cover": "media/portfolio/41628.jpg",
    "gallery": [
      {
        "src": "media/portfolio/50638.jpg",
        "cap": "Portrait"
      },
      {
        "src": "media/portfolio/40593.jpg",
        "cap": "Mariage"
      },
      {
        "src": "media/portfolio/34405.jpg",
        "cap": "Mode"
      },
      {
        "src": "media/portfolio/41585.jpg",
        "cap": "Coulisses"
      },
      {
        "src": "media/portfolio/34425.jpg",
        "cap": "Beauté"
      },
      {
        "src": "media/portfolio/44066.jpg",
        "cap": "Produit"
      }
    ],
    "cards": [
      "media/portfolio/34399.jpg",
      "media/portfolio/40601.jpg",
      "media/portfolio/4811.jpg"
    ],
    "video": {
      "src": "media/portfolio/video.mp4",
      "poster": "media/portfolio/41633.jpg",
      "cap": "Showreel"
    }
  },
  "musique": {
    "cover": "media/musique/50318.jpg",
    "gallery": [
      {
        "src": "media/musique/50326.jpg",
        "cap": "La voix"
      },
      {
        "src": "media/musique/646.jpg",
        "cap": "Saxophone"
      },
      {
        "src": "media/musique/50330.jpg",
        "cap": "Au piano"
      }
    ],
    "video": {
      "src": "media/musique/video.mp4",
      "poster": "media/musique/50307.jpg",
      "cap": "Live au Petit Salon"
    }
  },
  "influence": {
    "portrait": "media/influence/42323.jpg",
    "cover": "media/influence/49647.jpg",
    "cards": [
      "media/influence/2433.jpg",
      "media/influence/2597.jpg",
      "media/influence/47555.jpg"
    ],
    "video": {
      "src": "media/influence/video.mp4",
      "poster": "media/influence/42316.jpg",
      "cap": "Ma dernière vidéo"
    }
  },
  "hebergement": {
    "cover": "media/hebergement/4047.jpg",
    "gallery": [
      {
        "src": "media/hebergement/4029.jpg",
        "cap": "La terrasse"
      },
      {
        "src": "media/hebergement/4046.jpg",
        "cap": "Chambre Lavande"
      },
      {
        "src": "media/hebergement/4019.jpg",
        "cap": "Petit-déjeuner"
      },
      {
        "src": "media/hebergement/4030.jpg",
        "cap": "Suite Olivier"
      },
      {
        "src": "media/hebergement/4184.jpg",
        "cap": "Espace détente"
      },
      {
        "src": "media/hebergement/4198.jpg",
        "cap": "Chambre Garrigue"
      }
    ],
    "cards": [
      "media/hebergement/4046.jpg",
      "media/hebergement/4030.jpg",
      "media/hebergement/4488.jpg"
    ],
    "video": {
      "src": "media/hebergement/video.mp4",
      "poster": "media/hebergement/4196.jpg",
      "cap": "Visite du mas"
    }
  },
  "tourisme": {
    "cover": "media/tourisme/5371.jpg",
    "gallery": [
      {
        "src": "media/tourisme/5363.jpg",
        "cap": "Le port"
      },
      {
        "src": "media/tourisme/2875.jpg",
        "cap": "Le ponton"
      },
      {
        "src": "media/tourisme/14481.jpg",
        "cap": "Coucher de soleil"
      },
      {
        "src": "media/tourisme/4680.jpg",
        "cap": "En mer"
      }
    ],
    "cards": [
      "media/tourisme/8680.jpg",
      "media/tourisme/3428.jpg",
      "media/tourisme/4371.jpg"
    ],
    "video": {
      "src": "media/tourisme/video.mp4",
      "poster": "media/tourisme/48487.jpg",
      "cap": "Sortie en mer"
    }
  },
  "animaux": {
    "portrait": "media/animaux/45890.jpg",
    "cover": "media/animaux/45886.jpg",
    "gallery": [
      {
        "src": "media/animaux/1664.jpg",
        "cap": "Coupe aux ciseaux"
      },
      {
        "src": "media/animaux/1661.jpg",
        "cap": "Après toilettage"
      },
      {
        "src": "media/animaux/45884.jpg",
        "cap": "Brossage"
      },
      {
        "src": "media/animaux/45891.jpg",
        "cap": "Soin des griffes"
      },
      {
        "src": "media/animaux/1552.jpg",
        "cap": "Client satisfait"
      },
      {
        "src": "media/animaux/1778.jpg",
        "cap": "Chats bienvenus"
      }
    ],
    "video": {
      "src": "media/animaux/video.mp4",
      "poster": "media/animaux/45883.jpg",
      "cap": "Au salon"
    }
  },
  "boutiques": {
    "cover": "media/boutiques/34611.jpg",
    "gallery": [
      {
        "src": "media/boutiques/34611.jpg",
        "cap": "Bracelet"
      },
      {
        "src": "media/boutiques/5225.jpg",
        "cap": "Écrin"
      },
      {
        "src": "media/boutiques/50782.jpg",
        "cap": "Portés"
      },
      {
        "src": "media/boutiques/9765.jpg",
        "cap": "À l’atelier"
      }
    ],
    "cards": [
      "media/boutiques/20877.jpg",
      "media/boutiques/2865.jpg",
      "media/boutiques/51649.jpg"
    ],
    "video": {
      "src": "media/boutiques/video.mp4",
      "poster": "media/boutiques/2861.jpg",
      "cap": "Fabrication"
    }
  },
  "auto": {
    "portrait": "media/auto/13270.jpg",
    "cover": "media/auto/4716.jpg",
    "gallery": [
      {
        "src": "media/auto/13260.jpg",
        "cap": "Sous le véhicule"
      },
      {
        "src": "media/auto/41937.jpg",
        "cap": "Vidange"
      },
      {
        "src": "media/auto/13180.jpg",
        "cap": "Diagnostic"
      }
    ],
    "video": {
      "src": "media/auto/video.mp4",
      "poster": "media/auto/13260.jpg",
      "cap": "À l’atelier"
    }
  }
};

  NFC.SECTORS.forEach((s) => {
    const m = MEDIA[s.id], d = s.demo;
    if (!m || !d) return;
    if (m.portrait && d.identity.photo === 'ph:portrait') d.identity.photo = m.portrait;
    if (m.cover) d.identity.cover = m.cover;
    s.blocks.forEach((def) => {
      const b = d.blocks[def.key];
      if (!b) return;
      if (def.type === 'gallery' && m.gallery) b.images = m.gallery.map((g) => ({ src: g.src, cap: g.cap }));
      if (def.type === 'cards' && m.cards) b.items.forEach((it, i) => { if (m.cards[i]) it.img = m.cards[i]; });
      if (def.type === 'video' && m.video) { b.on = true; b.src = m.video.src; b.cover = m.video.poster; b.cap = b.cap || m.video.cap; }
    });
  });
  NFC.MEDIA = MEDIA;
  NFC.isDemoMedia =(src) => /^(ph:|media\/)/.test(String(src || ''));
})();
