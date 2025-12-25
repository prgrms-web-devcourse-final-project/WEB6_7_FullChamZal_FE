type Letter = {
  id: string;
  title: string;
  placeName?: string;
  createdAt?: string;
};

type OrderType = "ordered" | "free";

type FirstFormValue = {
  title: string;
  description: string;
  order: "ordered" | "free";
  imageFile: File | null;
};
