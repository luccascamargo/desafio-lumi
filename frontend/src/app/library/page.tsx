import { ComponentLibrary } from "@/components/ComponentLibrary";

export default async function Library() {
  const result = await fetch("http://localhost:3000/list", {
    cache: "no-store",
    method: "GET",
  });

  const data = await result.json();
  return (
    <>
      <ComponentLibrary data={data} />
    </>
  );
}
