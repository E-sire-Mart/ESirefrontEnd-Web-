import { useNavigate } from "react-router-dom";

type Props = {};

const categories = [
  { name: "Fruits & Vegetables", icon: "1.avif" },
  { name: "Dairy, Bread & Eggs", icon: "2.avif" },
  { name: "Snacks & Munchies", icon: "3.avif" },
  { name: "Bakery & Biscuits", icon: "4.avif" },
  { name: "Breakfast & Instant Food", icon: "5.webp" },
  { name: "Tea, Coffee & Health Drink", icon: "6.avif" },
  { name: "Cold Drinks & Juices", icon: "7.avif" },
  { name: "Sweet Tooth", icon: "8.avif" },
  { name: "Atta, Rice & Dai", icon: "9.avif" },
  { name: "Masala, Oil & More", icon: "10.avif" },
  { name: "Sauces & Spreads", icon: "11.avif" },
  { name: "Chicken, Meat & Fish", icon: "12.avif" },
  { name: "Organic & Healthy Living", icon: "13.avif" },
  { name: "Paan Corner", icon: "14.avif" },
  { name: "Baby Care", icon: "15.avif" },
  { name: "Pharma & Wellness", icon: "16.webp" },
  { name: "Cleaning Essentials", icon: "17.avif" },
  { name: "Home & Office", icon: "18.webp" },
  { name: "Personal Care", icon: "19.webp" },
  { name: "Pet Care", icon: "20.avif" },
];

const CategoriesList = (props: Props) => {
  const navigate = useNavigate();
  const handleClick = (categoryName: string) => {
    navigate({
      pathname: `/products/category/${categoryName}`
    });    
  }

  return (
    <section className="my-4">
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 my-2">
        {categories.map((category, index) => (
          <div key={index} className="h-48 cursor-pointer"
           onClick={() => handleClick(category.name)}
           >
            <img
              src={`categories/${category.icon}`}
              className="mx-auto h-full w-full object-contain"
              alt={category.name}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesList;
