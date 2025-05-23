import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DirectoryItem } from "@/interfaces";
import { nicheConfig } from "@/niche.config"; // Import nicheConfig
import { Clock, MapPin, Phone, Star, StarHalf, Info, Tag, DollarSign, Briefcase } from "lucide-react"; // Added more icons
import Image from "next/image";
import Link from "next/link";

// Helper to get an icon for a field key
const getIconForKey = (key: string, className: string = "mr-2 h-4 w-4 flex-shrink-0") => {
  switch (key) {
    case "address":
    case "location":
      return <MapPin className={className} />;
    case "phone":
      return <Phone className={className} />;
    case "hours":
      return <Clock className={className} />;
    case "price":
      return <DollarSign className={className} />;
    case "category":
    case "cuisine":
      return <Briefcase className={className} />; // Example, choose appropriate
    case "tags":
      return <Tag className={className} />;
    default:
      return <Info className={className} />;
  }
};


interface DirectoryItemCardProps {
  item: DirectoryItem;
}

export default function DirectoryItemCard({ item }: DirectoryItemCardProps) {
  const itemName = item[nicheConfig.itemDisplayNameKey] || item.name || "Unnamed Item";
  const itemImageField = nicheConfig.itemDefinition.fields.find(f => f.key === "image");
  const itemImage = itemImageField && item[itemImageField.key] ? String(item[itemImageField.key]) : null;
  const itemDescriptionField = nicheConfig.itemDefinition.fields.find(f => f.key === "description");


  return (
    <Link href={`/item/${item.slug}`} passHref>
      <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
        {itemImage && (
          <div className="relative h-48 w-full">
            <Image
              src={itemImage}
              alt={itemName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
        )}
        <CardHeader className="flex-grow">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{itemName}</CardTitle>
              {itemDescriptionField?.displayInCard && item[itemDescriptionField.key] && (
                 <CardDescription className="mt-1 text-sm">
                   {String(item[itemDescriptionField.key]).substring(0, 70)}
                   {String(item[itemDescriptionField.key]).length > 70 && "..."}
                 </CardDescription>
              )}
            </div>
            {nicheConfig.itemDefinition.fields.find(f => f.key === "rating" && f.displayInCard) && typeof item.rating === 'number' && (
              <div className="ml-2 flex flex-shrink-0 items-center">
                <StarRating rating={item.rating} />
                {nicheConfig.itemDefinition.fields.find(f => f.key === "reviews" && f.displayInCard) && item.reviews && (
                  <span className="ml-1 text-sm text-muted-foreground">
                    ({item.reviews})
                  </span>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {nicheConfig.itemDefinition.fields.map((field) => {
              if (!field.displayInCard || !item[field.key]) return null;
              // Skip fields already handled explicitly (name, image, rating, reviews, description)
              if (field.key === nicheConfig.itemDisplayNameKey || field.key === "image" || field.key === "rating" || field.key === "reviews" || field.key === "description" || field.key === "slug") {
                return null;
              }

              const value = item[field.key];

              if (field.key === "tags" && Array.isArray(value) && value.length > 0) {
                return (
                  <div key={field.key} className="mt-2 flex flex-wrap gap-2">
                    {value.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                );
              }

              // For other simple fields
              if (typeof value === 'string' || typeof value === 'number') {
                return (
                  <div key={field.key} className="flex items-center text-sm text-muted-foreground">
                    {getIconForKey(field.key)}
                    <span>{field.label}: {String(value)}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

interface StarRatingProps {
  rating: number;
}

function StarRating({ rating }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0 && rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star
          key={`full-star-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      {hasHalfStar && (
        <StarHalf
          key="half-star"
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star
          key={`empty-star-${i}`}
          className="h-4 w-4 text-gray-300"
        />
      ))}
    </div>
  );
}
