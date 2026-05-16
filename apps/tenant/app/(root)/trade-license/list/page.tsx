import { TradeLicenseListView } from "@/modules/trade-license-application/ui/views/trade-license-list-view";

export const metadata = {
  title: "ট্রেড লাইসেন্স তালিকা | UP-Hub",
  description: "ইউনিয়ন পরিষদের ইস্যুকৃত ট্রেড লাইসেন্সসমূহের তালিকা।",
};

export default function TradeLicenseListPage() {
  return <TradeLicenseListView />;
}
