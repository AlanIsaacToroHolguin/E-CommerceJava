import { Product } from '../../types';

export const FALLBACK_GUITARS: Product[] = [
  {
    id: -1, name: "Fender American Pro II Stratocaster", brand: "Fender", modelCode: "0113900706",
    description: "Workhorse Strat with V-Mod II single-coils, Deep C neck, rolled fingerboard edges and treble-bleed circuit.",
    price: 1899, stock: 8, color: "Olympic White", bodyWood: "Alder", neckWood: "Maple", fingerboard: "Rosewood", pickupConfig: "SSS",
    imageUrl: "/guitars/fender-american-pro-ii-strat.png",
    active: true, categoryId: 1, categoryName: "Stratocaster"
  },
  {
    id: -2, name: "Fender Player Stratocaster HSS", brand: "Fender", modelCode: "0144523506",
    description: "Modern HSS Strat with Player Series Alnico V pickups, 22 medium-jumbo frets and 2-point tremolo.",
    price: 899, stock: 15, color: "3-Color Sunburst", bodyWood: "Alder", neckWood: "Maple", fingerboard: "Pau Ferro", pickupConfig: "HSS",
    imageUrl: "/guitars/fender-player-strat-hss.png",
    active: true, categoryId: 1, categoryName: "Stratocaster"
  },
  {
    id: -3, name: "Squier Classic Vibe '50s Stratocaster", brand: "Squier", modelCode: "0374005506",
    description: "Vintage-style Strat with Fender-designed alnico pickups and slim '50s C neck profile.",
    price: 499, stock: 25, color: "2-Color Sunburst", bodyWood: "Pine", neckWood: "Maple", fingerboard: "Maple", pickupConfig: "SSS",
    imageUrl: "/guitars/squier-classic-vibe-50s-strat.png",
    active: true, categoryId: 1, categoryName: "Stratocaster"
  },
  {
    id: -4, name: "Gibson Les Paul Standard '60s", brand: "Gibson", modelCode: "LPS600HCNH1",
    description: "Burstbucker 61R/61T pickups, SlimTaper neck and AAA flame maple top — the original rock machine.",
    price: 2799, stock: 6, color: "Bourbon Burst", bodyWood: "Mahogany w/ Maple top", neckWood: "Mahogany", fingerboard: "Rosewood", pickupConfig: "HH",
    imageUrl: "/guitars/gibson-les-paul-standard-60s.png",
    active: true, categoryId: 2, categoryName: "Les Paul"
  },
  {
    id: -5, name: "Epiphone Les Paul Standard '50s", brand: "Epiphone", modelCode: "EILS5HSNH1",
    description: "Affordable Les Paul with ProBucker pickups, '50s rounded neck and CTS pots.",
    price: 699, stock: 18, color: "Heritage Cherry Sunburst", bodyWood: "Mahogany w/ Maple top", neckWood: "Mahogany", fingerboard: "Indian Laurel", pickupConfig: "HH",
    imageUrl: "/guitars/epiphone-les-paul-standard-50s.png",
    active: true, categoryId: 2, categoryName: "Les Paul"
  },
  {
    id: -6, name: "Fender American Pro II Telecaster", brand: "Fender", modelCode: "0113942700",
    description: "V-Mod II single-coils, treble-bleed circuit and compound-radius fingerboard.",
    price: 1799, stock: 7, color: "Butterscotch Blonde", bodyWood: "Ash", neckWood: "Maple", fingerboard: "Maple", pickupConfig: "SS",
    imageUrl: "/guitars/fender-american-pro-ii-tele.png",
    active: true, categoryId: 3, categoryName: "Telecaster"
  },
  {
    id: -7, name: "Fender Player Telecaster", brand: "Fender", modelCode: "0145212500",
    description: "Solid alder body, Player Alnico V Tele pickups, modern C neck profile.",
    price: 849, stock: 14, color: "Black", bodyWood: "Alder", neckWood: "Maple", fingerboard: "Maple", pickupConfig: "SS",
    imageUrl: "/guitars/fender-player-tele.png",
    active: true, categoryId: 3, categoryName: "Telecaster"
  },
  {
    id: -8, name: "Gibson SG Standard", brand: "Gibson", modelCode: "SGS00HCCH1",
    description: "Lightweight mahogany SG with 490R/490T humbuckers and rounded neck profile.",
    price: 1799, stock: 5, color: "Heritage Cherry", bodyWood: "Mahogany", neckWood: "Mahogany", fingerboard: "Rosewood", pickupConfig: "HH",
    imageUrl: "/guitars/gibson-sg-standard.png",
    active: true, categoryId: 4, categoryName: "SG"
  },
  {
    id: -9, name: "Epiphone SG Special", brand: "Epiphone", modelCode: "EGS1VECH1",
    description: "Entry SG with Epiphone Ceramic Pro humbuckers, lightweight body and SlimTaper D neck.",
    price: 349, stock: 22, color: "Vintage Cherry", bodyWood: "Mahogany", neckWood: "Mahogany", fingerboard: "Indian Laurel", pickupConfig: "HH",
    imageUrl: "/guitars/epiphone-sg-special.png",
    active: true, categoryId: 4, categoryName: "SG"
  },
  {
    id: -10, name: "Ibanez RG550 Genesis Collection", brand: "Ibanez", modelCode: "RG550DY",
    description: "Genesis reissue: Wizard neck, V7/S1/V8 pickups and Edge tremolo bridge.",
    price: 1199, stock: 9, color: "Desert Sun Yellow", bodyWood: "Basswood", neckWood: "Maple", fingerboard: "Maple", pickupConfig: "HSH",
    imageUrl: "/guitars/ibanez-rg550-genesis.png",
    active: true, categoryId: 5, categoryName: "Superstrat"
  },
  {
    id: -11, name: "Jackson Pro Plus Soloist SLA3", brand: "Jackson", modelCode: "2914327503",
    description: "Through-body neck, Seymour Duncan JB/Jazz, Floyd Rose 1500 Series tremolo.",
    price: 1499, stock: 5, color: "Deep Black Satin", bodyWood: "Mahogany", neckWood: "Maple", fingerboard: "Ebony", pickupConfig: "HH",
    imageUrl: "/guitars/jackson-pro-plus-soloist.png",
    active: true, categoryId: 5, categoryName: "Superstrat"
  },
  {
    id: -12, name: "ESP LTD M-1000 Evertune", brand: "ESP", modelCode: "LM1000ETHTM",
    description: "Evertune bridge, Fishman Fluence Modern pickups, perfect tuning under any tension.",
    price: 1399, stock: 4, color: "Charcoal Metallic Satin", bodyWood: "Mahogany", neckWood: "Maple", fingerboard: "Macassar Ebony", pickupConfig: "HH",
    imageUrl: "/guitars/esp-ltd-m1000-evertune.png",
    active: true, categoryId: 5, categoryName: "Superstrat"
  }
];
