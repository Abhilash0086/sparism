// Sparism QR catalog — product data
// To add a real photo: drop the file into assets/products/ using the exact
// filename listed below (see README.md "Adding product photos").
// Leave "price" as null to show "Price on enquiry" for not-yet-priced items.

const PRODUCTS = [
  {
    id: "body-butter-rose-geranium",
    name: "Body Butter — Rose & Geranium",
    category: "Body",
    price: 300,
    size: "90g",
    tag: "Bestseller",
    image: "assets/products/body-butter-rose-geranium.jpg",
    description:
      "A deeply moisturizing whipped body butter infused with rose and geranium, leaving skin soft, supple and lightly fragranced.",
  },
  {
    id: "root-revival-hair-mask",
    name: "Root Revival Hair Mask",
    category: "Hair",
    price: 300,
    size: "90g",
    image: "assets/products/root-revival-hair-mask.jpg",
    description:
      "A nourishing hair mask that strengthens from root to tip, restoring shine and softness to dry, stressed hair.",
  },
  {
    id: "dewdrop-hydrator",
    name: "Dewdrop Hydrator Moisturizer",
    category: "Face",
    price: 350,
    size: "100g",
    image: "assets/products/dewdrop-hydrator.jpg",
    description:
      "A rose-infused daily moisturizer that locks in hydration for a soft, dewy glow, morning and night.",
  },
  {
    id: "peppermint-frost-bath-salt",
    name: "Peppermint Frost Delight — Foot Soak & Bath Salt",
    category: "Body",
    price: 150,
    size: "150g",
    image: "assets/products/peppermint-frost-bath-salt.jpg",
    description:
      "A cooling mineral soak scented with peppermint, perfect for tired feet and end-of-day relaxation.",
  },
  {
    id: "minty-lavender-foot-butter",
    name: "Foot Butter — Minty Lavender",
    category: "Body",
    price: 270,
    size: "50g",
    image: "assets/products/minty-lavender-foot-butter.jpg",
    description:
      "A rich lavender-mint foot butter that soothes tired soles with deep hydration and a calming scent.",
  },
  {
    id: "lip-balm",
    name: "Lip Balm",
    category: "Lips",
    price: 200,
    size: "10g",
    image: "assets/products/lip-balm-scarlet-glow.jpg",
    description:
      "Nourishing, lightly tinted lip balms in three signature scents — pick your favourite rhythm.",
    variants: [
      { label: "Scarlet Glow", image: "assets/products/lip-balm-scarlet-glow.jpg", swatch: "#7a2035" },
      { label: "Sweet Orange", image: "assets/products/lip-balm-sweet-orange.jpg", swatch: "#e08a3c" },
      { label: "Choco", image: "assets/products/lip-balm-choco.jpg", swatch: "#5c3a28" },
    ],
  },
  {
    id: "deo-shot",
    name: "Deo Shot",
    category: "Body",
    price: 200,
    size: "10g",
    image: "assets/products/deo-shot-citrus-punch.jpg",
    description:
      "A natural solid perfume in a sleek metal sliding tin, gently scented and easy to carry — no harsh chemicals, in two signature scents.",
    variants: [
      { label: "Citrus Punch", image: "assets/products/deo-shot-citrus-punch.jpg", swatch: "#c7b23a" },
      { label: "Rose Silk", image: "assets/products/deo-shot-rose-silk.jpg", swatch: "#e2a0b5" },
    ],
  },
  {
    id: "rosy-earth-clay-mask",
    name: "Rosy Earth Clay Mask",
    category: "Face",
    price: null,
    size: "50g",
    tag: "New",
    image: "assets/products/rosy-earth-clay-mask.jpg",
    description:
      "A mineral-rich clay face mask that draws out impurities while rose extracts keep skin calm and balanced.",
  },
  // Sparism Essentials still removed — not yet live / details unconfirmed.
  // See PRODUCT_IMAGE_PROMPTS.md prompt #12 and LOGO_REDESIGN_PROMPTS.md
  // once ready to add back.
];
