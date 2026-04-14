import { Badge } from "@/components/ui/badge";
import type { DealerType } from "@/data/mockData";

const labels: Record<DealerType, string> = {
  new: "New",
  loyal: "Loyal",
  inactive: "Inactive",
  declining: "Declining",
};

const DealerTypeBadge = ({ type }: { type: DealerType }) => (
  <Badge variant={type}>{labels[type]}</Badge>
);

export default DealerTypeBadge;
