import countrys from "@/public/countrys.json";
export default function getCountryByCode(code) {
  return countrys.find((i) => i.country_code === code);
}
