import { CitizensView } from "@/modules/citizen/ui/views/citizens-view";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Citizen Registry | UP-Hub",
    description: "Official registry of validated citizens in the Union Parishad.",
};

export default function CitizensPage() {
    return <CitizensView />;
}
