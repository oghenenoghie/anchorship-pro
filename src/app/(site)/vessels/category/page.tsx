import { permanentRedirect } from "next/navigation";
// /vessels/category has no listing of its own; the catalogue is the category index.
export default function CategoryIndex() { permanentRedirect("/vessels"); }
