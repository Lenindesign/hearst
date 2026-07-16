import { redirect } from "next/navigation";
import { getHearstDestinationRoute } from "@/lib/hearst-routes";

export default function HearstAllPage() {
  redirect(getHearstDestinationRoute("all"));
}
