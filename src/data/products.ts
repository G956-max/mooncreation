export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export const allProducts: Product[] = [
  { id: '1', name: 'Terracotta Vase', price: 45, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800', category: 'Ceramics' },
  { id: '2', name: 'Woven Basket', price: 35, image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=800', category: 'Woven' },
  { id: '3', name: 'Wooden Bowl', price: 55, image: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?auto=format&fit=crop&q=80&w=800', category: 'Wood' },
  { id: '4', name: 'Linen Throw', price: 85, image: 'https://images.unsplash.com/photo-1580870059781-010158fd3ce3?auto=format&fit=crop&q=80&w=800', category: 'Textiles' },
  { id: '5', name: 'Ceramic Mug', price: 25, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800', category: 'Ceramics' },
  { id: '6', name: 'Macrame Wall Hanging', price: 65, image: 'https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?auto=format&fit=crop&q=80&w=800', category: 'Textiles' },
  { id: '7', name: 'Olive Wood Board', price: 75, image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800', category: 'Wood' },
  { id: '8', name: 'Clay Planter', price: 40, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800', category: 'Ceramics' },
  { id: '9', name: 'Hand-poured Candle', price: 30, image: 'https://images.unsplash.com/photo-1602874801007-bd458cb6c975?auto=format&fit=crop&q=80&w=800', category: 'Wax' },
  { id: '10', name: 'Rattan Chair', price: 250, image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800', category: 'Furniture' },
  { id: '11', name: 'Glass Carafe', price: 45, image: 'https://images.unsplash.com/photo-1620248882414-049830c25a72?auto=format&fit=crop&q=80&w=800', category: 'Glass' },
  { id: '12', name: 'Stone Mortar', price: 60, image: 'https://images.unsplash.com/photo-1593006526979-4f8f20636826?auto=format&fit=crop&q=80&w=800', category: 'Stone' },
  { id: '13', name: 'Brass Spoon Set', price: 35, image: 'https://images.unsplash.com/photo-1616645258469-c6876a11b739?auto=format&fit=crop&q=80&w=800', category: 'Metal' },
  { id: '14', name: 'Jute Rug', price: 120, image: 'https://images.unsplash.com/photo-1575414003593-eca319b4a691?auto=format&fit=crop&q=80&w=800', category: 'Textiles' },
  { id: '15', name: 'Leather Journal', price: 45, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800', category: 'Leather' },
  { id: '16', name: 'Copper Kettle', price: 95, image: 'https://images.unsplash.com/photo-1585002131971-ce49247f00d2?auto=format&fit=crop&q=80&w=800', category: 'Metal' },
];

export function getRandomProducts(count: number): Product[] {
  const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
