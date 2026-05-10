import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

interface Offer {
  id: string;
  title: string;
}

export default function OfferSlider() {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    const path = 'offers';
    const unsubscribe = onSnapshot(collection(db, path), (snapshot) => {
      const offersData = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title
      })) as Offer[];
      setOffers(offersData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, []);

  const containerStyle = "bg-[#E8E1D9] text-[#4A4036] py-2 overflow-hidden relative flex whitespace-nowrap h-[36px]";

  if (offers.length === 0) return <div className={containerStyle} />;

  const displayOffers = offers.map(o => o.title);

  return (
    <div className={containerStyle}>
      <div className="animate-marquee flex space-x-12">
        {/* Repeat enough times to fill screen and loop smoothly */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex space-x-12">
            {displayOffers.map((title, index) => (
              <span key={`${i}-${index}`} className="text-sm font-medium tracking-wide uppercase">
                {title}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
