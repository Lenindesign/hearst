import { redirect } from "next/navigation";
import { getHearstDestinationRoute } from "@/lib/hearst-routes";

export default function HearstEditPage() {
  redirect(getHearstDestinationRoute("lifestyle"));
}
