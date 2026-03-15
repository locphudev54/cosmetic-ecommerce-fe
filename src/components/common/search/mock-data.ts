import { Product } from '@/features/product/types'
import { ProductStatus } from '@/enums'

export const mockSuggestionsData: Record<string, Product[]> = {
  lipstick: [
    {
      id: '1',
      brandId: 'maybelline',
      countryOriginId: 'us',
      code: 'LIP-RED-001',
      name: 'Maybelline Lasting Drama Lipstick - Ruby Red',
      slug: 'maybelline-lasting-drama-ruby-red',
      description: 'Long-lasting, creamy lipstick with intense color payoff',
      status: ProductStatus.PUBLISHED,
      basePrice: 8.99,
      views: 15420,
      brand: { id: 'maybelline', name: 'Maybelline', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '1',
          productId: '1',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      brandId: 'mac',
      countryOriginId: 'us',
      code: 'LIP-MAT-002',
      name: 'MAC Ruby Woo Lipstick',
      slug: 'mac-ruby-woo-lipstick',
      description: 'Classic blue-based red with matte finish',
      status: ProductStatus.PUBLISHED,
      basePrice: 19.0,
      views: 12890,
      brand: { id: 'mac', name: 'MAC Cosmetics', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '2',
          productId: '2',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      brandId: 'nyx',
      countryOriginId: 'us',
      code: 'LIP-NUD-003',
      name: 'NYX Professional Makeup Soft Matte Lip Cream - Nude',
      slug: 'nyx-soft-matte-lip-cream-nude',
      description: 'Creamy, buildable coverage with matte finish',
      status: ProductStatus.PUBLISHED,
      basePrice: 6.5,
      views: 9870,
      brand: { id: 'nyx', name: 'NYX Professional Makeup', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '3',
          productId: '3',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  foundation: [
    {
      id: '4',
      brandId: 'fenty',
      countryOriginId: 'us',
      code: 'FDN-FEN-004',
      name: "Fenty Beauty Pro Filt'r Soft Matte Longwear Foundation",
      slug: 'fenty-pro-filtr-soft-matte-foundation',
      description: '40 shades for all skin tones, long-lasting matte finish',
      status: ProductStatus.PUBLISHED,
      basePrice: 38.0,
      views: 22340,
      brand: { id: 'fenty', name: 'Fenty Beauty', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '4',
          productId: '4',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      brandId: 'estee',
      countryOriginId: 'us',
      code: 'FDN-DOU-005',
      name: 'Estée Lauder Double Wear Stay-in-Place Makeup',
      slug: 'estee-lauder-double-wear-foundation',
      description: '24-hour wear, waterproof foundation',
      status: ProductStatus.PUBLISHED,
      basePrice: 45.0,
      views: 18750,
      brand: { id: 'estee', name: 'Estée Lauder', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '5',
          productId: '5',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  mascara: [
    {
      id: '6',
      brandId: 'benefit',
      countryOriginId: 'us',
      code: 'MSC-BAD-006',
      name: "Benefit They're Real! Mascara",
      slug: 'benefit-theyre-real-mascara',
      description: 'Lengthens, curls, volumizes, and separates lashes',
      status: ProductStatus.PUBLISHED,
      basePrice: 28.0,
      views: 16540,
      brand: { id: 'benefit', name: 'Benefit Cosmetics', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '6',
          productId: '6',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '7',
      brandId: 'loreal',
      countryOriginId: 'fr',
      code: 'MSC-VOL-007',
      name: "L'Oréal Voluminous Lash Paradise Mascara",
      slug: 'loreal-voluminous-lash-paradise',
      description: 'Volumizing mascara with feather-light feel',
      status: ProductStatus.PUBLISHED,
      basePrice: 9.99,
      views: 14230,
      brand: { id: 'loreal', name: "L'Oréal Paris", imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '7',
          productId: '7',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  skincare: [
    {
      id: '8',
      brandId: 'cetaphil',
      countryOriginId: 'us',
      code: 'SKN-CLE-008',
      name: 'Cetaphil Gentle Skin Cleanser',
      slug: 'cetaphil-gentle-skin-cleanser',
      description: 'Soap-free, hypoallergenic daily facial cleanser',
      status: ProductStatus.PUBLISHED,
      basePrice: 12.99,
      views: 19870,
      brand: { id: 'cetaphil', name: 'Cetaphil', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '8',
          productId: '8',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '9',
      brandId: 'neutrogena',
      countryOriginId: 'us',
      code: 'SKN-MOI-009',
      name: 'Neutrogena Hydro Boost Water Gel',
      slug: 'neutrogena-hydro-boost-water-gel',
      description: 'Hydrating gel moisturizer with hyaluronic acid',
      status: ProductStatus.PUBLISHED,
      basePrice: 18.0,
      views: 17650,
      brand: { id: 'neutrogena', name: 'Neutrogena', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '9',
          productId: '9',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '10',
      brandId: 'theordinary',
      countryOriginId: 'ca',
      code: 'SKN-VIT-010',
      name: 'The Ordinary Hyaluronic Acid 2% + B5',
      slug: 'the-ordinary-hyaluronic-acid-2-b5',
      description: 'Hydrating serum with vitamin B5',
      status: ProductStatus.PUBLISHED,
      basePrice: 7.9,
      views: 25430,
      brand: { id: 'theordinary', name: 'The Ordinary', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '10',
          productId: '10',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  perfume: [
    {
      id: '11',
      brandId: 'chanel',
      countryOriginId: 'fr',
      code: 'PRF-CHA-011',
      name: 'Chanel No. 5 Eau de Parfum',
      slug: 'chanel-no5-eau-de-parfum',
      description: 'Iconic floral aldehydic fragrance',
      status: ProductStatus.PUBLISHED,
      basePrice: 125.0,
      views: 31200,
      brand: { id: 'chanel', name: 'Chanel', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '11',
          productId: '11',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '12',
      brandId: 'dior',
      countryOriginId: 'fr',
      code: 'PRF-DIO-012',
      name: "Dior J'adore Eau de Parfum",
      slug: 'dior-jadore-eau-de-parfum',
      description: 'Floral fragrance with ylang-ylang and rose',
      status: ProductStatus.PUBLISHED,
      basePrice: 98.0,
      views: 28900,
      brand: { id: 'dior', name: 'Dior', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '12',
          productId: '12',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  eyeshadow: [
    {
      id: '13',
      brandId: 'urbandecay',
      countryOriginId: 'us',
      code: 'EYE-UD-013',
      name: 'Urban Decay Naked Basics Eyeshadow Palette',
      slug: 'urban-decay-naked-basics-palette',
      description: '12 neutral matte shades for everyday looks',
      status: ProductStatus.PUBLISHED,
      basePrice: 29.0,
      views: 21340,
      brand: { id: 'urbandecay', name: 'Urban Decay', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '13',
          productId: '13',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '14',
      brandId: 'huda',
      countryOriginId: 'us',
      code: 'EYE-HUD-014',
      name: 'Huda Beauty Desert Dusk Eyeshadow Palette',
      slug: 'huda-beauty-desert-dusk-palette',
      description: '18 shades with warm, earthy tones',
      status: ProductStatus.PUBLISHED,
      basePrice: 29.0,
      views: 19870,
      brand: { id: 'huda', name: 'Huda Beauty', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '14',
          productId: '14',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  blush: [
    {
      id: '15',
      brandId: 'nars',
      countryOriginId: 'us',
      code: 'BLU-NAR-015',
      name: 'NARS Orgasm Blush',
      slug: 'nars-orgasm-blush',
      description: 'Peachy pink blush with golden shimmer',
      status: ProductStatus.PUBLISHED,
      basePrice: 30.0,
      views: 24560,
      brand: { id: 'nars', name: 'NARS', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '15',
          productId: '15',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '16',
      brandId: 'milani',
      countryOriginId: 'us',
      code: 'BLU-MIL-016',
      name: 'Milani Baked Blush - Luminoso',
      slug: 'milani-baked-blush-luminoso',
      description: 'Baked blush with luminous finish',
      status: ProductStatus.PUBLISHED,
      basePrice: 8.99,
      views: 16780,
      brand: { id: 'milani', name: 'Milani', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '16',
          productId: '16',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  highlighter: [
    {
      id: '17',
      brandId: 'becca',
      countryOriginId: 'us',
      code: 'HIG-BEC-017',
      name: 'BECCA Shimmering Skin Perfector',
      slug: 'becca-shimmering-skin-perfector',
      description: 'Liquid highlighter with buildable glow',
      status: ProductStatus.PUBLISHED,
      basePrice: 38.0,
      views: 18920,
      brand: { id: 'becca', name: 'BECCA', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '17',
          productId: '17',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '18',
      brandId: 'wetnwild',
      countryOriginId: 'us',
      code: 'HIG-WET-018',
      name: 'Wet n Wild MegaGlo Highlighting Powder',
      slug: 'wet-n-wild-megaglo-highlighting-powder',
      description: 'Affordable highlighting powder with intense glow',
      status: ProductStatus.PUBLISHED,
      basePrice: 4.99,
      views: 22340,
      brand: { id: 'wetnwild', name: 'Wet n Wild', imageUrl: '/placeholder.jpg' },
      images: [
        {
          id: '18',
          productId: '18',
          url: '/placeholder.jpg',
          displayOrder: 0,
          isPrimary: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
}

export const trendingSearches = [
  { query: 'Lipstick', count: 4521 },
  { query: 'Foundation', count: 3890 },
  { query: 'Mascara', count: 3245 },
  { query: 'Skincare', count: 2890 },
  { query: 'Perfume', count: 2340 },
  { query: 'Eyeshadow', count: 1987 },
  { query: 'Blush', count: 1765 },
  { query: 'Highlighter', count: 1543 }
]
