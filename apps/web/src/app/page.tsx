import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return(
    <div>
      <p>Hello</p>
      <Link href="/workshop"><Button>Start Engineering</Button></Link>
    </div>
  )
}
