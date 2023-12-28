import { PieChart } from "@/components/PieChart";

export default async function Home() {
  const result = await fetch("http://localhost:3000/list", {
    cache: "no-store",
    method: "GET",
  });

  const data = await result.json();
  return (
    <div>
      <PieChart data={data} />
    </div>
  );
}
